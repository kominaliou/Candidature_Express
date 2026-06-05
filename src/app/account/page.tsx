"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { Settings, CreditCard, LogOut, Loader2, FileText, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) setProfile(data);
      
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    router.push("/");
  };

  const handleStripePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await authenticatedFetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur de connexion à Stripe.");
      }
    } catch {
      toast.error("Erreur serveur.");
    }
    setPortalLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto mt-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-600" />
          Mon Compte
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.user_metadata?.full_name || "Utilisateur"}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Forfait Actuel
              </h3>
              <p className="text-2xl font-black text-gray-900 mb-1">
                {profile?.subscription_status === 'premium' ? 'Premium 🌟' : 
                 profile?.subscription_status === 'pack_candidature' ? 'Pack Candidature 💼' : 'Gratuit 🌱'}
              </p>
              <p className="text-sm text-gray-600">
                {profile?.subscription_status === 'premium' ? 'Accès illimité à toutes les fonctionnalités.' : 
                 'Accès limité. Limite de 3 générations IA/jour.'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Exports Restants
              </h3>
              <p className="text-2xl font-black text-gray-900 mb-1">
                {profile?.subscription_status === 'premium' ? 'Illimités' : Math.max(0, 1 - (profile?.pdf_exports_count || 0))}
              </p>
              <p className="text-sm text-gray-600">
                Exports PDF de CV haute qualité restants.
              </p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Gérez votre facturation</p>
              <p className="text-xs text-gray-500">Mettez à jour votre carte ou annulez votre abonnement via Stripe.</p>
            </div>
            <button 
              onClick={handleStripePortal}
              disabled={portalLoading}
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Gérer l'abonnement
            </button>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-4 text-red-600 font-bold bg-white border border-red-200 rounded-2xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
