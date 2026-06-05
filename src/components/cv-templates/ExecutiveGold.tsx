import React from 'react';
import { CVTemplateProps } from './types';

export const ExecutiveGold: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#1c1c1c] text-[#f4f4f4] font-serif p-12 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header Formel avec Ligne Dorée */}
      <header className="border-b-[3px] border-[#c5a059] pb-8 mb-10 flex gap-8 items-center">
        {data.personalInfo.photoUrl && (
          <div className="w-32 h-32 shrink-0 overflow-hidden border-2 border-[#c5a059]">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-5xl font-normal tracking-wide uppercase mb-2 text-[#fff]">
            {data.personalInfo.fullName}
          </h1>
          <h2 className="text-xl italic text-[#c5a059]">{data.personalInfo.jobTitle}</h2>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12 flex-1">
        
        {/* Left Column */}
        <div className="col-span-4 space-y-10">
          <section>
            <h3 className="text-[#c5a059] uppercase tracking-widest text-sm font-bold mb-4 border-b border-[#333] pb-2">Coordonnées</h3>
            <div className="space-y-3 text-sm font-sans font-light">
              <p>{data.personalInfo.city}</p>
              <p>{data.personalInfo.phone}</p>
              <p className="break-all">{data.personalInfo.email}</p>
              {data.personalInfo.linkedin && <p className="break-all">{data.personalInfo.linkedin}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-[#c5a059] uppercase tracking-widest text-sm font-bold mb-4 border-b border-[#333] pb-2">Expertise</h3>
            <div className="space-y-2 font-sans text-sm font-light uppercase tracking-wider">
              {data.skills.map((skill: string, i: number) => (
                <div key={i}>{skill}</div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[#c5a059] uppercase tracking-widest text-sm font-bold mb-4 border-b border-[#333] pb-2">Éducation</h3>
            <div className="space-y-5 font-sans">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="font-bold text-[#fff]">{edu.degree}</p>
                  <p className="text-[#999] my-1">{edu.school}</p>
                  <p className="text-[#c5a059] text-xs font-bold tracking-widest">{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-10">
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-[#c5a059] uppercase tracking-widest text-sm font-bold mb-4 border-b border-[#333] pb-2">Profil Exécutif</h3>
              <p className="text-sm leading-relaxed text-[#ccc] text-justify font-sans font-light">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-[#c5a059] uppercase tracking-widest text-sm font-bold mb-6 border-b border-[#333] pb-2">Parcours Professionnel</h3>
            <div className="space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-xl text-[#fff] tracking-wide">{exp.title}</h4>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#c5a059] font-sans text-sm font-bold uppercase tracking-wider">{exp.company}</span>
                    <span className="font-sans text-xs text-[#888] tracking-widest uppercase border border-[#333] px-2 py-1">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#bbb] leading-relaxed font-light whitespace-pre-line text-justify">
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
