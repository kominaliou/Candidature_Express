import React from 'react';
import { CVTemplateProps } from './types';

export const CreativeTimeline: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#fafafa] text-gray-800 p-12 font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header avec couleur vibrante */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg overflow-hidden">
          {data.personalInfo.photoUrl ? (
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            data.personalInfo.fullName.charAt(0)
          )}
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{data.personalInfo.fullName}</h1>
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mt-1 mb-4">
          {data.personalInfo.jobTitle}
        </h2>
        <div className="flex gap-4 text-sm font-medium text-gray-500 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
          <span>{data.personalInfo.email}</span>
          <span className="text-gray-300">|</span>
          <span>{data.personalInfo.phone}</span>
          <span className="text-gray-300">|</span>
          <span>{data.personalInfo.city}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Colonne Principale (Timeline) */}
        <div className="col-span-8">
          {data.personalInfo.summary && (
            <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 to-orange-400"></div>
              <p className="text-gray-600 leading-relaxed italic">"{data.personalInfo.summary}"</p>
            </div>
          )}

          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm">💼</span> 
            Expériences
          </h3>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10"></div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">{exp.title}</h4>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">{exp.startDate}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">{exp.company}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Latérale */}
        <div className="col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Top Compétences</h3>
            <div className="flex flex-col gap-3">
              {data.skills?.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-pink-500 to-orange-400 h-2.5 rounded-full" style={{ width: `${Math.max(50, 100 - (idx * 10))}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-16 text-right truncate">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Formations</h3>
            <div className="space-y-4">
              {data.educations.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-pink-200">
                  <div className="absolute w-2 h-2 bg-pink-500 rounded-full -left-[5px] top-1.5"></div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{edu.degree}</h4>
                  <div className="text-xs text-gray-500 mt-1">{edu.school}</div>
                  <div className="text-[10px] font-bold text-pink-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>

          {data.languages && data.languages.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Langues</h3>
              <div className="flex flex-wrap gap-2">
                {data.languages.map((lang, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{lang}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
