"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function EditCvPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null); // 'summary', 'exp_1', 'adapt'
  const [activeTab, setActiveTab] = useState("infos"); // infos, experiences, formations, competences, ai_adapt

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
    contractType: "CDI",
  });

  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [interests, setInterests] = useState("");

  useEffect(() => {
    const loadCvData = async () => {
      setLoading(true);
      if (id === "preview-mock") {
        const localData = typeof window !== "undefined" ? localStorage.getItem("local_cv") : null;
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            populateForm(parsed);
          } catch (e) {
            console.error("Error parsing local CV", e);
          }
        } else {
          // Fallback initial structures
          setExperiences([{ id: 1, title: "", company: "", startDate: "", endDate: "", description: "" }]);
          setEducations([{ id: 1, degree: "", school: "", startDate: "", endDate: "", description: "" }]);
        }
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (data && data.data) {
        populateForm(data.data);
      } else {
        // Fallback or error handling
        setExperiences([{ id: 1, title: "", company: "", startDate: "", endDate: "", description: "" }]);
        setEducations([{ id: 1, degree: "", school: "", startDate: "", endDate: "", description: "" }]);
      }
      setLoading(false);
    };

    loadCvData();
  }, [id]);

  const populateForm = (cvData: any) => {
    if (cvData.personalInfo) {
      setPersonalInfo({
        fullName: cvData.personalInfo.fullName || "",
        email: cvData.personalInfo.email || "",
        phone: cvData.personalInfo.phone || "",
        city: cvData.personalInfo.city || "",
        jobTitle: cvData.personalInfo.jobTitle || "",
        summary: cvData.personalInfo.summary || "",
        linkedin: cvData.personalInfo.linkedin || "",
        photoUrl: cvData.personalInfo.photoUrl || "",
        contractType: cvData.personalInfo.contractType || "CDI",
      });
    }
    if (cvData.experiences) setExperiences(cvData.experiences);
    if (cvData.educations) setEducations(cvData.educations);
    if (cvData.skills) setSkills(Array.isArray(cvData.skills) ? cvData.skills.join(", ") : cvData.skills);
    if (cvData.languages) setLanguages(Array.isArray(cvData.languages) ? cvData.languages.join(", ") : cvData.languages);
    if (cvData.interests) setInterests(Array.isArray(cvData.interests) ? cvData.interests.join(", ") : cvData.interests);
  };

  const addExperience = () => setExperiences([...experiences, { id: Date.now(), title: "", company: "", startDate: "", endDate: "", description: "" }]);
  const removeExperience = (expId: number) => setExperiences(experiences.filter(exp => exp.id !== expId));

  const addEducation = () => setEducations([...educations, { id: Date.now(), degree: "", school: "", startDate: "", endDate: "", description: "" }]);
  const removeEducation = (eduId: number) => setEducations(educations.filter(edu => edu.id !== eduId));

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
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const cvData = {
      personalInfo,
      experiences,
      educations,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      languages: languages.split(',').map(s => s.trim()).filter(Boolean),
      interests: interests.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (id === "preview-mock") {
      localStorage.setItem("local_cv", JSON.stringify(cvData));
      router.push(`/cv/preview-mock`);
    } else if (session) {
      const { error } = await supabase
        .from('resumes')
        .update({
          title: personalInfo.jobTitle || 'Mon CV',
          data: cvData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (!error) {
        localStorage.setItem("local_cv", JSON.stringify(cvData));
        router.push(`/cv/${id}`);
      } else {
        alert("Erreur lors de la sauvegarde du CV");
      }
    } else {
      alert("Session expirée. Connexion requise.");
      router.push("/login");
    }
    setSaving(false);
  };

  const handleImproveSummary = async () => {
    if (!personalInfo.summary) return;
    setAiLoading("summary");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve_summary', data: { text: personalInfo.summary }, userId: session?.user?.id || 'mock_user' })
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
        body: JSON.stringify({ action: 'improve_experience', data: { title: exp.title, company: exp.company, description: exp.description }, userId: session?.user?.id || 'mock_user' })
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
        body: JSON.stringify({ action: 'adapt_cv', data: { jobOffer: jobOfferText, cv: cvData }, userId: session?.user?.id || 'mock_user' })
      });
      const json = await res.json();
      if (json.result) {
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
        setActiveTab("infos");
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur s'est produite lors de l'adaptation.");
    }
    setAiLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-gray-500 font-medium">Chargement du CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-900">Modifier le CV</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-medium transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer les modifications
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
          </nav>
        </div>

        {/* Formulaire */}
        <div className="flex-1 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input type="text" value={personalInfo.fullName} onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste recherché</label>
                  <input type="text" value={personalInfo.jobTitle} onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
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
                <textarea rows={4} value={personalInfo.summary} onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
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
                    <textarea rows={3} value={exp.description} onChange={(e) => setExperiences(experiences.map((item, i) => i === index ? { ...item, description: e.target.value } : item))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
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
                <textarea rows={3} value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="React, Node.js, Gestion de projet..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langues (séparées par des virgules)</label>
                <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centres d'intérêt (séparés par des virgules)</label>
                <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
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
                ></textarea>
              </div>

              <button 
                onClick={handleAdaptCV}
                disabled={aiLoading === "adapt" || !jobOfferText}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg disabled:opacity-70"
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
