"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { ArrowLeft, Download, Layout, Sparkles, Wand2, Search, Briefcase, Compass, MapPin, Globe, Check, Copy, ExternalLink, Edit3 } from "lucide-react";
import { CVTemplates, TEMPLATES_LIST } from "@/components/cv-templates";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

// Helper function to dynamically replace modern CSS colors (oklch, lab) with standard colors
// to prevent html2canvas from crashing during PDF export.
const cleanStylesheetsForPDF = async () => {
  if (typeof window === "undefined") return () => {};

  const originalStylesheets = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]')
  ) as (HTMLStyleElement | HTMLLinkElement)[];
  
  const tempStyles: HTMLStyleElement[] = [];

  for (const el of originalStylesheets) {
    try {
      let cssText = "";
      if (el.tagName === "STYLE") {
        cssText = (el as HTMLStyleElement).innerHTML;
      } else if (el.tagName === "LINK") {
        const href = (el as HTMLLinkElement).getAttribute("href");
        if (href) {
          const res = await fetch(href);
          cssText = await res.text();
        }
      }

      if (cssText) {
        // Replace oklch/oklab/lab/lch color functions with a safe fallback hex color (#3b82f6)
        const cleanedText = cssText
          .replace(/oklch\([^)]+\)/g, "#3b82f6")
          .replace(/oklab\([^)]+\)/g, "#3b82f6")
          .replace(/lab\([^)]+\)/g, "#3b82f6")
          .replace(/lch\([^)]+\)/g, "#3b82f6");

        const tempStyleEl = document.createElement("style");
        tempStyleEl.innerHTML = cleanedText;
        document.head.appendChild(tempStyleEl);
        tempStyles.push(tempStyleEl);
      }
    } catch (err) {
      console.warn("Could not process stylesheet for PDF export:", err);
    }
  }

  // Disable original styles to prevent html2canvas from parsing them
  originalStylesheets.forEach((el) => {
    el.disabled = true;
  });

  // Return a restore function
  return () => {
    originalStylesheets.forEach((el) => {
      el.disabled = false;
    });
    tempStyles.forEach((el) => el.remove());
  };
};

export default function CvPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("modern"); 
  const [exporting, setExporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCv = async () => {
      if (params.id === "preview-mock") {
        const localData = typeof window !== "undefined" ? localStorage.getItem("local_cv") : null;
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            setCv({
              title: parsed.personalInfo?.jobTitle || "Mon super CV",
              data: parsed
            });
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing local CV", e);
          }
        }

        setCv({
          title: "Mon super CV",
          data: {
            personalInfo: { fullName: "Jean Dupont", jobTitle: "Développeur Fullstack", email: "jean@exemple.com", phone: "06 12 34 56 78", city: "Paris" },
            experiences: [{ id: 1, title: "Développeur Front-end", company: "Tech Corp", startDate: "2022-01", endDate: "2023-12", description: "Développement d'applications React." }],
            educations: [{ id: 1, degree: "Master Informatique", school: "Université de Paris", startDate: "2020-09", endDate: "2022-06", description: "" }],
            skills: ["React", "Next.js", "TypeScript"],
            languages: ["Français", "Anglais"],
            interests: ["Code", "Design"]
          }
        });
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setCv(data);
        setTemplate(data.template || "modern");
      }
      setLoading(false);
    };

    fetchCv();
  }, [params.id]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // 1. Vérifier le statut de l'utilisateur
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && params.id !== "preview-mock") {
        alert("Connectez-vous pour exporter votre CV.");
        setExporting(false);
        return;
      }

      if (session) {
        const { data: profile } = await supabase.from('profiles').select('subscription_status, pdf_exports_count').eq('id', session.user.id).single();
        if (profile && profile.subscription_status === 'free' && profile.pdf_exports_count >= 1) {
          alert("Vous avez atteint votre limite d'export gratuit. Passez Premium pour des exports illimités !");
          router.push('/pricing');
          setExporting(false);
          return;
        }
      }

      // 2. Exporter le PDF
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      const element = cvRef.current;
      if (!element) {
        throw new Error("L'élément de prévisualisation du CV est introuvable.");
      }
      const opt = {
        margin:       0,
        filename:     `${cv.data?.personalInfo?.fullName || 'CV'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Clean stylesheets temporarily
      const restoreStyles = await cleanStylesheetsForPDF();
      
      try {
        await html2pdf().set(opt as any).from(element).save();
      } finally {
        restoreStyles();
      }

      // 3. Incrémenter le compteur
      if (session && params.id !== "preview-mock") {
        const { data: profile } = await supabase.from('profiles').select('pdf_exports_count').eq('id', session.user.id).single();
        if (profile) {
          await supabase.from('profiles').update({ pdf_exports_count: profile.pdf_exports_count + 1 }).eq('id', session.user.id);
        }
      }

    } catch (err: any) {
      console.error("Erreur lors de l'export PDF:", err);
      alert("Une erreur est survenue lors de l'export : " + (err?.message || String(err)));
    } finally {
      setExporting(false);
    }
  };

  const handleTranslateCv = async (targetLanguage: 'en' | 'fr') => {
    setAiLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'translate_cv', data: { targetLanguage, cv: cv.data }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) {
        setCv({ ...cv, data: json.result });
        if (params.id !== "preview-mock") {
          await supabase.from('resumes').update({ data: json.result }).eq('id', params.id);
        }
        alert(`CV traduit en ${targetLanguage === 'en' ? 'Anglais' : 'Français'} !`);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la traduction.");
    }
    setAiLoading(false);
  };

  const handleChangeTemplate = async (newTemplate: string) => {
    setTemplate(newTemplate);
    if (params.id !== "preview-mock") {
      await supabase.from('resumes').update({ template: newTemplate }).eq('id', params.id);
    }
  };

  const [showAiModal, setShowAiModal] = useState(false);
  const [jobOfferText, setJobOfferText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Job Match Modal State has been moved to the jobs page

  // Search Profile State
  const [showSearchProfileModal, setShowSearchProfileModal] = useState(false);
  const [searchProfile, setSearchProfile] = useState<any>(null);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleGenerateSearchProfile = async () => {
    setIsGeneratingProfile(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search_profile', data: { cv: cv.data }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) {
        setSearchProfile(json.result);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération du profil de recherche.");
    }
    setIsGeneratingProfile(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleAdaptCv = async () => {
    if (!jobOfferText) return;
    setAiLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adapt_cv', data: { jobOffer: jobOfferText, cv: cv.data }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) {
        // Merge result with current data
        const newData = { ...cv.data };
        if (json.result.summary) newData.personalInfo.summary = json.result.summary;
        if (json.result.skills) newData.skills = json.result.skills;
        if (json.result.experiences) {
          json.result.experiences.forEach((aiExp: any) => {
            const idx = newData.experiences.findIndex((e: any) => e.id === aiExp.id);
            if (idx !== -1) newData.experiences[idx].description = aiExp.description;
          });
        }
        
        setCv({ ...cv, data: newData });
        if (params.id !== "preview-mock") {
          await supabase.from('resumes').update({ data: newData }).eq('id', params.id);
        }
        alert("🎉 Votre CV a été adapté et sauvegardé avec succès !");
        setShowAiModal(false);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'adaptation.");
    }
    setAiLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Chargement...</div>;
  if (!cv) return <div className="min-h-screen flex items-center justify-center">CV introuvable.</div>;

  // Normalisation des données pour éviter les crashs de templates en cas de champs vides
  const data = {
    personalInfo: {
      fullName: cv.data?.personalInfo?.fullName || "Non spécifié",
      jobTitle: cv.data?.personalInfo?.jobTitle || "Candidat",
      email: cv.data?.personalInfo?.email || "",
      phone: cv.data?.personalInfo?.phone || "",
      city: cv.data?.personalInfo?.city || "",
      linkedin: cv.data?.personalInfo?.linkedin || "",
      photoUrl: cv.data?.personalInfo?.photoUrl || "",
      summary: cv.data?.personalInfo?.summary || "",
      contractType: cv.data?.personalInfo?.contractType || "CDI",
    },
    experiences: cv.data?.experiences || [],
    educations: cv.data?.educations || [],
    skills: cv.data?.skills || [],
    languages: cv.data?.languages || [],
    interests: cv.data?.interests || [],
  };
  
  // Rendu dynamique du modèle
  const SelectedTemplate = CVTemplates[template] || CVTemplates['modern'];

  const categories = ["Tous", ...Array.from(new Set(TEMPLATES_LIST.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "Tous" ? TEMPLATES_LIST : TEMPLATES_LIST.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-xl hidden md:block">Prévisualisation de votre CV</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleTranslateCv('en')} disabled={aiLoading} className="hidden lg:block text-sm font-medium text-gray-500 hover:text-gray-900 px-2 disabled:opacity-50">
            EN
          </button>
          <button onClick={() => handleTranslateCv('fr')} disabled={aiLoading} className="hidden lg:block text-sm font-medium text-gray-500 hover:text-gray-900 px-2 border-r pr-4 disabled:opacity-50">
            FR
          </button>
          <Link href="/letter/new" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            Générer une Lettre
          </Link>
          <Link href={`/cv/${params.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Modifier le CV</span>
          </Link>
          <Link href={`/cv/${params.id}/jobs`} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium transition-colors border border-emerald-100 shadow-sm">
            🎯 <span className="hidden sm:inline">Offres Recommandées</span>
          </Link>
          <button 
            onClick={() => { setShowSearchProfileModal(true); if(!searchProfile) handleGenerateSearchProfile(); }} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium transition-colors border border-blue-100 shadow-sm"
          >
            🔍 <span className="hidden sm:inline">Profil de Recherche</span>
          </button>
          <button onClick={() => setShowAiModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-medium transition-colors border border-indigo-100 shadow-sm">
            <Wand2 className="w-4 h-4" /> <span className="hidden sm:inline">Optimiser avec l'IA</span>
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-md shadow-primary-600/20 disabled:opacity-70"
          >
            {exporting ? <span className="animate-pulse">Export...</span> : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MODAL IA */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold text-xl">&times;</button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Adapter le CV à une offre</h2>
                <p className="text-gray-500 text-sm">L'IA va analyser l'offre et réécrire vos expériences pour matcher parfaitement.</p>
              </div>
            </div>
            <textarea 
              rows={8} 
              value={jobOfferText} 
              onChange={(e) => setJobOfferText(e.target.value)} 
              className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-indigo-50/30 mb-6" 
              placeholder="Collez l'annonce ou l'offre d'emploi ici..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAiModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Annuler</button>
              <button 
                onClick={handleAdaptCv}
                disabled={aiLoading || !jobOfferText}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-70"
              >
                {aiLoading ? "Magie en cours..." : "Lancer la Magie IA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale déplacée dans la page dédiée */}

      {/* SEARCH PROFILE MODAL */}
      {showSearchProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-[#f8fafc] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative animate-fade-in text-gray-800">
            {/* Header */}
            <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">🔍</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Votre Profil de Recherche</h2>
                  <p className="text-gray-500 text-sm">Généré automatiquement par l'IA à partir de votre CV pour optimiser vos candidatures</p>
                </div>
              </div>
              <button onClick={() => setShowSearchProfileModal(false)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl transition-colors">&times;</button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {isGeneratingProfile ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Analyse de votre CV par l'IA...</h3>
                  <p className="text-gray-500 text-center max-w-md">Nous extrayons les meilleurs mots-clés, cibles et plateformes pour booster votre recherche.</p>
                </div>
              ) : searchProfile ? (
                <div className="space-y-8">
                  {/* Niveau d'expérience & Secteurs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-white/80">
                          <Sparkles className="w-5 h-5" />
                          <span className="text-xs uppercase font-bold tracking-wider">Niveau d'expérience</span>
                        </div>
                        <h4 className="text-xl font-extrabold">{searchProfile.experienceLevel}</h4>
                      </div>
                      <p className="text-xs text-white/70 mt-4">Estimé à partir de vos formations et expériences professionnelles.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm md:col-span-2">
                      <div className="flex items-center gap-2 mb-3 text-gray-500">
                        <Compass className="w-5 h-5 text-blue-500" />
                        <span className="text-xs uppercase font-bold tracking-wider">Secteurs adaptés</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchProfile.sectors?.map((sector: string, idx: number) => (
                          <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-semibold border border-blue-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mots-clés & Métiers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Search className="w-5 h-5 text-indigo-500" />
                          <span className="text-xs uppercase font-bold tracking-wider">Mots-clés de recherche</span>
                        </div>
                        <span className="text-[10px] text-gray-400">Cliquez pour copier</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchProfile.keywords?.map((keyword: string, idx: number) => {
                          const id = `kw-${idx}`;
                          const isCopied = copiedItem === id;
                          return (
                            <button
                              key={idx}
                              onClick={() => copyToClipboard(keyword, id)}
                              className={`group px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                                isCopied 
                                  ? "bg-green-50 text-green-700 border-green-200" 
                                  : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100 hover:border-gray-200"
                              }`}
                            >
                              {keyword}
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Briefcase className="w-5 h-5 text-purple-500" />
                          <span className="text-xs uppercase font-bold tracking-wider">Intitulés de poste possibles</span>
                        </div>
                        <span className="text-[10px] text-gray-400">Cliquez pour copier</span>
                      </div>
                      <div className="space-y-2">
                        {searchProfile.jobTitles?.map((title: string, idx: number) => {
                          const id = `jt-${idx}`;
                          const isCopied = copiedItem === id;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => copyToClipboard(title, id)}
                              className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                                isCopied 
                                  ? "bg-green-50 border-green-200 text-green-800" 
                                  : "bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200 text-gray-700"
                              }`}
                            >
                              <span className="font-semibold text-sm">{title}</span>
                              {isCopied ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Villes pertinentes */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span className="text-xs uppercase font-bold tracking-wider">Villes & Zones de recherche clés</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {searchProfile.cities?.map((city: string, idx: number) => (
                        <div key={idx} className="bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          {city}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sites recommandés */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                      <Globe className="w-5 h-5 text-teal-500" />
                      <span className="text-xs uppercase font-bold tracking-wider">Sites recommandés pour postuler</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchProfile.recommendedSites?.map((site: any, idx: number) => (
                        <a 
                          key={idx}
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900 text-base group-hover:text-teal-600 transition-colors">{site.name}</h4>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{site.reason}</p>
                          </div>
                          <span className="text-xs text-teal-600 font-bold mt-4 inline-flex items-center gap-1">
                            Rechercher des offres sur {site.name} &rarr;
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p>Aucun profil disponible.</p>
                  <button onClick={handleGenerateSearchProfile} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Générer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar des modèles */}
        <div className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col hidden md:flex h-[calc(100vh-73px)]">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 shrink-0">
            <Layout className="w-4 h-4" />
            Galerie de Modèles ({TEMPLATES_LIST.length}/30)
          </h2>
          
          <div className="mb-4 shrink-0 overflow-x-auto pb-2 flex gap-2 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredTemplates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleChangeTemplate(tpl.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  template === tpl.id 
                    ? "border-primary-500 bg-primary-50" 
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold text-gray-900 flex justify-between items-center">
                  {tpl.name}
                  <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-sm">{tpl.category}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">{tpl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Zone de prévisualisation */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-200/50 h-[calc(100vh-73px)]">
          <div className="shadow-2xl rounded-sm overflow-hidden bg-white" style={{ width: '210mm', minHeight: '297mm' }}>
            <div ref={cvRef} className="cv-document-container">
              <SelectedTemplate data={data} />
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aaa; 
        }
      `}</style>
    </div>
  );
}
