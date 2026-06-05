"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { isAdminUser, shouldUseMockUserFallback } from "@/lib/admin-guard";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  Mail, 
  ArrowLeft, 
  LogOut, 
  Loader2, 
  Search, 
  UserCheck, 
  UserMinus, 
  Shield, 
  Award 
} from "lucide-react";

type AdminProfile = {
  id: string;
  email: string;
  full_name?: string | null;
  subscription_status?: string | null;
  is_admin?: boolean | null;
  created_at: string;
  pdf_exports_count?: number | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalResumes: 0,
    totalLetters: 0,
  });
  const [usersList, setUsersList] = useState<AdminProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      // 2. Fetch Resumes count
      const { count: resumesCount } = await supabase
        .from("resumes")
        .select("id", { count: "exact", head: true });

      // 3. Fetch Cover Letters count
      const { count: lettersCount } = await supabase
        .from("cover_letters")
        .select("id", { count: "exact", head: true });

      const loadedUsers = (profiles || []) as AdminProfile[];

      const demoFallbackEnabled = shouldUseMockUserFallback(loadedUsers, {
        allowDemoFallback: process.env.NODE_ENV !== "production",
        nodeEnv: process.env.NODE_ENV || "development",
      });

      if (demoFallbackEnabled) {
        throw new Error("Admin dashboard needs a real user list from Supabase. Demo fallback is disabled in production and should not be used in normal app runs.");
      }

      if (loadedUsers.length === 0) {
        console.warn("No users returned for admin dashboard. This usually means the RLS policy is missing or the admin account is not present.");
      }

      setUsersList(loadedUsers);

      // Compute statistics
      const total = loadedUsers.length;
      const premium = loadedUsers.filter(u => u.subscription_status === "premium").length;
      
      setStats({
        totalUsers: total,
        premiumUsers: premium,
        totalResumes: resumesCount || 0,
        totalLetters: lettersCount || 0,
      });

    } catch (err) {
      console.error("Error loading admin dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        const isAdmin = isAdminUser(profile, session.user.email ?? "");

        if (!isAdmin) {
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        await loadDashboardData();
      } catch (err) {
        console.error("Admin auth check failed:", err);
        router.push("/admin/login");
      }
    };

    checkAdmin();
  }, [loadDashboardData, router]);

  const handleTogglePremium = async (userId: string, currentStatus?: string | null) => {
    setUpdatingUserId(userId);
    setInfoMessage(null);
    const newStatus = currentStatus === "premium" ? "free" : "premium";

    try {
      // 1. Try database update
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_status: newStatus })
        .eq("id", userId);

      // 2. Update local state
      setUsersList(prev => 
        prev.map(u => u.id === userId ? { ...u, subscription_status: newStatus } : u)
      );

      // Update total stats
      setStats(prev => ({
        ...prev,
        premiumUsers: prev.premiumUsers + (newStatus === "premium" ? 1 : -1)
      }));

      if (error) {
        // Safe local simulation fallback if RLS policy has not been configured in SQL console yet
        console.warn("DB update failed (likely RLS policy). Simulating locally:", error.message);
        setInfoMessage(`Statut simulé localement : ${newStatus === 'premium' ? 'Premium activé' : 'Premium désactivé'} pour l'utilisateur.`);
      } else {
        setInfoMessage(`Le statut Premium de l'utilisateur a été mis à jour avec succès en base de données.`);
      }
    } catch (err: any) {
      console.error("Toggle premium error:", err);
    } finally {
      setUpdatingUserId(null);
      // Auto-clear message
      setTimeout(() => setInfoMessage(null), 5000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const filteredUsers = usersList.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#090d16] transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-semibold animate-pulse">Chargement de la console d'administration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090d16] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Admin Navbar */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200/60 dark:border-gray-800/60 sticky top-0 z-50 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-650 dark:text-gray-400" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-md shadow-red-650/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">Console d'Administration</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-gray-650 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Quitter
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Banner Informative */}
        {infoMessage && (
          <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm border border-emerald-100 dark:border-emerald-900/30 shadow-sm animate-fade-in">
            {infoMessage}
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-905 dark:text-white">Tableau de bord Général</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Surveillez l'activité des utilisateurs et gérez leurs forfaits SaaS.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Utilisateurs inscrits", value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-500" />, bg: "from-blue-500/10 to-indigo-500/5 border-blue-500/20" },
            { label: "Membres Premium", value: stats.premiumUsers, icon: <Award className="w-6 h-6 text-amber-500" />, bg: "from-amber-500/10 to-orange-500/5 border-amber-500/20" },
            { label: "CVs Générés", value: stats.totalResumes, icon: <FileText className="w-6 h-6 text-purple-500" />, bg: "from-purple-500/10 to-pink-500/5 border-purple-500/20" },
            { label: "Lettres Rédigées", value: stats.totalLetters, icon: <Mail className="w-6 h-6 text-emerald-500" />, bg: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20" }
          ].map((item, index) => (
            <div key={index} className={`bg-gradient-to-br ${item.bg} border rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500 dark:text-gray-400">{item.label}</span>
                {item.icon}
              </div>
              <span className="text-3xl font-black text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Users Management Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200/60 dark:border-gray-800/60 shadow-sm transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestion des Comptes Utilisateurs</h2>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-450 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none text-sm transition-colors focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-850 text-xs uppercase font-bold text-gray-550 dark:text-gray-400">
                  <th className="pb-4 pt-2 pl-4">Utilisateur</th>
                  <th className="pb-4 pt-2">Date d'inscription</th>
                  <th className="pb-4 pt-2 text-center">Exports PDF</th>
                  <th className="pb-4 pt-2">Statut Forfait</th>
                  <th className="pb-4 pt-2 text-right pr-4">Action Abonnement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850 text-sm">
                {filteredUsers.map((user) => {
                  const isUserPremium = user.subscription_status === "premium";
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              {user.full_name || "Nom non renseigné"}
                              {user.is_admin && <span className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md">ADMIN</span>}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-center font-semibold text-gray-900 dark:text-white">
                        {user.pdf_exports_count}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isUserPremium 
                            ? "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30" 
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUserPremium ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`}></span>
                          {isUserPremium ? "Premium" : "Gratuit"}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4">
                        {user.is_admin ? (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic pr-3">Non modifiable</span>
                        ) : (
                          <button
                            onClick={() => handleTogglePremium(user.id, user.subscription_status)}
                            disabled={updatingUserId === user.id}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              isUserPremium 
                                ? "bg-red-50 hover:bg-red-100 text-red-650 border border-red-150 dark:bg-red-950/20 dark:hover:bg-red-950/30 dark:text-red-400 dark:border-red-900/30" 
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-150 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30"
                            }`}
                          >
                            {updatingUserId === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isUserPremium ? (
                              <><UserMinus className="w-3.5 h-3.5" /> Retirer Premium</>
                            ) : (
                              <><UserCheck className="w-3.5 h-3.5" /> Rendre Premium</>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                      Aucun utilisateur ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
