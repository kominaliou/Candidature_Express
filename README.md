# Candidature Express IA

SaaS complet permettant la génération et l'optimisation de CV et de lettres de motivation avec l'aide de l'Intelligence Artificielle.

## Fonctionnalités incluses (MVP)

- **Landing Page & Pricing** : Présentation claire et page de tarification.
- **Authentification** : Inscription et connexion via Supabase Auth.
- **Dashboard Utilisateur** : Gestion des CV et lettres générées, affichage du statut Premium.
- **Génération de CV** : Formulaire complet, avec 3 modèles (Moderne, Classique, Minimaliste).
- **Génération de Lettre de Motivation** : Formulaire basé sur une offre d'emploi, avec appel API OpenAI.
- **Export PDF** : Export local côté client via `html2pdf.js` pour une fidélité parfaite du design.
- **Stripe** : Webhook basique et lien mockés.

## Stack Technique

- **Framework** : Next.js 15 (App Router) + TypeScript
- **Style** : Tailwind CSS + Lucide React (Icônes)
- **Base de données & Auth** : Supabase
- **Paiements** : Stripe
- **IA** : OpenAI API
- **Export PDF** : html2pdf.js

## Installation & Démarrage

1. **Installer les dépendances**
```bash
npm install
```

2. **Configuration des variables d'environnement**
Copiez le fichier d'exemple et remplissez vos clés API réelles si vous les avez. Pour tester localement sans les services externes, les mocks sont déjà configurés dans le code ou le fichier local.
```bash
cp .env.example .env.local
```

3. **Base de données (Supabase)**
Un fichier SQL est disponible dans `supabase/migrations/schema.sql`. Exécutez-le dans l'éditeur SQL de votre dashboard Supabase pour créer les tables nécessaires.

4. **Lancement du serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Tests

Pour tester la prévisualisation de CV sans être connecté, vous pouvez naviguer manuellement sur `/cv/preview-mock`.

Pour tester la génération de lettre sans clé OpenAI, l'API renverra un mock intelligent simulant le résultat au bout de 1,5 seconde.
