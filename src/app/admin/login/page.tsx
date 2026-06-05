"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign in using Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!authData.user) throw new Error("Erreur de connexion.");

      // 2. Fetch profile to check admin rights
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      let isAdmin = false;
      if (profile) {
        // If column is_admin exists, use it
        if ("is_admin" in profile) {
          isAdmin = !!profile.is_admin;
        } else {
          // Fallback based on email if migration hasn't run yet
          isAdmin = profile.email === "admin@candidature-express.fr" || profile.email === "admin@example.com" || profile.email.includes("admin");
        }
      }

      if (!isAdmin) {
        // Sign out non-admin users immediately
        await supabase.auth.signOut();
        throw new Error("Accès refusé. Cet espace est réservé aux administrateurs.");
      }

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Identifiants invalides ou droits administrateur manquants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#090d16] px-4 relative overflow-hidden transition-colors">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-500/10 dark:bg-red-600/5 blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-orange-500/10 dark:bg-orange-600/5 blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-150 dark:border-gray-800 relative z-10 transition-colors">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-md shadow-red-600/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Espace Administration</h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-8">Veuillez vous connecter avec vos accès administrateur</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Identifiant Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="admin@candidature-express.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-red-600/20 hover:shadow-red-600/35 hover:-translate-y-0.5 mt-2 disabled:opacity-75 disabled:transform-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Accéder à la console"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:underline">Retourner à l'accueil du site</Link>
        </p>
      </div>
    </div>
  );
}
