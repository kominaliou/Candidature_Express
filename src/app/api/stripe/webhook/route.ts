import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getRuntimeEnvStatus } from '@/lib/runtime-config';
import { normalizeSubscriptionStatus } from '@/lib/billing';

const runtime = getRuntimeEnvStatus();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  if (!runtime.hasStripe && runtime.demoMode) {
    return NextResponse.json({ received: true, mocked: true });
  }

  if (runtime.isProduction && !runtime.hasStripe) {
    return NextResponse.json({ error: 'Stripe non configuré pour la production.' }, { status: 503 });
  }

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Gérer l'événement
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const plan = session.metadata?.plan;

        if (!userId) throw new Error('No client_reference_id found in session');

        if (plan === 'premium') {
          await supabaseAdmin.from('profiles').update({
            subscription_status: normalizeSubscriptionStatus('premium'),
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
          console.log(`Utilisateur ${userId} passé en premium.`);
        } else if (plan === 'pack') {
          await supabaseAdmin.from('profiles').update({
            subscription_status: normalizeSubscriptionStatus('pack_candidature'),
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
          console.log(`Utilisateur ${userId} a acheté le pack candidature.`);
        } else if (plan === 'export') {
          const { data: profile } = await supabaseAdmin.from('profiles').select('pdf_exports_count').eq('id', userId).single();
          if (profile) {
            await supabaseAdmin.from('profiles').update({
              pdf_exports_count: Math.max(0, Number(profile.pdf_exports_count || 0) + 5),
              updated_at: new Date().toISOString(),
            }).eq('id', userId);
            console.log(`Utilisateur ${userId} a acheté un pack d'exports supplémentaire.`);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded':
        console.log('Facture payée (renouvellement)');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Erreur de mise à jour BDD webhook:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
