import React from 'react';
import { CVTemplateProps } from './types';

export const PortfolioGallery: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-stone-50 text-stone-800 font-sans p-8 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Top Banner */}
      <div className="flex justify-between items-start mb-8 border-b border-stone-200 pb-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-light tracking-tight text-stone-900 mb-2">{data.personalInfo.fullName}</h1>
          <h2 className="text-xl font-medium text-stone-500 mb-6">{data.personalInfo.jobTitle}</h2>
          {data.personalInfo.summary && (
            <p className="text-sm text-stone-600 leading-relaxed font-serif italic">
              {data.personalInfo.summary}
            </p>
          )}
        </div>
        {data.personalInfo.photoUrl && (
          <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg transform rotate-3">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex gap-8 flex-1">
        {/* Left Col (Narrow) */}
        <div className="w-1/4 flex flex-col gap-8">
          <section className="bg-stone-100 p-4 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Info</h3>
            <div className="text-xs space-y-2 text-stone-700 font-medium">
              <p>{data.personalInfo.city}</p>
              <p>{data.personalInfo.phone}</p>
              <p className="break-all">{data.personalInfo.email}</p>
              {data.personalInfo.linkedin && <p className="break-all text-indigo-600">{data.personalInfo.linkedin}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, i: number) => (
                <span key={i} className="text-xs bg-white border border-stone-200 px-2 py-1 rounded text-stone-600 font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Formation</h3>
            <div className="space-y-4">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-xs">
                  <p className="font-bold text-stone-800">{edu.degree}</p>
                  <p className="text-stone-500">{edu.school}</p>
                  <p className="text-stone-400 mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col (Wide Gallery) */}
        <div className="w-3/4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 border-b border-stone-200 pb-2">Expériences Sélectionnées</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.experiences.map((exp: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="mb-auto">
                  <h4 className="font-bold text-stone-900 mb-1 leading-tight">{exp.title}</h4>
                  <p className="text-xs font-medium text-indigo-600 mb-2">{exp.company}</p>
                  <p className="text-xs text-stone-500 mb-4 bg-stone-50 inline-block px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
