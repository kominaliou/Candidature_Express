"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Veuillez vous connecter pour procéder au paiement.");
        router.push("/register");
        return;
      }

      const res = await authenticatedFetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: session.user.id })
      });

      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      } else {
        alert(data.error || "Erreur lors de l'initialisation du paiement.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-50 dark:bg-[#090d16] transition-colors duration-300">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-500/10 dark:bg-primary-600/5 blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

      <header className="px-6 py-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-md shadow-primary-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Candidature Express IA</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors text-sm">
              Mon compte
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Investissez dans votre avenir</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Des tarifs simples et transparents pour vous aider à décrocher le job de vos rêves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Gratuit */}
            <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gratuit</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Pour tester la puissance de l'IA.</p>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-8">0€</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 shrink-0" /> 
                  Création d'un seul CV
                </li>
                <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 shrink-0" /> 
                  1 export PDF gratuit
                </li>
                <li className="flex gap-3 text-gray-400 dark:text-gray-600 text-sm opacity-50">
                  <CheckCircle2 className="w-5.5 h-5.5 text-gray-300 dark:text-gray-600 shrink-0" /> 
                  Pas de lettre de motivation
                </li>
              </ul>
              <Link href="/register" className="block text-center w-full py-3.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold transition-colors">
                Commencer gratuitement
              </Link>
            </div>

            {/* Pack Candidature */}
            <div className="bg-gray-900 dark:bg-gray-950 rounded-3xl p-8 border border-gray-800 dark:border-primary-500/20 shadow-xl flex flex-col relative transform md:-translate-y-4 scale-105 transition-all duration-300 text-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                Le plus populaire
              </div>
              <h3 className="text-2xl font-bold mb-2">Pack Candidature</h3>
              <p className="text-gray-400 mb-6 text-sm">Pour une offre spécifique (One-shot).</p>
              <div className="text-5xl font-black mb-8">5,99€ <span className="text-base text-gray-500 font-normal">/ fois</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-400 shrink-0" /> 
                  Génération d'un CV optimisé
                </li>
                <li className="flex gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-400 shrink-0" /> 
                  Génération d'une lettre de motivation
                </li>
                <li className="flex gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-400 shrink-0" /> 
                  Export PDF haute qualité inclus
                </li>
                <li className="flex gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-400 shrink-0" /> 
                  Adaptation parfaite à 1 offre
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('pack')}
                disabled={loading === 'pack'}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 disabled:opacity-70"
              >
                {loading === 'pack' ? "Redirection..." : "Acheter le pack"} <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Pour les chercheurs d'emploi actifs.</p>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-8">7,99€ <span className="text-base text-gray-500 font-normal">/ mois</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-600 dark:text-primary-400 shrink-0" /> 
                  CV et lettres illimités
                </li>
                <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-600 dark:text-primary-400 shrink-0" /> 
                  Exports PDF illimités
                </li>
                <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-600 dark:text-primary-400 shrink-0" /> 
                  Traduction automatique (FR/EN)
                </li>
                <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary-600 dark:text-primary-400 shrink-0" /> 
                  Accès à tous les modèles Premium
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('premium')}
                disabled={loading === 'premium'}
                className="w-full py-3.5 px-4 bg-primary-100 hover:bg-primary-200 dark:bg-primary-500/10 dark:hover:bg-primary-500/20 text-primary-800 dark:text-primary-300 rounded-2xl font-bold transition-all disabled:opacity-70"
              >
                {loading === 'premium' ? "Redirection..." : "S'abonner"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
