"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { ArrowLeft, Search, Briefcase, MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function JobsPage() {
  const params = useParams();
  const router = useRouter();
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  
  // ATS State
  const [savedJobs, setSavedJobs] = useState<Record<string, string>>({}); // title -> status
  const [adaptingCv, setAdaptingCv] = useState<string | null>(null);
  const [expandedSearch, setExpandedSearch] = useState<string | null>(null);

  const fetchSavedJobs = useCallback(async (userId: string, cvId: string) => {
    if (params.id === "preview-mock") return;
    const { data } = await supabase.from('saved_jobs').select('title, status').eq('user_id', userId).eq('cv_id', cvId);
    if (data) {
      const saved: Record<string, string> = {};
      data.forEach(d => saved[d.title] = d.status);
      setSavedJobs(saved);
    }
  }, [params.id]);

  useEffect(() => {
    const fetchCvAndTitles = async () => {
      let currentCvData = null;

      if (params.id === "preview-mock") {
        const localData = typeof window !== "undefined" ? localStorage.getItem("local_cv") : null;
        if (localData) {
          try {
            currentCvData = JSON.parse(localData);
          } catch (e) {
            console.error("Error parsing local CV in jobs page", e);
          }
        }
        if (!currentCvData) {
          currentCvData = {
            personalInfo: { fullName: "Jean Dupont", jobTitle: "Développeur Fullstack", city: "Paris", contractType: "Alternance" },
            experiences: [{ id: 1, title: "Développeur", company: "Tech", startDate: "2022", endDate: "2023", description: "React" }],
            skills: ["React", "Next.js"],
          };
        }
        setCv({ data: currentCvData });

        // Load local saved jobs
        const localSaved = localStorage.getItem("local_saved_jobs");
        if (localSaved) {
          try {
            setSavedJobs(JSON.parse(localSaved));
          } catch(e) {
            console.error(e);
          }
        }
      } else {
        const { data } = await supabase.from('resumes').select('*').eq('id', params.id).single();
        if (data) {
          currentCvData = data.data;
          setCv(data);
        }
      }

      if (currentCvData) {
        setGenerating(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user && params.id !== "preview-mock") {
            await fetchSavedJobs(session.user.id, params.id as string);
          }

          const res = await authenticatedFetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'extract_job_titles', data: { cv: currentCvData }, userId: session?.user?.id || 'mock_user' })
          });
          const json = await res.json();
          if (json.result) {
            setJobs(json.result);
          }
        } catch (err) {
          console.error("Erreur lors de l'extraction des postes", err);
        } finally {
          setGenerating(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCvAndTitles();
  }, [fetchSavedJobs, params.id]);

  const handleSaveJob = async (job: any, status: 'saved' | 'applied') => {
    if (params.id === "preview-mock") {
      const newSavedJobs = { ...savedJobs, [job.title]: status };
      setSavedJobs(newSavedJobs);
      localStorage.setItem("local_saved_jobs", JSON.stringify(newSavedJobs));
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Connectez-vous pour sauvegarder des offres.");

    // Check if already exists
    const { data: existing } = await supabase.from('saved_jobs').select('id').eq('user_id', session.user.id).eq('cv_id', params.id).eq('title', job.title).single();
    
    if (existing) {
      await supabase.from('saved_jobs').update({ status }).eq('id', existing.id);
    } else {
      await supabase.from('saved_jobs').insert({
        user_id: session.user.id,
        cv_id: params.id,
        title: job.title,
        score: job.score,
        advice_json: job.advice,
        status
      });
    }
    setSavedJobs({ ...savedJobs, [job.title]: status });
  };

  const handleAdaptCv = async (job: any) => {
    if (params.id === "preview-mock") return alert("Fonction mockée !");
    setAdaptingCv(job.title);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adapt_cv', data: { jobOffer: job.title, cv: cv.data }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) {
        const newData = { ...cv.data };
        if (json.result.summary) newData.personalInfo.summary = json.result.summary;
        if (json.result.skills) newData.skills = json.result.skills;
        if (json.result.experiences) {
          json.result.experiences.forEach((aiExp: any) => {
            const idx = newData.experiences.findIndex((e: any) => e.id === aiExp.id);
            if (idx !== -1) newData.experiences[idx].description = aiExp.description;
          });
        }
        await supabase.from('resumes').update({ data: newData }).eq('id', params.id);
        setCv({ ...cv, data: newData });
        alert("🎉 Votre CV a été adapté à cette offre avec succès !");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'adaptation.");
    }
    setAdaptingCv(null);
  };

  const getPlatformUrl = (platform: string, title: string, city: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedCity = encodeURIComponent(city || "");
    
    switch (platform) {
      case "LinkedIn": return `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}&location=${encodedCity}`;
      case "Indeed": return `https://fr.indeed.com/jobs?q=${encodedTitle}&l=${encodedCity}`;
      case "France Travail": return `https://candidat.francetravail.fr/offres/recherche?motsCles=${encodedTitle}`;
      case "Welcome to the Jungle": return `https://www.welcometothejungle.com/fr/jobs?query=${encodedTitle}`;
      case "HelloWork": return `https://www.hellowork.com/fr-fr/emploi/recherche.html?k=${encodedTitle}&l=${encodedCity}`;
      case "Apec": return `https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=${encodedTitle}`;
      case "RemoteOK": return `https://remoteok.com/remote-${encodeURIComponent(title.replace(/\s+/g, '-'))}-jobs`;
      case "Wellfound": return `https://wellfound.com/jobs?search=${encodedTitle}`;
      default: return "#";
    }
  };

  const platforms = [
    { name: "LinkedIn", color: "bg-[#0a66c2]", text: "text-white" },
    { name: "Indeed", color: "bg-[#003a9b]", text: "text-white" },
    { name: "France Travail", color: "bg-[#000091]", text: "text-white" },
    { name: "Welcome to the Jungle", color: "bg-[#ffb400]", text: "text-black" },
    { name: "HelloWork", color: "bg-[#ff4f00]", text: "text-white" },
    { name: "Apec", color: "bg-[#00b2a9]", text: "text-white" },
    { name: "RemoteOK", color: "bg-white", text: "text-black", border: "border-2 border-gray-200" },
    { name: "Wellfound", color: "bg-black", text: "text-white" },
    { name: "Glassdoor", color: "bg-[#0caa41]", text: "text-white" },
    { name: "We Work Remotely", color: "bg-[#eb1000]", text: "text-white" },
  ];

  // Helper logic for recommended platforms
  const getRecommendedPlatforms = () => {
    if (!cv) return { recommended: platforms, others: [] };
    const cvText = JSON.stringify(cv.data).toLowerCase();
    
    const recommendedNames = new Set<string>(["LinkedIn", "Indeed"]); // Default baseline

    // Étudiant / Alternance
    if (cvText.includes("alternance") || cvText.includes("stage") || cvText.includes("étudiant") || cvText.includes("junior")) {
      recommendedNames.add("HelloWork");
      recommendedNames.add("Welcome to the Jungle");
      recommendedNames.add("France Travail");
    }
    // Cadre
    if (cvText.includes("cadre") || cvText.includes("manager") || cvText.includes("directeur") || cvText.includes("senior")) {
      recommendedNames.add("Apec");
    }
    // Tech
    if (cvText.includes("développeur") || cvText.includes("tech") || cvText.includes("react") || cvText.includes("it")) {
      recommendedNames.add("Welcome to the Jungle");
      recommendedNames.add("Wellfound");
    }
    // Télétravail
    if (cvText.includes("télétravail") || cvText.includes("remote")) {
      recommendedNames.add("RemoteOK");
      recommendedNames.add("We Work Remotely");
    }
    // International
    if (cvText.includes("international") || cvText.includes("english") || cvText.includes("anglais courant")) {
      recommendedNames.add("Glassdoor");
    }

    // Convert Sets to Arrays and Split
    const recommended = platforms.filter(p => recommendedNames.has(p.name));
    const others = platforms.filter(p => !recommendedNames.has(p.name));
    return { recommended, others };
  };

  const { recommended, others } = getRecommendedPlatforms();

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyse de votre profil en cours...</h2>
        <p className="text-gray-500 text-center max-w-md">L'IA détermine les intitulés de postes les plus pertinents pour votre recherche d'emploi.</p>
      </div>
    );
  }

  if (!cv) {
    return <div className="min-h-screen flex items-center justify-center">CV introuvable.</div>;
  }

  const city = cv.data?.personalInfo?.city || "";
  const contractType = cv.data?.personalInfo?.contractType || "Non spécifié";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <Link href={`/cv/${params.id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="font-bold text-xl text-gray-900">Offres Recommandées</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Contrat visé : {contractType}
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 py-10 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-6">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Votre Stratégie de Recherche</h2>
          <p className="text-gray-600 text-lg">
            Notre IA a analysé votre CV et identifié les mots-clés exacts utilisés par les recruteurs. 
            Cliquez sur les plateformes ci-dessous pour lancer des recherches intelligentes et trouver votre prochain {contractType.toLowerCase()}.
          </p>
        </div>

        <div className="space-y-8">
          {jobs.map((job, index) => {
            // Déterminer la couleur du score
            let scoreColor = "text-emerald-600";
            let scoreBg = "bg-emerald-50 border-emerald-100";
            if (job.score < 85 && job.score >= 65) {
              scoreColor = "text-amber-600";
              scoreBg = "bg-amber-50 border-amber-100";
            } else if (job.score < 65) {
              scoreColor = "text-rose-600";
              scoreBg = "bg-rose-50 border-rose-100";
            }

            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                {/* Liseré indicateur de score */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 ${scoreBg.split(' ')[0]} transition-all group-hover:w-3`}></div>

                <div className="flex flex-col lg:flex-row gap-8 mb-8 border-b border-gray-100 pb-8 pl-4">
                  
                  {/* Info principale */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cible #{index + 1}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${scoreBg} ${scoreColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${scoreColor.replace('text-', 'bg-')} animate-pulse`}></span>
                        {job.score}% - {job.label}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">"{job.title}"</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6 relative">
                      <div className="absolute -left-2 -top-2 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">💡</div>
                      
                      <div className="space-y-4 pl-2 text-sm">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Pourquoi cette offre vous correspond ?</h4>
                          <p className="text-gray-600 leading-relaxed">{job.advice?.whyMatches}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                            <h4 className="font-bold text-emerald-800 mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
                              <span className="text-emerald-500">✓</span> À mettre en avant
                            </h4>
                            <ul className="text-emerald-700 space-y-1 text-xs">
                              {job.advice?.skillsToHighlight?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                            </ul>
                          </div>
                          <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                            <h4 className="font-bold text-rose-800 mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
                              <span className="text-rose-500">⚠</span> Points d'attention
                            </h4>
                            <p className="text-rose-700 text-xs">{job.advice?.missing}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <h4 className="font-bold text-indigo-900 mb-1 text-xs uppercase tracking-wider">✍️ Conseil Lettre de motivation</h4>
                          <p className="text-indigo-700 italic">{job.advice?.letterAdvice}</p>
                        </div>
                      </div>
                    </div>

                    {city && (
                      <p className="text-gray-500 mt-6 flex items-center gap-1 text-sm font-medium mb-6">
                        <MapPin className="w-4 h-4 text-gray-400" /> Secteur : {city}
                      </p>
                    )}

                    {/* ACTIONS RAPIDES */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleAdaptCv(job)}
                        disabled={adaptingCv === job.title}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-bold flex items-center gap-2 border border-indigo-100 transition-colors"
                      >
                        {adaptingCv === job.title ? "⏳ Adaptation..." : "🛠 Adapter mon CV"}
                      </button>
                      
                      <button
                        onClick={() => router.push(`/letter/new?job=${encodeURIComponent(job.title)}&description=${encodeURIComponent(job.advice?.letterAdvice || job.advice?.whyMatches || "")}`)}
                        className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-sm font-bold flex items-center gap-2 border border-purple-100 transition-colors"
                      >
                        📝 Générer lettre
                      </button>

                      <button 
                        onClick={() => setExpandedSearch(expandedSearch === job.title ? null : job.title)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100 transition-colors"
                      >
                        🔍 Chercher l'offre
                      </button>

                      <div className="flex-1 flex justify-end gap-2">
                        <button 
                          onClick={() => handleSaveJob(job, 'saved')}
                          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors ${
                            savedJobs[job.title] === 'saved' || savedJobs[job.title] === 'applied' 
                            ? 'bg-amber-100 text-amber-700 border-amber-200' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          📌 {savedJobs[job.title] ? 'Sauvegardé' : 'Sauvegarder'}
                        </button>
                        <button 
                          onClick={() => handleSaveJob(job, 'applied')}
                          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-colors ${
                            savedJobs[job.title] === 'applied' 
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 border-gray-200'
                          }`}
                        >
                          ✅ {savedJobs[job.title] === 'applied' ? 'Postulé' : 'Marquer postulé'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedSearch === job.title && (
                  <div className="pl-4 border-t border-gray-100 pt-6 mt-4 animate-fade-in">
                    
                    <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-emerald-500" /> Plateformes Recommandées pour votre profil
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                      {recommended.map((platform, pIndex) => (
                        <a 
                          key={`rec-${pIndex}`}
                          href={getPlatformUrl(platform.name, job.title, city)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm ring-2 ring-emerald-400 ring-offset-2 ${platform.color} ${platform.text} ${platform.border || ''}`}
                        >
                          {platform.name}
                        </a>
                      ))}
                    </div>

                    {others.length > 0 && (
                      <details className="group">
                        <summary className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2 cursor-pointer hover:text-gray-900 transition-colors list-none">
                          <span className="group-open:hidden flex items-center gap-1"><ChevronDown className="w-4 h-4" /> Voir d'autres plateformes ({others.length})</span>
                          <span className="hidden group-open:flex items-center gap-1"><ChevronUp className="w-4 h-4" /> Masquer</span>
                        </summary>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {others.map((platform, pIndex) => (
                            <a 
                              key={`oth-${pIndex}`}
                              href={getPlatformUrl(platform.name, job.title, city)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm opacity-80 hover:opacity-100 ${platform.color} ${platform.text} ${platform.border || ''}`}
                            >
                              {platform.name}
                            </a>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-500 text-lg">Aucune recommandation générée. Veuillez vérifier que votre CV contient suffisamment d'informations.</p>
          </div>
        )}

      </main>
    </div>
  );
}
