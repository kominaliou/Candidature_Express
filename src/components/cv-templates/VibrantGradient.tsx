import React from 'react';
import { CVTemplateProps } from './types';

export const VibrantGradient: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-800 font-sans flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* En-tête Gradient */}
      <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 text-white p-12 relative overflow-hidden">
        {/* Cercles de fond pour dynamiser */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {data.personalInfo.photoUrl && (
            <div className="w-36 h-36 shrink-0 rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden bg-white">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          )}
          <div className={!data.personalInfo.photoUrl ? "text-center w-full" : ""}>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">{data.personalInfo.fullName}</h1>
            <h2 className="text-2xl font-medium text-white/90 drop-shadow-sm">{data.personalInfo.jobTitle}</h2>
          </div>
        </div>
      </div>

      {/* Bandeau de contact */}
      <div className="bg-gray-900 text-white/80 py-4 px-12 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm font-medium">
        <span>📍 {data.personalInfo.city}</span>
        <span>📱 {data.personalInfo.phone}</span>
        <span>✉️ {data.personalInfo.email}</span>
        {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
      </div>

      <div className="p-12 flex-1 grid grid-cols-3 gap-10">
        {/* Colonne Principale */}
        <div className="col-span-2 space-y-8">
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-red-500 pb-2 mb-4">Profil</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-6">Expérience Professionnelle</h3>
            <div className="space-y-6">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">{exp.title}</h4>
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-orange-600 font-semibold mb-2">{exp.company}</div>
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Colonne Latérale */}
        <div className="col-span-1 space-y-8">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-pink-500 pb-2 mb-4">Compétences</h3>
            <div className="flex flex-col gap-3">
              {data.skills.map((skill: string, i: number) => (
                <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-semibold text-gray-800 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-400 pb-2 mb-4">Formation</h3>
            <div className="space-y-5">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="relative pl-4 border-l-2 border-orange-200">
                  <div className="absolute w-2 h-2 bg-orange-500 rounded-full -left-[5px] top-1.5"></div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{edu.degree}</p>
                  <p className="text-orange-600 text-sm my-1">{edu.school}</p>
                  <p className="text-gray-400 text-xs italic">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
