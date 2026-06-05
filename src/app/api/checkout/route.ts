import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getRuntimeEnvStatus } from '@/lib/runtime-config';
import { AuthenticationError, getAuthenticatedContext } from '@/lib/server-auth';

const runtime = getRuntimeEnvStatus();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plan = String(body?.plan || '').trim();
    const { user, db } = await getAuthenticatedContext(req);
    const userId = user.id;

    if (!['premium', 'pack', 'export'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (runtime.isProduction && !runtime.hasStripe) {
      return NextResponse.json({
        error: 'Paiement non configuré sur ce serveur. Ajoutez STRIPE_SECRET_KEY.',
        productionConfigError: true,
      }, { status: 500 });
    }

    // Simulation de paiement uniquement en mode développement local.
    if (!runtime.hasStripe && runtime.demoMode) {
      try {
        if (plan === 'premium') {
          await db.from('profiles').update({ subscription_status: 'premium' }).eq('id', userId);
        } else if (plan === 'pack') {
          await db.from('profiles').update({ subscription_status: 'pack_candidature' }).eq('id', userId);
        } else if (plan === 'export') {
          const { data: profile } = await db.from('profiles').select('pdf_exports_count').eq('id', userId).single();
          const count = profile?.pdf_exports_count || 0;
          await db.from('profiles').update({ pdf_exports_count: count + 5 }).eq('id', userId);
        }
      } catch (e) {
        console.error('Error updating profile in mock checkout:', e);
      }

      return NextResponse.json({ url: `${siteUrl}/checkout/success?session_id=mock_session_123` });
    }

    let lineItems: any[] = [];
    let mode: 'payment' | 'subscription' = 'payment';

    if (plan === 'premium') {
      mode = 'subscription';
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Abonnement Premium Candidature Express',
            description: 'Générations IA illimitées, accès au suivi ATS, et adaptation de CV.',
          },
          unit_amount: 799, // 7.99 EUR
          recurring: { interval: 'month' as const }
        },
        quantity: 1,
      }];
    } else if (plan === 'pack') {
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Pack Candidature',
            description: 'Recommandations d\'offres, lettre et CV adaptés pour une offre spécifique.',
          },
          unit_amount: 599, // 5.99 EUR
        },
        quantity: 1,
      }];
    } else if (plan === 'export') {
      lineItems = [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Export PDF Unique',
            description: 'Téléchargez votre CV au format PDF haute qualité en un clic.',
          },
          unit_amount: 199, // 1.99€
        },
        quantity: 1,
      }];
    } else {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      client_reference_id: userId,
      metadata: {
        plan: plan,
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Erreur lors du checkout Stripe." }, { status: 500 });
  }
}
