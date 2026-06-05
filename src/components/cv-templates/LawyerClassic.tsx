import React from 'react';
import { CVTemplateProps } from './types';

export const LawyerClassic: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#fcfdfd] text-[#2c3e50] font-serif p-16 flex flex-col" style={{ width: '210mm', minHeight: '297mm', border: '1px solid #e0e0e0' }}>
      
      {/* Header Formel avec Lignes Fines */}
      <header className="text-center mb-10 border-b border-[#2c3e50] border-double pb-8">
        {data.personalInfo.photoUrl && (
          <div className="w-24 h-24 mx-auto mb-6 border border-[#2c3e50] p-1">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover filter grayscale" />
          </div>
        )}
        <h1 className="text-5xl font-normal tracking-wide uppercase text-[#1a252f] mb-3">
          {data.personalInfo.fullName}
        </h1>
        <h2 className="text-xl italic text-[#34495e] mb-4">{data.personalInfo.jobTitle}</h2>
        
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm font-sans tracking-widest text-[#7f8c8d]">
          <span>{data.personalInfo.city}</span>
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
          <span>|</span>
          <span>{data.personalInfo.email}</span>
        </div>
      </header>

      <div className="flex-1 space-y-10">
        
        {data.personalInfo.summary && (
          <section>
            <h3 className="text-lg uppercase tracking-widest text-[#1a252f] border-b border-[#bdc3c7] pb-1 mb-4">Profil Professionnel</h3>
            <p className="text-sm leading-loose text-justify text-[#34495e]">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        <section>
          <h3 className="text-lg uppercase tracking-widest text-[#1a252f] border-b border-[#bdc3c7] pb-1 mb-6">Expérience</h3>
          <div className="space-y-6">
            {data.experiences.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-[#2c3e50] text-base">{exp.title}</h4>
                  <span className="font-sans text-xs text-[#7f8c8d] uppercase tracking-wider">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic text-[#34495e] mb-2">{exp.company}</div>
                <p className="text-sm text-[#34495e] leading-relaxed text-justify whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg uppercase tracking-widest text-[#1a252f] border-b border-[#bdc3c7] pb-1 mb-6">Formation Académique</h3>
          <div className="space-y-4">
            {data.educations.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[#2c3e50] text-sm">{edu.degree}</div>
                  <div className="italic text-[#34495e] text-sm">{edu.school}</div>
                </div>
                <div className="font-sans text-xs text-[#7f8c8d] uppercase tracking-wider">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg uppercase tracking-widest text-[#1a252f] border-b border-[#bdc3c7] pb-1 mb-4">Domaines de Compétence</h3>
          <p className="text-sm leading-relaxed text-[#34495e] font-sans tracking-wide">
            {data.skills.join(" • ")}
          </p>
        </section>
      </div>
    </div>
  );
};
