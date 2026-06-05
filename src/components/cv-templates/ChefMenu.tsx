import React from 'react';
import { CVTemplateProps } from './types';

export const ChefMenu: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#fdfbf7] text-[#3e2723] font-serif p-12 flex flex-col items-center text-center relative" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Bordure style menu de restaurant */}
      <div className="absolute inset-4 border-[3px] border-double border-[#8d6e63] pointer-events-none"></div>

      <header className="mb-10 w-full z-10 pt-4">
        <p className="text-sm tracking-[0.3em] uppercase text-[#795548] mb-4">Le Chef</p>
        <h1 className="text-5xl font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.personalInfo.fullName}
        </h1>
        <h2 className="text-xl italic text-[#5d4037] border-b border-[#d7ccc8] inline-block pb-2 px-8">
          {data.personalInfo.jobTitle}
        </h2>
        
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-xs font-sans tracking-widest text-[#8d6e63] mt-6">
          <span>{data.personalInfo.city}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.email}</span>
        </div>
      </header>

      <div className="w-full max-w-2xl space-y-12 z-10">
        
        {data.personalInfo.summary && (
          <section>
            <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-[#8d6e63]"></span>
              L'Amuse-Bouche
              <span className="w-12 h-px bg-[#8d6e63]"></span>
            </h3>
            <p className="text-sm leading-relaxed text-[#5d4037] italic">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        <section>
          <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-8 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-[#8d6e63]"></span>
            Les Plats de Résistance
            <span className="w-12 h-px bg-[#8d6e63]"></span>
          </h3>
          <div className="space-y-8 text-left">
            {data.experiences.map((exp: any, i: number) => (
              <div key={i} className="relative">
                <div className="flex justify-between items-baseline mb-1 border-b border-dotted border-[#d7ccc8] pb-1">
                  <h4 className="font-bold text-lg uppercase tracking-wider text-[#3e2723]">{exp.title}</h4>
                  <span className="text-sm font-sans font-bold text-[#8d6e63]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="italic text-[#5d4037] mb-3 text-sm">{exp.company}</div>
                <p className="text-sm text-[#5d4037] leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-[#8d6e63]"></span>
            Les Ingrédients
            <span className="w-12 h-px bg-[#8d6e63]"></span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {data.skills.map((skill: string, i: number) => (
              <span key={i} className="text-xs uppercase font-sans tracking-widest border border-[#d7ccc8] px-3 py-1 text-[#5d4037]">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-[#8d6e63]"></span>
            La Brigade (Formation)
            <span className="w-12 h-px bg-[#8d6e63]"></span>
          </h3>
          <div className="space-y-4">
            {data.educations.map((edu: any, i: number) => (
              <div key={i} className="text-center">
                <p className="font-bold uppercase tracking-wider text-[#3e2723]">{edu.degree}</p>
                <p className="italic text-[#5d4037] text-sm">{edu.school}</p>
                <p className="text-xs font-sans text-[#8d6e63] mt-1">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
