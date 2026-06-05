import OpenAI from "openai";
import { getRuntimeEnvStatus } from "@/lib/runtime-config";

const runtime = getRuntimeEnvStatus();
const apiKey = process.env.OPENAI_API_KEY || "";
const isMockMode = runtime.demoMode;
const openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

let openai: OpenAI | null = null;
if (runtime.hasOpenAI) {
  try {
    openai = new OpenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize OpenAI client:", e);
  }
} else if (runtime.isProduction) {
  console.error("OpenAI is not configured for production. Set OPENAI_API_KEY.");
}

// Helper mock generators to keep the code DRY and clean
const getAdaptCvMock = (cvData: any, jobOfferText: string) => {
  const offerSnippet = jobOfferText ? jobOfferText.substring(0, 80) : "";
  return {
    summary: `Professionnel rigoureux et engagé, motivé à l'idée d'apporter mon expertise pour répondre aux besoins de l'offre : "${offerSnippet}...". Fortement axé sur la collaboration et l'atteinte des objectifs.`,
    skills: Array.from(new Set([...(cvData.skills || []), "Adaptabilité", "Orientation objectifs", "Résolution de problèmes"])),
    experiences: (cvData.experiences || []).map((exp: any) => ({
      id: exp.id,
      description: `• Pilotage des tâches clés en lien avec les requis du poste.\n• Collaboration étroite avec les parties prenantes pour maximiser l'efficacité.\n• [Optimisé pour l'offre] ${exp.description || 'Participation active aux projets de l\'équipe.'}`
    }))
  };
};

const getExtractJobTitlesMock = (cvData: any) => {
  const targetContract = cvData?.personalInfo?.contractType || "CDI";
  const userTitle = cvData?.personalInfo?.jobTitle || "Développeur";
  return [
    {
      title: `${userTitle} - Spécialité Web`,
      score: 95,
      label: "Très compatible",
      advice: {
        whyMatches: `Votre profil correspond parfaitement aux exigences du marché pour un poste en ${targetContract} de par vos compétences déclarées.`,
        skillsToHighlight: Array.from(new Set([...(cvData.skills || []).slice(0, 3), "Gestion de projet", "Autonomie"])),
        missing: "Une certification spécifique ou une expérience dans un cadre agile à grande échelle.",
        letterAdvice: "Insistez sur vos réalisations récentes et votre capacité d'adaptation immédiate à l'écosystème de l'entreprise."
      }
    },
    {
      title: `Chef de Projet / Tech Lead (${targetContract})`,
      score: 75,
      label: "Compatible",
      advice: {
        whyMatches: "Vos expériences démontrent une bonne autonomie technique et des capacités de coordination.",
        skillsToHighlight: ["Leadership", "Communication technique", "Planification"],
        missing: "Expérience directe de management hiérarchique d'équipe.",
        letterAdvice: "Mettez en valeur vos initiatives d'accompagnement de collègues juniors ou de gestion de livrables complexes."
      }
    }
  ];
};

const getSimulateDashboardOffersMock = (cvData: any) => {
  const targetContract = cvData?.personalInfo?.contractType || "CDI";
  const userTitle = cvData?.personalInfo?.jobTitle || "Développeur";
  return [
    {
      title: `${userTitle} Sénior / Confirmé`,
      company: "Apex Technologies",
      location: cvData?.personalInfo?.city || "Paris / Hybride",
      contractType: targetContract,
      score: 92,
      sourceSite: "LinkedIn"
    },
    {
      title: `Consultant ${userTitle}`,
      company: "Innovate Group",
      location: "Télétravail total",
      contractType: targetContract === "Freelance" ? "Freelance" : "CDI",
      score: 86,
      sourceSite: "Welcome to the Jungle"
    },
    {
      title: `Ingénieur d'Études - ${userTitle}`,
      company: "Softeam S.A.",
      location: cvData?.personalInfo?.city || "Lyon / Hybride",
      contractType: "CDI",
      score: 71,
      sourceSite: "Indeed"
    }
  ];
};

const translationsDict: Record<string, Record<string, string>> = {
  en: {
    "Développeur Fullstack": "Full-Stack Developer",
    "Développeur Front-end": "Front-End Developer",
    "Développement d'applications React.": "Developing React applications and user interfaces.",
    "Master Informatique": "Master's Degree in Computer Science",
    "Université de Paris": "University of Paris",
    "Français": "French",
    "Anglais": "English",
    "Code": "Coding",
    "Design": "Designing",
    "Mon super CV": "My Great Resume",
    "Jean Dupont": "Jean Dupont",
    "Paris": "Paris",
    "Tech Corp": "Tech Corp",
    "Alternance": "Apprenticeship",
    "CDI": "Permanent Contract (CDI)",
    "CDD": "Temporary Contract (CDD)",
    "Stage": "Internship",
    "Freelance": "Freelance",
    "Job étudiant": "Student Job"
  },
  fr: {
    "Full-Stack Developer": "Développeur Fullstack",
    "Front-End Developer": "Développeur Front-end",
    "Developing React applications and user interfaces.": "Développement d'applications React.",
    "Master's Degree in Computer Science": "Master Informatique",
    "University of Paris": "Université de Paris",
    "French": "Français",
    "English": "Anglais",
    "Coding": "Code",
    "Designing": "Design",
    "My Great Resume": "Mon super CV",
    "Jean Dupont": "Jean Dupont",
    "Paris": "Paris",
    "Tech Corp": "Tech Corp",
    "Apprenticeship": "Alternance",
    "Permanent Contract (CDI)": "CDI",
    "Temporary Contract (CDD)": "CDD",
    "Internship": "Stage",
    "Student Job": "Job étudiant"
  }
};

const translateTextText = (text: string, targetLang: string): string => {
  if (!text) return "";
  const lang = targetLang.toLowerCase().substring(0, 2);
  const dict = translationsDict[lang];
  if (dict && dict[text]) {
    return dict[text];
  }
  
  // Dynamic fallback replacements for mock translation
  let result = text;
  if (lang === "en") {
    result = result
      .replace(/Développeur/g, "Developer")
      .replace(/Conception/g, "Design")
      .replace(/Gestion de/g, "Management of")
      .replace(/Informatique/g, "Computer Science")
      .replace(/Projet/g, "Project");
  } else if (lang === "fr") {
    result = result
      .replace(/Developer/g, "Développeur")
      .replace(/Design/g, "Conception")
      .replace(/Management of/g, "Gestion de")
      .replace(/Computer Science/g, "Informatique")
      .replace(/Project/g, "Projet");
  }
  return result;
};

const getTranslateCvMock = (cvData: any, targetLanguage: string) => {
  const isEn = targetLanguage.toLowerCase() === "en" || targetLanguage.toLowerCase() === "english";
  const langKey = isEn ? "en" : "fr";
  
  const personalInfo = cvData.personalInfo ? {
    ...cvData.personalInfo,
    fullName: cvData.personalInfo.fullName || "",
    jobTitle: translateTextText(cvData.personalInfo.jobTitle, langKey),
    summary: translateTextText(cvData.personalInfo.summary, langKey) || (isEn ? "Dynamic and solution-oriented professional with proven technical expertise. Focused on delivering high-quality projects and collaborative achievements." : "Professionnel dynamique et orienté solutions doté d'une expertise technique éprouvée. Axé sur la réalisation de projets de qualité et les objectifs collaboratifs."),
    city: cvData.personalInfo.city || "",
    email: cvData.personalInfo.email || "",
    phone: cvData.personalInfo.phone || "",
    linkedin: cvData.personalInfo.linkedin || "",
    photoUrl: cvData.personalInfo.photoUrl || "",
    contractType: translateTextText(cvData.personalInfo.contractType, langKey),
  } : {};

  return {
    personalInfo,
    experiences: (cvData.experiences || []).map((exp: any) => ({
      ...exp,
      title: translateTextText(exp.title, langKey),
      company: exp.company || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: translateTextText(exp.description, langKey)
    })),
    educations: (cvData.educations || []).map((edu: any) => ({
      ...edu,
      degree: translateTextText(edu.degree, langKey),
      school: edu.school || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: translateTextText(edu.description, langKey)
    })),
    skills: (cvData.skills || []).map((s: string) => translateTextText(s, langKey)),
    languages: (cvData.languages || []).map((l: string) => translateTextText(l, langKey)),
    interests: (cvData.interests || []).map((i: string) => translateTextText(i, langKey))
  };
};

export const AIService = {
  
  adaptCv: async (cvData: any, jobOfferText: string, useMock: boolean = false) => {
    if (useMock || isMockMode || !openai) {
      return getAdaptCvMock(cvData, jobOfferText);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Tu es un expert en recrutement. Ton but est d'optimiser le contenu du CV pour qu'il corresponde parfaitement à l'offre d'emploi fournie.
          - Ne mens pas, mais mets en valeur les expériences pertinentes.
          - Ajuste le "summary" (Résumé).
          - Ajuste ou ajoute des "skills" (Compétences) si elles sont sous-entendues dans le parcours.
          - Réécris les "description" des "experiences" pour utiliser les mots-clés de l'offre.
          
          Retourne un objet JSON strict :
          {
            "summary": "Nouveau résumé...",
            "skills": ["Compétence 1", "Compétence 2"],
            "experiences": [
              { "id": "ID_DE_LEXPERIENCE", "description": "Nouvelle description bullet points..." }
            ]
          }` },
          { role: "user", content: `Offre d'emploi:\n${jobOfferText}\n\nMon CV JSON actuel:\n${JSON.stringify(cvData)}` }
        ],
      });

      return JSON.parse(completion.choices[0].message.content || "{}");
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return getAdaptCvMock(cvData, jobOfferText);
    }
  },

  extractJobTitles: async (cvData: any, useMock: boolean = false) => {
    if (useMock || isMockMode || !openai) {
      return getExtractJobTitlesMock(cvData);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Tu es un expert en recrutement. Ton but est d'analyser un profil candidat (CV) et de générer une liste de 3 à 4 postes précis et réalistes qui matchent avec son profil et son type de contrat.
          Pour CHAQUE poste, tu dois simuler les exigences standards du marché et les comparer au CV pour calculer un score de compatibilité (90% = Très compatible, 70% = Compatible, 50% = À améliorer).
          
          Tu dois retourner EXACTEMENT un objet JSON avec cette structure :
          {
            "jobs": [
              {
                "title": "Titre du poste (ex: Développeur React Junior)",
                "score": 90,
                "label": "Très compatible",
                "advice": {
                  "whyMatches": "Pourquoi cette offre correspond au profil.",
                  "skillsToHighlight": ["Compétence 1 à mettre en avant", "Compétence 2"],
                  "missing": "Ce qu'il manque éventuellement par rapport aux attentes du marché.",
                  "letterAdvice": "Un conseil concret d'un recruteur sur la façon de tourner la lettre de motivation pour CE poste."
                }
              }
            ]
          }` },
          { role: "user", content: `Contrat recherché : ${cvData?.personalInfo?.contractType || 'Non spécifié'}\n\nMon CV (JSON) : ${JSON.stringify(cvData)}` }
        ],
      });

      const resultObj = JSON.parse(completion.choices[0].message.content || "{}");
      return resultObj.jobs || [];
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return getExtractJobTitlesMock(cvData);
    }
  },

  simulateDashboardOffers: async (cvData: any, useMock: boolean = false) => {
    if (useMock || isMockMode || !openai) {
      return getSimulateDashboardOffersMock(cvData);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Tu es un algorithme de recommandation de postes de type "Chasseur de têtes". Analyse le CV du candidat et invente 3 vraies fausses annonces d'emploi (simulation réaliste) qui matchent parfaitement avec son profil et le type de contrat souhaité.
          
          Tu dois retourner EXACTEMENT un objet JSON avec cette structure :
          {
            "offers": [
              {
                "title": "Titre du poste ciblé",
                "company": "Nom de l'entreprise (fictif mais très réaliste selon le secteur)",
                "location": "Ville ou type de télétravail (ex: Paris, Remote, Hybride...)",
                "contractType": "Le type de contrat correspondant au CV",
                "score": Nombre entre 60 et 99 indiquant la compatibilité,
                "sourceSite": "Plateforme recommandée (ex: LinkedIn, Welcome to the Jungle, Indeed, Apec)"
              }
            ]
          }` },
          { role: "user", content: `Contrat recherché : ${cvData?.personalInfo?.contractType || 'Non spécifié'}\n\nMon CV (JSON) : ${JSON.stringify(cvData)}` }
        ],
      });

      const resultObj = JSON.parse(completion.choices[0].message.content || "{}");
      return resultObj.offers || [];
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return getSimulateDashboardOffersMock(cvData);
    }
  },

  generateLetter: async (data: any, useMock: boolean = false) => {
    const defaultText = `Objet : Candidature pour le poste de ${data.jobTitle || 'Développeur'} au sein de ${data.companyName || 'votre entreprise'}

Madame, Monsieur,

C'est avec un grand enthousiasme que je vous adresse ma candidature pour le poste de ${data.jobTitle || 'Développeur'} au sein de ${data.companyName || 'votre organisation'}. 

Mon parcours professionnel et mes compétences acquises me permettent aujourd'hui de vous proposer un profil opérationnel et adapté aux défis de votre structure. Je suis particulièrement stimulé par la description des missions de l'offre : "${(data.jobDescription || '').substring(0, 120)}...".

Intégrer votre équipe représente pour moi une opportunité unique de contribuer à la réussite de vos projets tout en continuant d'évoluer professionnellement. Je serais ravi de vous rencontrer lors d'un entretien pour vous exposer de vive voix mes motivations.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;

    if (useMock || isMockMode || !openai) {
      return defaultText;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: openAiModel,
        messages: [
          { role: "system", content: "Tu es un expert en recrutement. Rédige une lettre de motivation." },
          { role: "user", content: `Rédige une lettre avec un ton ${data.tone} pour le poste de ${data.jobTitle} chez ${data.companyName}. Offre : ${data.jobDescription}. Sois humain, percutant et bien structuré.` }
        ],
      });
      return completion.choices[0].message.content || defaultText;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return defaultText;
    }
  },

  improveSummary: async (text: string, useMock: boolean = false) => {
    const defaultSummary = `Professionnel dynamique doté d'une expertise reconnue dans mon domaine de compétences. Orienté résultats et solutions, je mets un point d'honneur à allier rigueur technique et esprit de collaboration. Mon parcours me permet de m'adapter rapidement à de nouveaux environnements et d'assurer des livraisons de projets conformes aux attentes.`;

    if (useMock || isMockMode || !openai) {
      return text ? `[Optimisé par l'IA] ${text}` : defaultSummary;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es un expert en recrutement. Ton but est de reformuler le résumé de profil d'un candidat pour le rendre plus professionnel, impactant et clair. Ne dis pas 'bonjour', donne juste le texte réécrit." },
          { role: "user", content: `Voici mon résumé actuel, améliore-le : ${text}` }
        ],
      });
      return completion.choices[0].message.content || text;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return text ? `[Optimisé] ${text}` : defaultSummary;
    }
  },

  improveExperience: async (data: any, useMock: boolean = false) => {
    const defaultExp = `• Prise en charge opérationnelle des objectifs techniques liés au poste.\n• Collaboration au sein de l'équipe pour concevoir et implémenter les solutions adaptées.\n• Veille et application des bonnes pratiques métiers dans la réalisation des missions quotidiennes.`;

    if (useMock || isMockMode || !openai) {
      return data.description ? `• [Optimisé] ${data.description.replace(/\n/g, '\n• ')}` : defaultExp;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es un expert en recrutement. Reformule la description de l'expérience professionnelle fournie sous forme de bullet points percutants (max 3 ou 4 points). Utilise des verbes d'action. Ne fais aucune phrase d'intro." },
          { role: "user", content: `Poste: ${data.title}\nEntreprise: ${data.company}\nDescription actuelle: ${data.description}` }
        ],
      });
      return completion.choices[0].message.content || data.description;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return data.description ? `• [Optimisé] ${data.description.replace(/\n/g, '\n• ')}` : defaultExp;
    }
  },

  translateCv: async (cvData: any, targetLanguage: string, useMock: boolean = false) => {
    if (useMock || isMockMode || !openai) {
      return getTranslateCvMock(cvData, targetLanguage);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are an expert professional translator and career coach. Translate the provided CV (in JSON format) to ${targetLanguage}. 
          Ensure all translations are high-quality, professional, and tailored for a job application in the target language (e.g., use standard resume terminology).
          Keep the exact same JSON keys and structure. Only translate the text values of fields such as jobTitle, summary, experience title, description, education degree, description, skills, interests, etc.
          Do not translate names of cities, people, or companies unless there is a standard target language equivalent (e.g., 'Paris' remains 'Paris').` },
          { role: "user", content: `Translate this JSON: ${JSON.stringify(cvData)}` }
        ],
      });
      return JSON.parse(completion.choices[0].message.content || "{}");
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return getTranslateCvMock(cvData, targetLanguage);
    }
  },

  translateLetter: async (text: string, targetLanguage: string, useMock: boolean = false) => {
    const isEn = targetLanguage.toLowerCase() === "en" || targetLanguage.toLowerCase() === "english";

    if (useMock || isMockMode || !openai) {
      // Clean mock translation replacing basic letter blocks
      const cleaned = text
        .replace(/Madame, Monsieur,/gi, isEn ? "Dear Hiring Manager," : "Madame, Monsieur,")
        .replace(/Objet\s*:/gi, isEn ? "Subject:" : "Objet :")
        .replace(/Cordialement,/gi, isEn ? "Sincerely," : "Cordialement,")
        .replace(/Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées./gi, isEn ? "Sincerely yours," : "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.")
        .replace(/C'est avec un grand enthousiasme que je vous adresse ma candidature/gi, isEn ? "It is with great enthusiasm that I submit my application" : "C'est avec un grand enthousiasme que je vous adresse ma candidature")
        .replace(/C'est avec un vif intérêt que je vous soumets ma candidature/gi, isEn ? "It is with great interest that I submit my application" : "C'est avec un vif intérêt que je vous soumets ma candidature")
        .replace(/pour rejoindre vos équipes/gi, isEn ? "to join your teams" : "pour rejoindre vos équipes")
        .replace(/Les valeurs de votre entreprise ainsi que les missions proposées/gi, isEn ? "The values of your company and the proposed missions" : "Les valeurs de votre entreprise ainsi que les missions proposées")
        .replace(/correspondent parfaitement à mon projet professionnel/gi, isEn ? "correspond perfectly to my professional project" : "correspondent parfaitement à mon projet professionnel")
        .replace(/Je me tiens à votre entière disposition pour un entretien/gi, isEn ? "I remain at your entire disposal for an interview" : "Je me tiens à votre entière disposition pour un entretien")
        .replace(/Mon parcours professionnel et mes compétences acquises/gi, isEn ? "My professional background and my acquired skills" : "Mon parcours professionnel et mes compétences acquises");
      return cleaned;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an expert professional translator. Translate the provided cover letter / motivation letter to ${targetLanguage}. 
          Ensure the translation is natural, grammatically perfect, and preserves the requested tone (e.g., formal/professional, direct, or enthusiastic).
          Only output the translated letter text, without any introductory or concluding remarks.` },
          { role: "user", content: `Text to translate: ${text}` }
        ],
      });
      return completion.choices[0].message.content || text;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return text;
    }
  },

  jobMatching: async (cvData: any, useMock: boolean = false) => {
    const defaultMatches = [{ title: "Poste Associé", company: "Entreprise Tech", salary: "42k€ - 48k€", matchPercentage: 90, description: "Description de poste standard", skills: cvData.skills || [] }];

    if (useMock || isMockMode || !openai) {
      return defaultMatches;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Tu es un chasseur de tête. Génère 3 offres fictives réalistes. JSON strict avec { "matches": [ { "title", "company", "salary", "matchPercentage", "description", "skills": [] } ] }.` },
          { role: "user", content: `Contrat : ${cvData?.personalInfo?.contractType || 'Non spécifié'}\n\nMon CV (JSON) : ${JSON.stringify(cvData)}` }
        ],
      });
      return JSON.parse(completion.choices[0].message.content || "{}").matches || defaultMatches;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return defaultMatches;
    }
  },

  searchProfile: async (cvData: any, useMock: boolean = false) => {
    const defaultProfile = {
      keywords: cvData.skills || ["Professionnel", "Gestion de projet"],
      jobTitles: [cvData.personalInfo?.jobTitle || "Spécialiste"],
      sectors: ["Généraliste", "Technologie"],
      experienceLevel: "Confirmé",
      cities: [cvData.personalInfo?.city || "France"],
      recommendedSites: [
        { name: "LinkedIn", url: "https://linkedin.com", reason: "Leader mondial du recrutement professionnel." },
        { name: "Indeed", url: "https://indeed.com", reason: "Plus grand agrégateur d'offres d'emploi." }
      ]
    };

    if (useMock || isMockMode || !openai) {
      return defaultProfile;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Tu es un coach de carrière. Analyse le CV et génère un profil de recherche en JSON: { "keywords": [], "jobTitles": [], "sectors": [], "experienceLevel": "", "cities": [], "recommendedSites": [{ "name", "url", "reason" }] }` },
          { role: "user", content: `Génère le profil de recherche idéal :\n\nMon CV : ${JSON.stringify(cvData)}` }
        ],
      });
      return JSON.parse(completion.choices[0].message.content || "{}");
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      return defaultProfile;
    }
  }
};
