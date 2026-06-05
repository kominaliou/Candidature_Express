import React from 'react';
import { CVTemplateProps } from './types';

export const MinimalistTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-800 p-12 font-sans tracking-wide" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="mb-12 border-l-4 border-gray-900 pl-6 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-light tracking-tighter mb-2 text-gray-900">{data.personalInfo.fullName}</h1>
          <h2 className="text-xl text-gray-500 font-medium tracking-widest uppercase">{data.personalInfo.jobTitle}</h2>
        </div>
        {data.personalInfo.photoUrl && (
          <div className="w-24 h-24 shrink-0 overflow-hidden">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover grayscale" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="col-span-4 space-y-10">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Contact</h3>
            <div className="text-sm space-y-2 text-gray-600">
              <p>{data.personalInfo.email}</p>
              <p>{data.personalInfo.phone}</p>
              <p>{data.personalInfo.city}</p>
              {data.personalInfo.linkedin && <p className="truncate">{data.personalInfo.linkedin}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Compétences</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              {data.skills?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Langues</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              {data.languages?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-10">
          {data.personalInfo.summary && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-4">Profil</h3>
              <p className="text-sm leading-relaxed text-gray-600">{data.personalInfo.summary}</p>
            </div>
          )}

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Expériences</h3>
            <div className="space-y-8">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-4 top-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                  <div className="text-xs text-gray-400 font-mono mb-1">{exp.startDate} — {exp.endDate || 'Présent'}</div>
                  <div className="font-semibold text-lg text-gray-900">{exp.title}</div>
                  <div className="text-gray-500 mb-3">{exp.company}</div>
                  <p className="text-sm leading-relaxed text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Formations</h3>
            <div className="space-y-6">
              {data.educations.map((edu) => (
                <div key={edu.id}>
                  <div className="text-xs text-gray-400 font-mono mb-1">{edu.startDate} — {edu.endDate}</div>
                  <div className="font-semibold text-gray-900">{edu.degree}</div>
                  <div className="text-gray-500 text-sm">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
