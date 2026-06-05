export interface CVPersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  linkedin?: string;
  summary?: string;
  photoUrl?: string; // Base64 encodé
}

export interface CVExperience {
  id: string | number;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface CVEducation {
  id: string | number;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface CVData {
  personalInfo: CVPersonalInfo;
  experiences: CVExperience[];
  educations: CVEducation[];
  skills: string[];
  languages: string[];
  interests?: string[];
}

export interface CVTemplateProps {
  data: CVData;
}
