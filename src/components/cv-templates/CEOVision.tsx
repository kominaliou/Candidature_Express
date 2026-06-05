import React from 'react';
import { CVTemplateProps } from './types';

export const CEOVision: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#f0f0f0] text-[#1a1a1a] font-serif p-12 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header Imposant */}
      <header className="border-b-[5px] border-[#1a1a1a] pb-8 mb-10 flex gap-10 items-center bg-white p-8 shadow-sm">
        {data.personalInfo.photoUrl && (
          <div className="w-36 h-36 shrink-0 border border-[#e0e0e0] shadow-md p-2 bg-white transform -rotate-2">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover filter grayscale contrast-125" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs font-bold font-sans tracking-[0.2em] uppercase text-gray-500 mb-2">Executive Profile</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-2 leading-none text-[#1a1a1a]">
            {data.personalInfo.fullName}
          </h1>
          <h2 className="text-2xl italic text-[#4a4a4a] font-medium">{data.personalInfo.jobTitle}</h2>
        </div>
      </header>

      <div className="flex-1 flex gap-12">
        
        {/* Colonne Principale (Large) */}
        <div className="w-2/3 space-y-12">
          
          {data.personalInfo.summary && (
            <section className="relative">
              <span className="text-8xl text-gray-200 absolute -top-8 -left-4 font-serif z-0">"</span>
              <p className="text-lg leading-relaxed text-justify text-[#333] relative z-10 font-medium italic pl-6 border-l-4 border-[#1a1a1a]">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-sm font-black font-sans uppercase tracking-[0.3em] text-[#1a1a1a] mb-8 flex items-center gap-4">
              Expérience de Direction <span className="h-px flex-1 bg-gray-300"></span>
            </h3>
            <div className="space-y-10">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-black text-2xl uppercase tracking-tight text-[#1a1a1a]">{exp.title}</h4>
                    <span className="text-xs font-bold font-sans uppercase tracking-widest text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-4 font-sans uppercase tracking-wide">{exp.company}</div>
                  <p className="text-sm text-[#444] leading-loose text-justify font-sans whitespace-pre-line bg-white p-5 border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Colonne Latérale (Étroite) */}
        <div className="w-1/3 space-y-12">
          
          <section className="bg-[#1a1a1a] text-white p-6 shadow-lg">
            <h3 className="text-xs font-black font-sans uppercase tracking-[0.2em] mb-6 text-gray-400 border-b border-gray-700 pb-2">Direct Contact</h3>
            <div className="space-y-4 text-sm font-sans tracking-wide">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Location</span>
                {data.personalInfo.city}
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Mobile</span>
                {data.personalInfo.phone}
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Email</span>
                <span className="break-all text-gray-300">{data.personalInfo.email}</span>
              </div>
              {data.personalInfo.linkedin && (
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Network</span>
                  <span className="break-all text-gray-300">{data.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black font-sans uppercase tracking-[0.2em] text-[#1a1a1a] mb-6 border-b-2 border-[#1a1a1a] inline-block pb-1">Core Competencies</h3>
            <div className="flex flex-col gap-3 font-sans">
              {data.skills.map((skill: string, i: number) => (
                <div key={i} className="text-sm font-bold text-gray-700 uppercase tracking-widest bg-white px-4 py-3 border-l-4 border-[#1a1a1a] shadow-sm">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black font-sans uppercase tracking-[0.2em] text-[#1a1a1a] mb-6 border-b-2 border-[#1a1a1a] inline-block pb-1">Academic Background</h3>
            <div className="space-y-6 font-sans">
              {data.educations.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="font-bold text-sm text-[#1a1a1a] uppercase leading-tight mb-1">{edu.degree}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">{edu.school}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
