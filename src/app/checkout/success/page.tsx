"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 max-w-lg w-full p-10 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement validé !</h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre achat. Vos avantages ont été activés avec succès sur votre compte. Vous pouvez dès à présent profiter de toutes les fonctionnalités.
        </p>
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
        >
          Retour au Dashboard <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
