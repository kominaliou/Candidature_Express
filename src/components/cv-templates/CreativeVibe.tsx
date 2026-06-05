import React from 'react';
import { CVTemplateProps } from './types';

export const CreativeVibe: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#fff9fc] text-gray-800 p-0 font-sans flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header Forme Organique */}
      <div className="bg-gradient-to-r from-pink-200 to-purple-300 p-12 rounded-br-[100px] shadow-sm relative">
        <div className="flex gap-8 items-center">
          {data.personalInfo.photoUrl && (
            <div className="w-32 h-32 shrink-0 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="z-10">
            <h1 className="text-5xl font-extrabold text-purple-900 tracking-tight mb-2">{data.personalInfo.fullName}</h1>
            <h2 className="text-2xl font-medium text-pink-700">{data.personalInfo.jobTitle}</h2>
          </div>
        </div>
      </div>

      <div className="p-10 flex gap-8">
        {/* Main Column */}
        <div className="flex-1 space-y-8">
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">✦</span> Profil
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm bg-white p-4 rounded-2xl shadow-sm border border-pink-50">{data.personalInfo.summary}</p>
            </section>
          )}

          <section>
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">✦</span> Expérience
            </h3>
            <div className="space-y-6">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative pl-6 border-l-2 border-pink-200">
                  <div className="absolute w-3 h-3 bg-purple-400 rounded-full -left-[7px] top-1.5 ring-4 ring-[#fff9fc]"></div>
                  <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                  <div className="text-pink-600 font-medium text-sm mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-1/3 space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-purple-50">
            <h3 className="text-lg font-bold text-purple-800 mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">📍 {data.personalInfo.city}</p>
              <p className="flex items-center gap-2">📱 {data.personalInfo.phone}</p>
              <p className="flex items-center gap-2 break-all">✉️ {data.personalInfo.email}</p>
              {data.personalInfo.linkedin && <p className="flex items-center gap-2 break-all">🔗 {data.personalInfo.linkedin}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-800 mb-4">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, i: number) => (
                <span key={i} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-800 mb-4">Formation</h3>
            <div className="space-y-4 text-sm">
              {data.educations.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="font-bold text-gray-900">{edu.degree}</p>
                  <p className="text-purple-600">{edu.school}</p>
                  <p className="text-gray-400 text-xs">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
