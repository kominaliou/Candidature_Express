import { NextResponse } from 'next/server';
import { AIService } from '@/services/ai.service';
import { getRuntimeEnvStatus } from '@/lib/runtime-config';
import { getPlanLimits, normalizeSubscriptionStatus } from '@/lib/billing';
import { AuthenticationError, getAuthenticatedContext } from '@/lib/server-auth';

const runtime = getRuntimeEnvStatus();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (typeof action !== 'string' || !action.trim()) {
      return NextResponse.json({ error: 'Action IA invalide ou absente.', }, { status: 400 });
    }

    if (runtime.isProduction && !runtime.hasOpenAI) {
      return NextResponse.json({
        error: 'La génération IA n’est pas configurée sur ce serveur. Ajoutez OPENAI_API_KEY.',
        productionConfigError: true,
      }, { status: 500 });
    }

    const auth = await getAuthenticatedContext(req).catch((error) => {
      if (runtime.demoMode && error instanceof AuthenticationError) return null;
      throw error;
    });
    const userId = auth?.user.id;
    const db = auth?.db;

    // MONETIZATION CHECK
    let isPremium = false;
    let isPack = false;

    if (userId && db) {
      const { data: profile } = await db.from('profiles').select('subscription_status').eq('id', userId).single();
      if (profile) {
        const plan = normalizeSubscriptionStatus(profile.subscription_status);
        isPremium = plan === 'premium';
        isPack = plan === 'pack_candidature';
      }
    } else if (runtime.demoMode) {
      isPremium = true;
    }
    
    // Si gratuit, on vérifie la limite quotidienne (3 par jour)
    if (!isPremium && !isPack && userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count } = await db!
        .from('ai_generations_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', today.toISOString());
        
      if (count !== null && count >= getPlanLimits('free').maxAiGenerationsPerDay) {
        return NextResponse.json({ error: "Limite quotidienne atteinte. Passez Premium ou Pack pour continuer.", limitReached: true }, { status: 403 });
      }
    }

    // Helper pour logger l'action
    const logAction = async (actionDesc: string, details?: string) => {
      if (!userId || !db) return;
      try {
        await db.from('ai_generations_log').insert({
          user_id: userId,
          action: actionDesc,
          details
        });
      } catch (logError) {
        console.warn('AI action log skipped:', logError);
      }
    };

    // --- APPELS AISERVICE ---
    if (action === 'generate_letter') {
      const result = await AIService.generateLetter(data);
      await logAction("Génération d'une lettre", data.companyName);
      return NextResponse.json({ result });
    }

    if (action === 'improve_summary') {
      const result = await AIService.improveSummary(data.text);
      await logAction("Amélioration du résumé");
      return NextResponse.json({ result });
    }

    if (action === 'improve_experience') {
      const result = await AIService.improveExperience(data);
      await logAction("Amélioration d'une expérience", data.company);
      return NextResponse.json({ result });
    }

    if (action === 'adapt_cv') {
      if (!isPremium && !isPack) {
        return NextResponse.json({ error: "L'adaptation automatique nécessite l'offre Premium ou Pack.", upgradeRequired: true }, { status: 403 });
      }
      const result = await AIService.adaptCv(data.cv, data.jobOffer);
      await logAction("Adaptation de CV avec IA");
      return NextResponse.json({ result });
    }

    if (action === 'translate_cv') {
      const result = await AIService.translateCv(data.cv, data.targetLanguage);
      await logAction(`Traduction CV vers ${data.targetLanguage}`);
      return NextResponse.json({ result });
    }

    if (action === 'translate_letter') {
      const result = await AIService.translateLetter(data.text, data.targetLanguage);
      await logAction(`Traduction Lettre vers ${data.targetLanguage}`);
      return NextResponse.json({ result });
    }

    if (action === 'job_matching') {
      const result = await AIService.jobMatching(data.cv);
      await logAction("Matching d'offres d'emploi généré");
      return NextResponse.json({ result });
    }

    if (action === 'extract_job_titles') {
      const result = await AIService.extractJobTitles(data.cv);
      await logAction("Recommandations de postes avec Scoring IA");
      return NextResponse.json({ result });
    }

    if (action === 'simulate_dashboard_offers') {
      const result = await AIService.simulateDashboardOffers(data.cv);
      await logAction("Simulation d'offres pour le Dashboard");
      return NextResponse.json({ result });
    }

    if (action === 'search_profile') {
      const result = await AIService.searchProfile(data.cv);
      await logAction("Génération d'un profil de recherche");
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Action non supportée" }, { status: 400 });

  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message, authRequired: true }, { status: 401 });
    }
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Erreur lors de la génération IA." }, { status: 500 });
  }
}
