import React from 'react';
import { CVTemplateProps } from './types';

export const MedicalClean: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-[#1e293b] font-sans p-10 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header avec badge médical */}
      <header className="flex justify-between items-center border-b-[3px] border-[#0ea5e9] pb-6 mb-8 relative">
        <div className="flex gap-6 items-center">
          {data.personalInfo.photoUrl ? (
            <div className="w-28 h-28 shrink-0 rounded-2xl border-4 border-[#e0f2fe] overflow-hidden shadow-sm">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-[#e0f2fe] rounded-2xl flex items-center justify-center text-4xl text-[#0ea5e9]">
              +
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0f172a] mb-1">{data.personalInfo.fullName}</h1>
            <h2 className="text-xl font-semibold text-[#0ea5e9] uppercase tracking-wider">{data.personalInfo.jobTitle}</h2>
          </div>
        </div>
        
        <div className="text-right text-sm font-medium text-[#64748b] space-y-1 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
          <p>{data.personalInfo.city}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.email}</p>
        </div>
      </header>

      <div className="flex gap-10 flex-1">
        
        {/* Left Column (Info Cliniques) */}
        <div className="w-1/3 space-y-8 bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
          
          <section>
            <h3 className="flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-widest text-sm mb-4 border-b border-[#cbd5e1] pb-2">
              <span className="text-lg">+</span> Compétences Cliniques
            </h3>
            <ul className="space-y-2">
              {data.skills.map((skill: string, i: number) => (
                <li key={i} className="text-sm font-medium text-[#334155] flex items-start gap-2">
                  <span className="text-[#0ea5e9] mt-0.5">•</span> {skill}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-widest text-sm mb-4 border-b border-[#cbd5e1] pb-2">
              <span className="text-lg">+</span> Formation Médicale
            </h3>
            <div className="space-y-4">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="font-bold text-[#0f172a] leading-tight mb-1">{edu.degree}</p>
                  <p className="text-[#64748b]">{edu.school}</p>
                  <p className="text-xs font-bold text-[#0ea5e9] mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>

          {data.personalInfo.linkedin && (
            <section>
              <h3 className="flex items-center gap-2 text-[#0ea5e9] font-bold uppercase tracking-widest text-sm mb-4 border-b border-[#cbd5e1] pb-2">
                <span className="text-lg">+</span> Réseau
              </h3>
              <p className="text-sm text-[#334155] break-all">{data.personalInfo.linkedin}</p>
            </section>
          )}

        </div>

        {/* Right Column (Pratique) */}
        <div className="w-2/3 space-y-8">
          
          {data.personalInfo.summary && (
            <section>
              <h3 className="flex items-center gap-2 text-[#0f172a] font-bold uppercase tracking-widest text-sm mb-3">
                Dossier Patient / Profil
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed text-justify bg-[#f0f9ff] p-5 rounded-xl border-l-4 border-[#0ea5e9]">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="flex items-center gap-2 text-[#0f172a] font-bold uppercase tracking-widest text-sm mb-6">
              Expérience en Établissement
            </h3>
            <div className="space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-[#0f172a] text-lg">{exp.title}</h4>
                    <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="font-semibold text-[#64748b] mb-3">{exp.company}</div>
                  <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
