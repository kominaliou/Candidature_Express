"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Wand2, Building, Briefcase, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { authenticatedFetch } from "@/lib/authenticated-fetch";

export default function NewLetterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [prefillNotice, setPrefillNotice] = useState("");
  
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    tone: "professionnel", // professionnel, simple, motive
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const job = params.get("job");
    const company = params.get("company");
    const description = params.get("description");

    if (!job && !company && !description) return;

    setFormData((current) => ({
      ...current,
      jobTitle: job || current.jobTitle,
      companyName: company || current.companyName,
      jobDescription: description || current.jobDescription || (job ? `Candidature ciblée pour le poste : ${job}` : current.jobDescription),
    }));
    setPrefillNotice("Le contexte de l'offre a été repris automatiquement. Complétez l'entreprise si besoin, puis générez la lettre.");
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Appel API à OpenAI
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_letter',
          data: formData,
          userId: session?.user?.id
        })
      });

      if (!res.ok) throw new Error("Erreur de génération");

      const data = await res.json();
      setGeneratedLetter(data.result);
      
    } catch (err) {
      console.error(err);
      // Mock generation pour le MVP en cas d'erreur API / absence de clé
      setGeneratedLetter(`Objet : Candidature pour le poste de ${formData.jobTitle || '...'} au sein de ${formData.companyName || 'votre entreprise'}

Madame, Monsieur,

C'est avec un vif intérêt que je vous soumets ma candidature pour rejoindre vos équipes. Les valeurs de votre entreprise ainsi que les missions proposées dans l'offre correspondent parfaitement à mon projet professionnel.

[Ceci est une lettre générée par défaut car l'API OpenAI n'a pas répondu. En production, cette zone sera remplacée par le texte généré par l'Intelligence Artificielle en utilisant le ton "${formData.tone}".]

Je me tiens à votre entière disposition pour un entretien.

Cordialement,`);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (targetLanguage: 'en' | 'fr') => {
    if (!generatedLetter) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await authenticatedFetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'translate_letter', data: { targetLanguage, text: generatedLetter }, userId: session?.user?.id })
      });
      const data = await res.json();
      if (data.result) setGeneratedLetter(data.result);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la traduction.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      await supabase.from('cover_letters').insert({
        user_id: session.user.id,
        title: `Lettre pour ${formData.companyName || 'entreprise'}`,
        content: generatedLetter,
        company_name: formData.companyName,
        job_title: formData.jobTitle
      });
      router.push("/dashboard");
    } else {
      alert("Connectez-vous pour sauvegarder votre lettre.");
      router.push("/register");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-bold text-xl text-gray-900">Générateur de Lettre</h1>
          </div>
          {generatedLetter && (
            <button 
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-sm"
            >
              Sauvegarder
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Formulaire */}
        <div className="w-full lg:w-1/2 space-y-6">
          {prefillNotice && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl p-4 text-sm font-medium">
              {prefillNotice}
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contexte de la candidature</h2>
            <p className="text-gray-500 mb-8 text-sm">Donnez les informations clés à l'IA pour qu'elle rédige une lettre ultra-personnalisée.</p>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" /> Nom de l'entreprise
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="ex: Google, Startup..." 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" /> Poste visé
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.jobTitle}
                  onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="ex: Développeur React" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Offre d'emploi ou missions
                </label>
                <textarea 
                  rows={6}
                  value={formData.jobDescription}
                  onChange={e => setFormData({...formData, jobDescription: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" 
                  placeholder="Collez ici le texte de l'offre d'emploi ou décrivez les missions..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ton souhaité</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'professionnel', label: 'Professionnel' },
                    { id: 'simple', label: 'Simple & Direct' },
                    { id: 'motive', label: 'Très motivé' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setFormData({...formData, tone: t.id})}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.tone === t.id 
                          ? "bg-primary-50 text-primary-700 border-2 border-primary-500" 
                          : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-1 mt-4 disabled:opacity-70 disabled:transform-none"
              >
                {loading ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Génération en cours...</>
                ) : (
                  <><Wand2 className="w-6 h-6" /> Générer ma lettre avec l'IA</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Résultat */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm h-full min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                Résultat généré
              </h2>
              {generatedLetter && (
                <div className="flex gap-2">
                  <button onClick={() => handleTranslate('en')} disabled={loading} className="text-xs font-medium text-gray-500 hover:text-gray-900 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50">
                    Traduire EN
                  </button>
                  <button onClick={() => handleTranslate('fr')} disabled={loading} className="text-xs font-medium text-gray-500 hover:text-gray-900 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50">
                    Traduire FR
                  </button>
                </div>
              )}
            </div>
            
            {generatedLetter ? (
              <textarea 
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 resize-none font-serif text-gray-800 leading-relaxed"
              ></textarea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FileText className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-center max-w-xs">Remplissez le formulaire et laissez la magie de l'IA opérer pour créer une lettre parfaite.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
