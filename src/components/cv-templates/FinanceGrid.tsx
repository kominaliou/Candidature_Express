import React from 'react';
import { CVTemplateProps } from './types';

export const FinanceGrid: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-black font-sans p-10 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header strict */}
      <header className="flex justify-between items-start border-b-[4px] border-black pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-1">{data.personalInfo.fullName}</h1>
          <h2 className="text-lg font-semibold uppercase text-gray-700">{data.personalInfo.jobTitle}</h2>
        </div>
        <div className="text-right text-xs font-semibold uppercase tracking-wider space-y-1 bg-gray-100 p-3 border border-black">
          <p>{data.personalInfo.city}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.email}</p>
          {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-8 flex-1">
        
        {/* Left Column */}
        <div className="col-span-8 space-y-8">
          {data.personalInfo.summary && (
            <section className="border border-black p-4 bg-gray-50">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-3">Executive Summary</h3>
              <p className="text-sm leading-relaxed text-justify font-medium text-gray-800">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">Professional Experience</h3>
            <div className="space-y-6">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-base uppercase text-black">{exp.title}</h4>
                    <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">{exp.company}</div>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line text-justify pl-4 border-l-2 border-gray-300">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-8">
          
          {data.personalInfo.photoUrl && (
            <div className="w-full aspect-square border-4 border-black p-1 mb-8">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover filter grayscale" />
            </div>
          )}

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">Core Competencies</h3>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill: string, i: number) => (
                <div key={i} className="text-xs font-bold uppercase border border-gray-400 p-2 text-center bg-gray-50">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 mb-4">Education</h3>
            <div className="space-y-4">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="border border-black p-3 bg-white">
                  <p className="font-bold text-black text-sm uppercase leading-tight mb-1">{edu.degree}</p>
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">{edu.school}</p>
                  <p className="text-[10px] font-bold bg-gray-200 text-black px-2 py-1 text-center">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};
