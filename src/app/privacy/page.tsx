export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Politique de Confidentialité</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Collecte des Données</h2>
            <p>
              Dans le cadre de l'utilisation de nos services, nous sommes amenés à collecter les données personnelles suivantes :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Données d'identification (Nom, Email) lors de la création de compte via Supabase.</li>
              <li>Données professionnelles saisies dans vos CV et lettres de motivation.</li>
              <li>Données de paiement, traitées exclusivement et de manière sécurisée par notre partenaire <strong>Stripe</strong>. Nous ne stockons aucune information bancaire sur nos serveurs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation de l'Intelligence Artificielle</h2>
            <p>
              Notre plateforme utilise l'API d'<strong>OpenAI</strong> pour générer et optimiser vos candidatures. 
              Les textes de vos CV et descriptions de poste sont temporairement transmis à OpenAI uniquement dans le but de générer le résultat. 
              Conformément à la politique d'OpenAI pour les API d'entreprise, <strong>vos données ne sont pas utilisées pour entraîner leurs modèles publics</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hébergement et Sécurité</h2>
            <p>
              Vos données sont stockées de manière sécurisée sur les serveurs de <strong>Supabase</strong>, qui appliquent des protocoles de sécurité stricts (chiffrement, Row Level Security).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Vos Droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants sur vos données personnelles :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Droit d'accès et de portabilité.</li>
              <li>Droit de rectification (modifiables depuis votre compte).</li>
              <li>Droit à l'effacement ("droit à l'oubli").</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, vous pouvez supprimer votre compte directement depuis les paramètres ou nous contacter à l'adresse support.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
