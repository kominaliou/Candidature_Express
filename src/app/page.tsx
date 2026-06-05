import Link from "next/link";
import { FileText, Mail, Sparkles, CheckCircle2, Zap, Globe, Edit3, ShieldCheck, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#090d16] transition-colors duration-300">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-500/10 dark:bg-primary-600/5 blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-[25%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[100px] pointer-events-none -z-10"></div>

      {/* Navbar Simple */}
      <header className="px-6 py-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center shadow-md shadow-primary-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              Candidature Express <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">IA</span>
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors text-sm">
              Connexion
            </Link>
            <Link href="/register" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-primary-600/20 hover:shadow-primary-600/35 hover:-translate-y-0.5">
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-36 px-6 text-center max-w-4xl mx-auto animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20 text-primary-700 dark:text-primary-300 text-xs uppercase tracking-wider font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            Propulsé par l'Intelligence Artificielle
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
            Décrochez votre prochain job avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600">l'IA</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Démarquez-vous des autres candidats. Notre IA génère, adapte et optimise vos CV et lettres de motivation de manière professionnelle en quelques instants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/cv/new" className="flex items-center justify-center gap-2.5 w-full sm:w-auto bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white px-8 py-4.5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-1">
              <FileText className="w-5.5 h-5.5" />
              Créer mon CV
            </Link>
            <Link href="/letter/new" className="flex items-center justify-center gap-2.5 w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-white px-8 py-4.5 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-sm">
              <Mail className="w-5.5 h-5.5 text-gray-500 dark:text-gray-400" />
              Générer une lettre
            </Link>
          </div>
        </section>

        {/* Comment ça marche Section */}
        <section className="py-24 bg-white/40 dark:bg-gray-950/20 backdrop-blur-md px-6 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">Comment ça marche ?</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">Un parcours simple et fluide pour optimiser vos chances.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "1. Renseignez vos bases", desc: "Saisissez rapidement vos expériences et formations. L'IA structure et enrichit vos textes pour les rendre percutants." },
                { title: "2. Adaptez au poste ciblé", desc: "Collez l'offre d'emploi. L'IA réécrit et aligne votre CV pour correspondre exactement aux attentes du recruteur." },
                { title: "3. Choisissez un modèle", desc: "Sélectionnez parmi nos modèles professionnels optimisés pour l'ATS et téléchargez votre PDF en un clic." }
              ].map((step, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-150 dark:border-gray-800/60 hover:border-primary-500/30 dark:hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 group hover:-translate-y-1.5">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-xl mb-6 shadow-md shadow-primary-500/20">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fonctionnalités Section */}
        <section className="py-24 bg-gray-55/30 dark:bg-gray-950/40 px-6 border-y border-gray-200/50 dark:border-gray-850/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">Fonctionnalités Clés</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">Des outils avancés conçus pour booster votre recherche.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Zap className="w-6 h-6 text-amber-500" />, title: "Optimisation de Profil", desc: "Notre IA adapte vos descriptions pour passer avec succès les filtres des logiciels de recrutement." },
                { icon: <Edit3 className="w-6 h-6 text-primary-500" />, title: "30+ Modèles Design", desc: "Un large choix de structures esthétiques et professionnelles adaptées à chaque métier." },
                { icon: <Globe className="w-6 h-6 text-blue-500" />, title: "Traducteur Intégré", desc: "Traduisez instantanément votre profil du français vers l'anglais d'un simple clic." },
                { icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />, title: "Générateur de Lettres", desc: "Créez des lettres de motivation ultra-personnalisées adaptées à chaque annonce." }
              ].map((feat, i) => (
                <div key={i} className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md p-7 rounded-3xl border border-gray-150 dark:border-gray-800/60 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700 shadow-inner">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2.5 text-gray-900 dark:text-white">{feat.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-6 bg-white dark:bg-gray-950/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">Des offres claires et adaptées</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16 text-lg">Choisissez la formule idéale pour votre recherche d'emploi.</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Free Tier */}
              <div className="p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 text-left flex flex-col shadow-sm">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Gratuit</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Parfait pour essayer.</p>
                <div className="text-5xl font-black mb-8 text-gray-900 dark:text-white">0€</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 items-center text-gray-600 dark:text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 1 CV complet</li>
                  <li className="flex gap-3 items-center text-gray-600 dark:text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 1 Export PDF inclus</li>
                  <li className="flex gap-3 items-center text-gray-400 dark:text-gray-500 text-sm opacity-60"><CheckCircle2 className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" /> Pas de lettre de motivation</li>
                </ul>
                <Link href="/register" className="block text-center w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-3.5 rounded-2xl transition-colors">
                  Commencer
                </Link>
              </div>

              {/* Paid Tier */}
              <div className="p-8 rounded-3xl bg-gray-900 dark:bg-gray-950 text-white border border-gray-800 relative overflow-hidden flex flex-col shadow-2xl scale-105">
                <div className="absolute top-4 right-[-35px] bg-primary-500 text-white text-[10px] font-black px-10 py-1 rotate-45 uppercase tracking-wider">
                  Populaire
                </div>
                <h3 className="text-2xl font-bold mb-2">Pack Unique</h3>
                <p className="text-gray-400 mb-6 text-sm">Pour une offre d'emploi ciblée.</p>
                <div className="text-5xl font-black mb-8">5,99€</div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 items-center text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" /> 1 CV adapté à l'offre</li>
                  <li className="flex gap-3 items-center text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" /> Lettre de motivation assortie</li>
                  <li className="flex gap-3 items-center text-gray-300 text-sm"><CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" /> Exports PDF haute qualité</li>
                </ul>
                <Link href="/pricing" className="block text-center w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary-600/35">
                  Découvrir les offres
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950/40 border-t border-gray-200/50 dark:border-gray-850/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">Questions Fréquentes</h2>
              <p className="text-gray-600 dark:text-gray-400">Tout ce que vous devez savoir sur Candidature Express IA.</p>
            </div>
            <div className="space-y-4">
              {[
                { q: "L'outil est-il vraiment gratuit ?", a: "Oui, vous pouvez créer votre CV et tester la puissance de notre IA sans frais. Le forfait gratuit inclut également 1 téléchargement PDF." },
                { q: "Comment l'IA adapte-t-elle mon CV ?", a: "Notre algorithme analyse l'offre d'emploi fournie et reformule vos expériences existantes pour mettre en valeur les mots-clés et compétences attendus par le recruteur." },
                { q: "Puis-je modifier les textes générés ?", a: "Absolument. Tout le contenu généré par l'IA reste entièrement modifiable au sein de notre éditeur interactif." },
                { q: "Le paiement est-il sécurisé ?", a: "Oui, toutes les transactions sont traitées de manière chiffrée par Stripe, leader mondial du paiement sécurisé sur Internet." }
              ].map((faq, i) => (
                <div key={i} className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-6 rounded-3xl border border-gray-200/55 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex gap-3 mb-2">
                    <HelpCircle className="w-5.5 h-5.5 text-primary-500 shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 ml-8.5 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200/60 dark:border-gray-800/60 py-12 px-6 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Candidature Express IA</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-semibold">
            <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">CGU</Link>
            <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Confidentialité</Link>
            <Link href="/admin/login" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Admin</Link>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">© 2026 Candidature Express IA. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
