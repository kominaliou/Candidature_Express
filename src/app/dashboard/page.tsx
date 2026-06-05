"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { Plus, FileText, Mail, LogOut, Loader2, Sparkles, User, Settings, ArrowRight, Briefcase, Edit3 } from "lucide-react";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<any[]>([]);
  const [letters, setLetters] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [dashboardOffers, setDashboardOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);

      // Fetch CVs
      const { data: cvData } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (cvData && cvData.length > 0) {
        setResumes(cvData);
        fetchDashboardOffers(cvData[0].data, session.user.id);
      }

      // Fetch Lettres
      const { data: letterData } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (letterData) setLetters(letterData);

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileData) setProfile(profileData);

      // Fetch AI History
      const { data: aiLogsData } = await supabase
        .from('ai_generations_log')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (aiLogsData) setAiLogs(aiLogsData);

      setLoading(false);
    };
    checkUserAndFetchData();
  }, [router]);

  const fetchDashboardOffers = async (cvData: any, userId: string) => {
    setLoadingOffers(true);
    try {
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_dashboard_offers', data: { cv: cvData }, userId })
      });
      const json = await res.json();
      if (json.result) {
        setDashboardOffers(json.result);
      } else if (json.limitReached) {
        // Free tier daily limit
        setDashboardOffers([]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingOffers(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-xl">Tableau de bord</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/account" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bonjour, {user.user_metadata?.full_name || "Utilisateur"} !</h1>
            <p className="text-gray-600 mt-1">Gérez vos candidatures et créez de nouveaux documents.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link href="/cv/new" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Nouveau CV
            </Link>
            <Link href="/letter/new" className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm">
              <Plus className="w-4 h-4" />
              Nouvelle Lettre
            </Link>
            <Link href="/applications" className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm">
              <Briefcase className="w-4 h-4" />
              Suivi Candidatures
            </Link>
          </div>
        </div>

        {/* Section Statut du compte */}
        <div className={`rounded-2xl p-6 mb-10 text-white flex flex-col sm:flex-row justify-between items-center shadow-lg ${profile?.subscription_status === 'premium' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-gray-900 to-gray-800'}`}>
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-white/80" /> Mon statut: {profile?.subscription_status === 'premium' ? 'PREMIUM' : 'Gratuit'}
            </h3>
            <p className="text-white/80 mt-1 text-sm">
              {profile?.subscription_status === 'premium' 
                ? "Exports et générations illimités 🎉" 
                : `${Math.max(0, 1 - (profile?.pdf_exports_count || 0))} export(s) PDF restant(s)`}
            </p>
          </div>
          {profile?.subscription_status !== 'premium' && (
            <Link href="/pricing" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-md">
              Passer Premium
            </Link>
          )}
        </div>

        {/* NOUVEAU: Offres Recommandées Dashboard */}
        {resumes.length > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Offres recommandées pour vous
              </h2>
              <Link href={`/cv/${resumes[0].id}/jobs`} className="text-sm font-bold text-primary-600 hover:text-primary-700">Voir plus</Link>
            </div>
            
            {loadingOffers ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">L'IA analyse votre profil et cherche les meilleures opportunités...</p>
              </div>
            ) : dashboardOffers.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {dashboardOffers.map((offer, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
                    <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 font-bold text-xs px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                      {offer.score}%
                    </div>
                    <h3 className="font-bold text-gray-900 pr-12">{offer.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">{offer.company}</p>
                    
                    <div className="mt-4 space-y-2 text-xs text-gray-600">
                      <p className="flex items-center gap-1">📍 {offer.location}</p>
                      <p className="flex items-center gap-1">💼 {offer.contractType}</p>
                      <p className="flex items-center gap-1">🌐 {offer.sourceSite}</p>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Link 
                        href={`/cv/${resumes[0].id}/jobs`}
                        className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-2 rounded-lg transition-colors"
                      >
                        Adapter le CV
                      </Link>
                      <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs py-2 rounded-lg border border-gray-200 transition-colors">
                        Voir l'offre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-gray-500">Aucune offre trouvée ou limite quotidienne atteinte pour le forfait gratuit.</p>
              </div>
            )}
          </div>
        )}

        {/* Grille des documents récents */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Mes CV
            </h2>
            
            {resumes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">Aucun CV créé</h3>
                <p className="text-gray-500 text-sm mb-4">Commencez par créer votre premier CV avec l'IA.</p>
                <Link href="/cv/new" className="text-primary-600 font-medium text-sm hover:underline">Créer un CV maintenant</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map(cv => (
                  <div key={cv.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center hover:border-primary-300 hover:shadow-md transition-all">
                    <div>
                      <h3 className="font-bold text-gray-900">{cv.title || 'Mon CV'}</h3>
                      <p className="text-xs text-gray-500 mt-1">Mis à jour le {new Date(cv.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/cv/${cv.id}/edit`} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Modifier le CV">
                        <Edit3 className="w-5 h-5" />
                      </Link>
                      <Link href={`/cv/${cv.id}`} className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors" title="Visualiser le CV">
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              Mes Lettres
            </h2>
            
            {letters.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">Aucune lettre créée</h3>
                <p className="text-gray-500 text-sm mb-4">Générez une lettre adaptée à une offre.</p>
                <Link href="/letter/new" className="text-gray-600 font-medium text-sm hover:underline">Générer une lettre</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {letters.map(letter => (
                  <div key={letter.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col hover:border-gray-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{letter.title || 'Lettre de motivation'}</h3>
                      <span className="text-xs text-gray-500">{new Date(letter.updated_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{letter.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Historique IA */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Historique des générations IA
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {aiLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Aucune action IA récente.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {aiLogs.map((log) => (
                  <li key={log.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <span className="font-semibold text-gray-800">{log.action}</span>
                      {log.details && <p className="text-sm text-gray-500 mt-1">{log.details}</p>}
                    </div>
                    <span className="text-xs text-gray-400 mt-2 sm:mt-0 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
