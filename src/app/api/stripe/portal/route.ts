import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getRuntimeEnvStatus } from '@/lib/runtime-config';
import { AuthenticationError, getAuthenticatedContext } from '@/lib/server-auth';

const runtime = getRuntimeEnvStatus();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16' as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    await req.json().catch(() => ({}));
    const { user } = await getAuthenticatedContext(req);
    const userId = user.id;

    if (runtime.isProduction && !runtime.hasStripe) {
      return NextResponse.json({ error: 'Portail Stripe non configuré pour la production.' }, { status: 503 });
    }

    if (!runtime.hasStripe && runtime.demoMode) {
      return NextResponse.json({ url: "https://billing.stripe.com/p/login/test_dummy" });
    }

    // Récupérer le client Stripe associé à l'utilisateur (normalement on stocke le stripe_customer_id dans la BDD)
    // Ici, par souci de simplicité et puisqu'on ne l'a pas stocké, on va faire une recherche par email
    const { data: userProfile } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
    
    if (!userProfile?.email) {
      return NextResponse.json({ error: "Email non trouvé" }, { status: 404 });
    }

    // Chercher le client dans Stripe
    const customers = await stripe.customers.list({ email: userProfile.email, limit: 1 });
    let customerId = "";

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      return NextResponse.json({ error: "Aucun historique de paiement Stripe trouvé pour cet utilisateur." }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/account`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du portail." }, { status: 500 });
  }
}
