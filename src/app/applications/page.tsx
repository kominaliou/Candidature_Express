"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Briefcase, ExternalLink, Calendar, Star, Plus, X } from "lucide-react";
import Link from "next/link";

const COLUMNS = [
  { id: "À postuler", label: "À postuler", color: "bg-gray-100", border: "border-gray-200", text: "text-gray-700" },
  { id: "CV adapté", label: "CV adapté", color: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  { id: "Lettre générée", label: "Lettre générée", color: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  { id: "Candidature envoyée", label: "Envoyée", color: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { id: "Réponse reçue", label: "Réponse reçue", color: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  { id: "Entretien", label: "Entretien", color: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700" },
  { id: "Accepté", label: "Accepté 🎉", color: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { id: "Refusé", label: "Refusé", color: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
];
const DEFAULT_STATUS = COLUMNS[0].id;

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobStatus, setNewJobStatus] = useState(DEFAULT_STATUS);
  const [savingNewJob, setSavingNewJob] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const localSaved = typeof window !== "undefined" ? localStorage.getItem("local_saved_jobs") : null;
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          const mapped = Object.entries(parsed).map(([title, status], idx) => {
            let uiStatus = status as string;
            if (status === 'saved') uiStatus = 'À postuler';
            if (status === 'applied') uiStatus = 'Candidature envoyée';
            return {
              id: `local-job-${idx}`,
              cv_id: "preview-mock",
              title,
              score: 95,
              status: uiStatus,
              created_at: new Date().toISOString()
            };
          });
          setJobs(mapped);
        } catch (e) {
          console.error("Error loading local saved jobs", e);
        }
      }
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('saved_jobs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      // Map legacy statuses
      const mappedData = data.map(job => {
        if (job.status === 'saved') return { ...job, status: 'À postuler' };
        if (job.status === 'applied') return { ...job, status: 'Candidature envoyée' };
        return job;
      });
      setJobs(mappedData);
    }
    setLoading(false);
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    const previousJobs = [...jobs];
    
    // Optimistic UI update
    setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));

    if (jobId.startsWith("local-job-")) {
      const localSaved = localStorage.getItem("local_saved_jobs");
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          const targetJob = jobs.find(j => j.id === jobId);
          if (targetJob) {
            let statusToSave = newStatus;
            if (newStatus === 'À postuler') statusToSave = 'saved';
            if (newStatus === 'Candidature envoyée') statusToSave = 'applied';
            parsed[targetJob.title] = statusToSave;
            localStorage.setItem("local_saved_jobs", JSON.stringify(parsed));
          }
        } catch (e) {
          console.error("Error updating local saved job status", e);
        }
      }
      return;
    }

    const { error } = await supabase
      .from('saved_jobs')
      .update({ status: newStatus })
      .eq('id', jobId);

    if (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du statut.");
      setJobs(previousJobs); // Revert on error
    }
  };

  const handleAddManualJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newJobTitle.trim();
    if (!title) return;

    setSavingNewJob(true);
    const optimisticJob = {
      id: `manual-${Date.now()}`,
      cv_id: "preview-mock",
      title,
      score: 0,
      status: newJobStatus,
      created_at: new Date().toISOString()
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const nextJobs = [optimisticJob, ...jobs];
      setJobs(nextJobs);
      const localSaved = localStorage.getItem("local_saved_jobs");
      const parsed = localSaved ? JSON.parse(localSaved) : {};
      parsed[title] = newJobStatus;
      localStorage.setItem("local_saved_jobs", JSON.stringify(parsed));
    } else {
      const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: session.user.id,
          cv_id: null,
          title,
          score: 0,
          advice_json: {},
          status: newJobStatus
        })
        .select()
        .single();

      if (error) {
        alert("Erreur lors de l'ajout de la candidature.");
      } else if (data) {
        setJobs([{ ...data, status: newJobStatus }, ...jobs]);
      }
    }

    setNewJobTitle("");
    setNewJobStatus(DEFAULT_STATUS);
    setShowNewJobForm(false);
    setSavingNewJob(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedJobId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    if (draggedJobId) {
      updateJobStatus(draggedJobId, statusId);
      setDraggedJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-gray-500 font-medium">Chargement de vos candidatures...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-black text-2xl text-gray-900 flex items-center gap-3">
              <Briefcase className="w-7 h-7 text-primary-600" /> Mes Candidatures
            </h1>
            <p className="text-gray-500 text-sm mt-1">Suivez l'avancement de vos offres sauvegardées et postulez avec succès.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewJobForm(true)}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
            <Link href="/dashboard" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="p-8 pb-20 max-w-[100vw] overflow-x-auto custom-scrollbar">
        {showNewJobForm && (
          <form onSubmit={handleAddManualJob} className="max-w-4xl mx-auto mb-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Nouvelle candidature</label>
              <input
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                placeholder="ex: Product Designer - Doctolib"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              />
            </div>
            <div className="md:w-56">
              <label className="block text-sm font-bold text-gray-700 mb-1">Statut</label>
              <select
                value={newJobStatus}
                onChange={(e) => setNewJobStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button disabled={savingNewJob || !newJobTitle.trim()} className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold disabled:opacity-50">
                {savingNewJob ? "Ajout..." : "Ajouter"}
              </button>
              <button type="button" onClick={() => setShowNewJobForm(false)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {jobs.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-10">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aucune candidature suivie</h2>
            <p className="text-gray-500 mb-8">Commencez par utiliser notre IA pour trouver des offres recommandées à partir de votre CV.</p>
            <Link href="/dashboard" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-sm hover:bg-primary-700 transition-colors">
              Créer un CV et trouver des offres
            </Link>
          </div>
        ) : (
          <div className="flex gap-6 items-start h-full pb-10 w-max mx-auto px-4">
            {COLUMNS.map((col) => {
              const columnJobs = jobs.filter(j => j.status === col.id);
              return (
                <div 
                  key={col.id} 
                  className={`w-80 shrink-0 rounded-2xl flex flex-col max-h-[80vh] border ${col.border} ${col.color}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <div className={`px-4 py-3 font-bold text-sm border-b flex justify-between items-center ${col.border} ${col.text}`}>
                    {col.label}
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">{columnJobs.length}</span>
                  </div>
                  
                  <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-3 min-h-[150px]">
                    {columnJobs.map((job) => (
                      <div 
                        key={job.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, job.id)}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative group ${draggedJobId === job.id ? 'opacity-50' : ''}`}
                      >
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(job.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <h3 className="font-bold text-gray-900 leading-tight mb-3 text-sm">{job.title}</h3>
                        
                        {job.score && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100 mb-3">
                            <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" /> Score : {job.score}%
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-50 flex justify-between items-center opacity-100 transition-opacity">
                          <select 
                            value={job.status}
                            onChange={(e) => updateJobStatus(job.id, e.target.value)}
                            className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none font-medium text-gray-600"
                          >
                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                          </select>
                          <Link href={`/cv/${job.cv_id}/jobs`} className="p-1 text-primary-600 hover:bg-primary-50 rounded" title="Voir les détails">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                    {columnJobs.length === 0 && (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs font-medium border-2 border-dashed border-white/40 rounded-xl py-6">
                        Glissez une carte ici
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
