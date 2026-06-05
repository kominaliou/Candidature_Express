import React from 'react';
import { CVTemplateProps } from './types';

export const ModernTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-800 flex font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Sidebar (Blue) */}
      <div className="w-1/3 bg-blue-700 text-white p-8">
        {data.personalInfo.photoUrl && (
          <div className="mb-6 w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mx-auto">
            <img src={data.personalInfo.photoUrl} alt="Photo de profil" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2 text-center">{data.personalInfo.fullName}</h1>
        <p className="text-blue-100 text-sm mb-8 text-center">{data.personalInfo.jobTitle}</p>
        
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="text-blue-200 uppercase font-semibold mb-2 text-xs tracking-wider border-b border-blue-600 pb-1">Contact</h3>
            <div className="space-y-2">
              <p>{data.personalInfo.email}</p>
              <p>{data.personalInfo.phone}</p>
              <p>{data.personalInfo.city}</p>
              {data.personalInfo.linkedin && <p className="truncate">{data.personalInfo.linkedin}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-blue-200 uppercase font-semibold mb-2 text-xs tracking-wider border-b border-blue-600 pb-1">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((skill, idx) => (
                <span key={idx} className="bg-blue-600 px-2 py-1 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-blue-200 uppercase font-semibold mb-2 text-xs tracking-wider border-b border-blue-600 pb-1">Langues</h3>
            <ul className="list-disc list-inside space-y-1">
              {data.languages?.map((lang, idx) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8 bg-white">
        {data.personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-500"></span> Profil
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-blue-500"></span> Expériences
          </h2>
          <div className="space-y-5">
            {data.experiences?.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {exp.startDate} - {exp.endDate || 'Présent'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-blue-500"></span> Formations
          </h2>
          <div className="space-y-4">
            {data.educations?.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
