"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function NewCvPage() {
  const router = useRouter();
  const DRAFT_KEY = "cv_new_draft";
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null); // 'summary', 'exp_1', 'adapt'
  const [activeTab, setActiveTab] = useState("infos"); // infos, experiences, formations, competences, ai_adapt
  const [pendingDraft, setPendingDraft] = useState<any | null>(null);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [jobOfferText, setJobOfferText] = useState("");

  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    jobTitle: "",
    summary: "",
    linkedin: "",
    photoUrl: "",
    contractType: "CDI", // Valeur par défaut
  });

  const [experiences, setExperiences] = useState([{ id: 1, title: "", company: "", startDate: "", endDate: "", description: "" }]);
  const [educations, setEducations] = useState([{ id: 1, degree: "", school: "", startDate: "", endDate: "", description: "" }]);
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [interests, setInterests] = useState("");

  const buildCvData = useCallback(() => ({
    personalInfo,
    experiences,
    educations,
    skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    languages: languages.split(',').map(s => s.trim()).filter(Boolean),
    interests: interests.split(',').map(s => s.trim()).filter(Boolean),
  }), [educations, experiences, interests, languages, personalInfo, skills]);

  const populateFromCvData = (cvData: any) => {
    if (!cvData) return;
    setPersonalInfo({
      fullName: cvData.personalInfo?.fullName || "",
      email: cvData.personalInfo?.email || "",
      phone: cvData.personalInfo?.phone || "",
      city: cvData.personalInfo?.city || "",
      jobTitle: cvData.personalInfo?.jobTitle || "",
      summary: cvData.personalInfo?.summary || "",
      linkedin: cvData.personalInfo?.linkedin || "",
      photoUrl: cvData.personalInfo?.photoUrl || "",
      contractType: cvData.personalInfo?.contractType || "CDI",
    });
    setExperiences(cvData.experiences?.length ? cvData.experiences : [{ id: 1, title: "", company: "", startDate: "", endDate: "", description: "" }]);
    setEducations(cvData.educations?.length ? cvData.educations : [{ id: 1, degree: "", school: "", startDate: "", endDate: "", description: "" }]);
    setSkills(Array.isArray(cvData.skills) ? cvData.skills.join(", ") : cvData.skills || "");
    setLanguages(Array.isArray(cvData.languages) ? cvData.languages.join(", ") : cvData.languages || "");
    setInterests(Array.isArray(cvData.interests) ? cvData.interests.join(", ") : cvData.interests || "");
  };

  const hasMeaningfulCvData = useCallback((cvData: any) => {
    return Boolean(
      cvData.personalInfo.fullName ||
      cvData.personalInfo.email ||
      cvData.personalInfo.jobTitle ||
      cvData.personalInfo.summary ||
      cvData.experiences.some((exp: any) => exp.title || exp.company || exp.description) ||
      cvData.educations.some((edu: any) => edu.degree || edu.school) ||
      cvData.skills.length ||
      cvData.languages.length ||
      cvData.interests.length
    );
  }, []);

  const validateCv = () => {
    const errors: string[] = [];
    if (!personalInfo.fullName.trim()) errors.push("Ajoutez votre nom complet.");
    if (!personalInfo.jobTitle.trim()) errors.push("Indiquez le poste recherché.");
    if (!personalInfo.email.trim()) {
      errors.push("Ajoutez une adresse email.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      errors.push("Vérifiez le format de l'adresse email.");
    }
    if (!personalInfo.summary.trim()) errors.push("Ajoutez un résumé de profil, même court.");
    if (!experiences.some(exp => exp.title.trim() && exp.company.trim())) errors.push("Ajoutez au moins une expérience avec un poste et une entreprise.");
    return errors;
  };

  const progressItems = [
    { label: "Identité", done: Boolean(personalInfo.fullName && personalInfo.email) },
    { label: "Cible", done: Boolean(personalInfo.jobTitle) },
    { label: "Résumé", done: Boolean(personalInfo.summary) },
    { label: "Expérience", done: experiences.some(exp => exp.title && exp.company) },
    { label: "Compétences", done: Boolean(skills.trim()) },
  ];
  const completedProgress = progressItems.filter(item => item.done).length;

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (!savedDraft) return;
    try {
      const parsed = JSON.parse(savedDraft);
      if (parsed?.data) {
        setPendingDraft(parsed);
      }
    } catch (e) {
      console.error("Unable to parse CV draft", e);
    }
  }, [DRAFT_KEY]);

  useEffect(() => {
    const cvData = buildCvData();
    if (!hasMeaningfulCvData(cvData)) return;

    const timeout = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt, data: cvData }));
      setLastDraftSavedAt(savedAt);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [buildCvData, hasMeaningfulCvData, DRAFT_KEY]);

  const restoreDraft = () => {
    if (!pendingDraft?.data) return;
    populateFromCvData(pendingDraft.data);
    setPendingDraft(null);
    setLastDraftSavedAt(pendingDraft.savedAt || null);
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setPendingDraft(null);
  };

  const addExperience = () => setExperiences([...experiences, { id: Date.now(), title: "", company: "", startDate: "", endDate: "", description: "" }]);
  const removeExperience = (id: number) => setExperiences(experiences.filter(exp => exp.id !== id));

  const addEducation = () => setEducations([...educations, { id: Date.now(), degree: "", school: "", startDate: "", endDate: "", description: "" }]);
  const removeEducation = (id: number) => setEducations(educations.filter(edu => edu.id !== id));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPersonalInfo({ ...personalInfo, photoUrl: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const errors = validateCv();
    if (errors.length > 0) {
      setValidationErrors(errors);
      if (errors.some(error => error.includes("expérience"))) {
        setActiveTab("experiences");
      } else {
        setActiveTab("infos");
      }
      return;
    }

    setValidationErrors([]);
    setLoading(true);
    // Sauvegarder dans Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    const cvData = buildCvData();

    if (session) {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: session.user.id,
          title: personalInfo.jobTitle || 'Mon CV',
          data: cvData,
          template: 'modern'
        })
        .select()
        .single();

      if (!error && data) {
        // Enregistrer aussi localement pour prévisualisation rapide / fallback
        localStorage.setItem("local_cv", JSON.stringify(cvData));
        localStorage.removeItem(DRAFT_KEY);
        // Redirection vers la prévisualisation
        router.push(`/cv/${data.id}`);
      } else {
        alert("Erreur lors de la sauvegarde du CV");
      }
    } else {
      // Mock: on redirige vers un faux ID si non connecté
      localStorage.setItem("local_cv", JSON.stringify(cvData));
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/cv/preview-mock`);
    }
    setLoading(false);
  };

  const handleImproveSummary = async () => {
    if (!personalInfo.summary) return;
    setAiLoading("summary");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve_summary', data: { text: personalInfo.summary }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) setPersonalInfo({ ...personalInfo, summary: json.result });
    } catch (e) {
      console.error(e);
    }
    setAiLoading(null);
  };

  const handleImproveExperience = async (index: number) => {
    const exp = experiences[index];
    if (!exp.description) return;
    setAiLoading(`exp_${exp.id}`);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve_experience', data: { title: exp.title, company: exp.company, description: exp.description }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) {
        const newExp = [...experiences];
        newExp[index].description = json.result;
        setExperiences(newExp);
      }
    } catch (e) {
      console.error(e);
    }
    setAiLoading(null);
  };

  const handleAdaptCV = async () => {
    if (!jobOfferText) return;
    setAiLoading("adapt");
    try {
      const cvData = {
        summary: personalInfo.summary,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        experiences: experiences.map(e => ({ id: e.id, description: e.description }))
      };

      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adapt_cv', data: { jobOffer: jobOfferText, cv: cvData }, userId: session?.user?.id })
      });
      const json = await res.json();
      if (json.result) {
        // Update states based on JSON result
        if (json.result.summary) setPersonalInfo(prev => ({ ...prev, summary: json.result.summary }));
        if (json.result.skills) setSkills(json.result.skills.join(', '));
        if (json.result.experiences) {
          const newExp = [...experiences];
          json.result.experiences.forEach((aiExp: any) => {
            const idx = newExp.findIndex(e => e.id === aiExp.id);
            if (idx !== -1) newExp[idx].description = aiExp.description;
          });
          setExperiences(newExp);
        }
        alert("🎉 Votre CV a été adapté à l'offre avec succès !");
        setActiveTab("infos"); // Revenir au début pour voir les changements
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur s'est produite lors de l'adaptation.");
    }
    setAiLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-bold text-xl text-gray-900">Créer un nouveau CV</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-medium transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Sauvegarder
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 sticky top-24">
            {[
              { id: "infos", label: "Informations perso" },
              { id: "experiences", label: "Expériences" },
              { id: "formations", label: "Formations" },
              { id: "competences", label: "Compétences & Plus" },
              { id: "ai_adapt", label: "✨ Adapter à une offre" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-primary-50 text-primary-700 border border-primary-100" 
                    : tab.id === "ai_adapt" ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            <div className="mt-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hidden md:block">
              <Sparkles className="w-5 h-5 text-indigo-500 mb-2" />
              <h3 className="font-semibold text-indigo-900 text-sm mb-1">Coup de pouce IA</h3>
              <p className="text-xs text-indigo-700 mb-3">Remplissez les bases, l'IA s'occupera d'améliorer le texte et de le rendre professionnel.</p>
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 hidden md:block">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Progression</h3>
                <span className="text-xs font-bold text-primary-600">{completedProgress}/{progressItems.length}</span>
              </div>
              <div className="space-y-2">
                {progressItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${item.done ? "bg-emerald-500" : "bg-gray-300"}`} />
                    <span className={item.done ? "text-gray-800 font-medium" : "text-gray-500"}>{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-gray-500">
                {lastDraftSavedAt ? `Brouillon sauvegardé à ${new Date(lastDraftSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : "Brouillon auto dès les premières saisies."}
              </p>
            </div>
          </nav>
        </div>

        {/* Formulaire */}
        <div className="flex-1 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          {pendingDraft && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-amber-900 text-sm">Brouillon retrouvé</p>
                <p className="text-amber-800 text-xs">
                  Sauvegardé le {new Date(pendingDraft.savedAt).toLocaleString('fr-FR')}. Vous pouvez reprendre sans perdre votre saisie.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={restoreDraft} className="px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700">
                  Reprendre
                </button>
                <button onClick={discardDraft} className="px-3 py-2 rounded-lg bg-white text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100">
                  Ignorer
                </button>
              </div>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4" role="alert">
              <p className="font-bold text-rose-900 text-sm mb-2">Quelques informations manquent avant de sauvegarder</p>
              <ul className="space-y-1 text-sm text-rose-800">
                {validationErrors.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "infos" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
              
              <div className="mb-6 flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                  {personalInfo.photoUrl ? (
                    <img src={personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">Photo</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 outline-none cursor-pointer" />
                  <p className="text-xs text-gray-500 mt-1">Optionnel. JPEG/PNG, max 5MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input type="text" required aria-invalid={validationErrors.some(error => error.includes("nom"))} value={personalInfo.fullName} onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste recherché</label>
                  <input type="text" required aria-invalid={validationErrors.some(error => error.includes("poste"))} value={personalInfo.jobTitle} onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ex: Développeur Fullstack" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required aria-invalid={validationErrors.some(error => error.includes("email"))} value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" value={personalInfo.phone} onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input type="text" value={personalInfo.city} onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn / Portfolio</label>
                  <input type="url" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat recherché</label>
                  <select value={personalInfo.contractType} onChange={(e) => setPersonalInfo({...personalInfo, contractType: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Job étudiant">Job étudiant</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                  Résumé / Profil
                  <button onClick={handleImproveSummary} disabled={aiLoading === "summary" || !personalInfo.summary} className="text-xs text-primary-600 flex items-center gap-1 hover:underline disabled:opacity-50">
                    {aiLoading === "summary" ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} 
                    {aiLoading === "summary" ? "Génération..." : "Générer avec l'IA"}
                  </button>
                </label>
                <textarea rows={4} value={personalInfo.summary} onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Décrivez brièvement votre profil et vos objectifs..."></textarea>
              </div>
            </div>
          )}

          {activeTab === "experiences" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Expériences professionnelles</h2>
              {experiences.map((exp, index) => (
                <div key={exp.id} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl relative">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                      <input type="text" value={exp.title} onChange={(e) => setExperiences(experiences.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                      <input type="text" value={exp.company} onChange={(e) => setExperiences(experiences.map((item, i) => i === index ? { ...item, company: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                      <input type="month" value={exp.startDate} onChange={(e) => setExperiences(experiences.map((item, i) => i === index ? { ...item, startDate: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                      <input type="month" value={exp.endDate} onChange={(e) => setExperiences(experiences.map((item, i) => i === index ? { ...item, endDate: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                      Description des missions
                      <button onClick={() => handleImproveExperience(index)} disabled={aiLoading === `exp_${exp.id}` || !exp.description} className="text-xs text-primary-600 flex items-center gap-1 hover:underline disabled:opacity-50">
                        {aiLoading === `exp_${exp.id}` ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                        {aiLoading === `exp_${exp.id}` ? "Optimisation..." : "Améliorer (IA)"}
                      </button>
                    </label>
                    <textarea rows={3} value={exp.description} onChange={(e) => setExperiences(experiences.map((item, i) => i === index ? { ...item, description: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Décrivez vos tâches..."></textarea>
                  </div>
                </div>
              ))}
              <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 flex items-center justify-center gap-2 font-medium transition-colors">
                <Plus className="w-5 h-5" /> Ajouter une expérience
              </button>
            </div>
          )}

          {activeTab === "formations" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Formations</h2>
              {educations.map((edu, index) => (
                <div key={edu.id} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme / Titre</label>
                      <input type="text" value={edu.degree} onChange={(e) => setEducations(educations.map((item, i) => i === index ? { ...item, degree: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">École / Établissement</label>
                      <input type="text" value={edu.school} onChange={(e) => setEducations(educations.map((item, i) => i === index ? { ...item, school: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                      <input type="month" value={edu.startDate} onChange={(e) => setEducations(educations.map((item, i) => i === index ? { ...item, startDate: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                      <input type="month" value={edu.endDate} onChange={(e) => setEducations(educations.map((item, i) => i === index ? { ...item, endDate: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                    <textarea rows={2} value={edu.description} onChange={(e) => setEducations(educations.map((item, i) => i === index ? { ...item, description: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 flex items-center justify-center gap-2 font-medium transition-colors">
                <Plus className="w-5 h-5" /> Ajouter une formation
              </button>
            </div>
          )}

          {activeTab === "competences" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Compétences & Informations complémentaires</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compétences clés (séparées par des virgules)</label>
                <textarea rows={3} value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="React, Node.js, Gestion de projet, Communication..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langues (séparées par des virgules)</label>
                <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Français (Natif), Anglais (Courant)..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centres d'intérêt (séparés par des virgules)</label>
                <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Photographie, Marathon, Lecture..." />
              </div>
            </div>
          )}

          {activeTab === "ai_adapt" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Adapter le CV à une offre</h2>
                  <p className="text-gray-500 text-sm">L'IA va analyser l'offre et réécrire vos expériences et votre profil pour matcher parfaitement.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collez l'annonce ou l'offre d'emploi ici</label>
                <textarea 
                  rows={10} 
                  value={jobOfferText} 
                  onChange={(e) => setJobOfferText(e.target.value)} 
                  className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-indigo-50/30" 
                  placeholder="Nous recherchons un développeur senior avec au moins 5 ans d'expérience en React et Node.js. Vous serez chargé de mener l'équipe vers..."
                ></textarea>
              </div>

              <button 
                onClick={handleAdaptCV}
                disabled={aiLoading === "adapt" || !jobOfferText}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-70"
              >
                {aiLoading === "adapt" ? <Loader2 className="w-6 h-6 animate-spin"/> : <Sparkles className="w-6 h-6"/>}
                {aiLoading === "adapt" ? "Analyse et adaptation en cours..." : "Lancer la Magie IA"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
