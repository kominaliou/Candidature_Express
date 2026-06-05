import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { CorporateBlue } from './CorporateBlue';
import { CreativeTimeline } from './CreativeTimeline';
import { TechDark } from './TechDark';

// Lot 2 : Créatifs & Modernes
import { CreativeVibe } from './CreativeVibe';
import { NeonCyber } from './NeonCyber';
import { GeometricClean } from './GeometricClean';
import { VibrantGradient } from './VibrantGradient';
import { MagazineStyle } from './MagazineStyle';
import { PortfolioGallery } from './PortfolioGallery';

// Lot 3 : Tech & Développeur
import { HackerConsole } from './HackerConsole';
import { CodeBlock } from './CodeBlock';
import { DataScience } from './DataScience';
import { StartupAgile } from './StartupAgile';
import { BlockchainDark } from './BlockchainDark';
import { CloudEngineer } from './CloudEngineer';

// Lot 4 : Exécutifs & Minimalistes
import { ExecutiveGold } from './ExecutiveGold';
import { LawyerClassic } from './LawyerClassic';
import { FinanceGrid } from './FinanceGrid';
import { MonochromeElite } from './MonochromeElite';
import { ConsultantPro } from './ConsultantPro';
import { CEOVision } from './CEOVision';

// Lot 5 : Spécifiques & Fun
import { TeacherChalkboard } from './TeacherChalkboard';
import { MedicalClean } from './MedicalClean';
import { ChefMenu } from './ChefMenu';
import { MusicBeat } from './MusicBeat';
import { GamerPixel } from './GamerPixel';
import { TravelPassport } from './TravelPassport';

export const CVTemplates: Record<string, React.FC<any>> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimalist: MinimalistTemplate,
  corporate_blue: CorporateBlue,
  creative_timeline: CreativeTimeline,
  tech_dark: TechDark,
  
  // Lot 2
  creative_vibe: CreativeVibe,
  neon_cyber: NeonCyber,
  geometric: GeometricClean,
  vibrant: VibrantGradient,
  magazine: MagazineStyle,
  portfolio: PortfolioGallery,
  
  // Lot 3
  hacker_console: HackerConsole,
  code_block: CodeBlock,
  data_science: DataScience,
  startup_agile: StartupAgile,
  blockchain: BlockchainDark,
  cloud: CloudEngineer,
  
  // Lot 4
  executive_gold: ExecutiveGold,
  lawyer_classic: LawyerClassic,
  finance_grid: FinanceGrid,
  monochrome_elite: MonochromeElite,
  consultant_pro: ConsultantPro,
  ceo_vision: CEOVision,
  
  // Lot 5
  teacher_chalkboard: TeacherChalkboard,
  medical_clean: MedicalClean,
  chef_menu: ChefMenu,
  music_beat: MusicBeat,
  gamer_pixel: GamerPixel,
  travel_passport: TravelPassport,
};

export const TEMPLATES_LIST = [
  { id: "modern", name: "Moderne", desc: "Design coloré avec barre latérale", category: "Moderne" },
  { id: "classic", name: "Classique", desc: "Le format traditionnel et formel", category: "Classique" },
  { id: "minimalist", name: "Minimaliste", desc: "Épuré, focus sur le contenu", category: "Minimaliste" },
  { id: "corporate_blue", name: "Corporate Blue", desc: "Style exécutif avec accent bleu", category: "Corporate" },
  { id: "creative_timeline", name: "Créatif Timeline", desc: "Asymétrique et coloré avec timeline", category: "Créatif" },
  { id: "tech_dark", name: "Tech Dark Mode", desc: "Style IDE/Terminal pour les dev", category: "Tech & IT" },
  
  // Lot 2
  { id: "creative_vibe", name: "Creative Vibe", desc: "Style organique et coloré (Rose/Violet)", category: "Créatif" },
  { id: "neon_cyber", name: "Neon Cyber", desc: "Ambiance sombre avec effets néon cyberpunk", category: "Créatif" },
  { id: "geometric", name: "Geometric Clean", desc: "Style urbain avec formes géométriques strictes", category: "Moderne" },
  { id: "vibrant", name: "Vibrant Gradient", desc: "En-tête éclatant avec dégradé", category: "Moderne" },
  { id: "magazine", name: "Magazine Style", desc: "Inspiré par l'éditorial et la mode", category: "Créatif" },
  { id: "portfolio", name: "Portfolio Gallery", desc: "Axé sur les expériences en mode galerie", category: "Moderne" },
  
  // Lot 3
  { id: "hacker_console", name: "Hacker Console", desc: "Interface terminal Linux / Hacker", category: "Tech & IT" },
  { id: "code_block", name: "Code Block", desc: "CV au format code (VSCode style)", category: "Tech & IT" },
  { id: "data_science", name: "Data Science", desc: "Design analytique type Dashboard", category: "Tech & IT" },
  { id: "startup_agile", name: "Startup Agile", desc: "Inspiré par Notion et les outils collaboratifs", category: "Moderne" },
  { id: "blockchain", name: "Blockchain Dark", desc: "Dark mode luxueux pour Web3/Crypto", category: "Tech & IT" },
  { id: "cloud", name: "Cloud Engineer", desc: "Style tableau de bord Cloud (AWS/Azure)", category: "Tech & IT" },
  
  // Lot 4
  { id: "executive_gold", name: "Executive Gold", desc: "Design statutaire avec accents dorés", category: "Corporate" },
  { id: "lawyer_classic", name: "Lawyer Classic", desc: "Très formel, sobre et élégant", category: "Classique" },
  { id: "finance_grid", name: "Finance Grid", desc: "Grille stricte inspirée du Financial Times", category: "Corporate" },
  { id: "monochrome_elite", name: "Monochrome Elite", desc: "Noir et blanc avec un contraste fort", category: "Minimaliste" },
  { id: "consultant_pro", name: "Consultant Pro", desc: "Style agence, avec barre latérale claire", category: "Corporate" },
  { id: "ceo_vision", name: "CEO Vision", desc: "Typographie de magazine économique", category: "Corporate" },
  
  // Lot 5
  { id: "teacher_chalkboard", name: "Teacher Chalkboard", desc: "Design tableau noir pour l'enseignement", category: "Créatif" },
  { id: "medical_clean", name: "Medical Clean", desc: "Dossier patient / Profil santé", category: "Moderne" },
  { id: "chef_menu", name: "Chef Menu", desc: "Inspiré par la haute gastronomie", category: "Classique" },
  { id: "music_beat", name: "Music Beat", desc: "Ambiance concert et lumières", category: "Créatif" },
  { id: "gamer_pixel", name: "Gamer Pixel", desc: "Aventure RPG & Pixel Art", category: "Créatif" },
  { id: "travel_passport", name: "Travel Passport", desc: "Format passeport pour l'international", category: "Moderne" },
];
