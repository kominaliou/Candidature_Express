export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Conditions Générales d'Utilisation et de Vente (CGU/CGV)</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales régissent l'utilisation du service <strong>Candidature Express IA</strong>, une plateforme SaaS permettant de générer, optimiser et gérer des CV et des lettres de motivation grâce à l'Intelligence Artificielle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accès aux services</h2>
            <p>
              L'accès aux services de base est gratuit (avec limites). L'accès aux fonctionnalités avancées (générations illimitées, ATS, adaptations IA) nécessite la souscription à une offre payante (Premium ou Pack). 
              L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Tarifs et Paiement</h2>
            <p>
              Les prix de nos services sont indiqués sur la page Tarifs en Euros, toutes taxes comprises (TTC).
              Le paiement est exigible immédiatement à la commande, y compris pour les abonnements. 
              Le règlement s'effectue de manière sécurisée via notre prestataire de paiement <strong>Stripe</strong>.
            </p>
            <p className="mt-2">
              Pour les abonnements, le renouvellement est tacite. L'utilisateur peut annuler son abonnement à tout moment depuis son espace "Mon Compte". L'annulation prendra effet à la fin de la période de facturation en cours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Droit de Rétractation</h2>
            <p>
              Conformément à la législation européenne sur les services numériques, en accédant immédiatement aux fonctionnalités de génération IA et aux exports après paiement, l'utilisateur renonce expressément à son droit de rétractation de 14 jours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilités</h2>
            <p>
              Les contenus (CV, lettres) générés par notre IA sont fournis à titre d'aide à la rédaction. <strong>Candidature Express IA</strong> ne garantit en aucun cas l'obtention d'un emploi ou d'un entretien. L'utilisateur est seul responsable de la vérification et de l'exactitude des informations figurant sur ses documents finaux.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modification des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier les présentes conditions à tout moment. Les nouvelles conditions seront portées à la connaissance de l'utilisateur par tout moyen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
