import React from 'react';
import { CVTemplateProps } from './types';

export const CorporateBlue: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-900 p-10 font-sans border-t-8 border-[#0f4c81]" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-gray-200 pb-6 mb-8">
        <div className="flex gap-6 items-center">
          {data.personalInfo.photoUrl && (
            <div className="w-24 h-24 shrink-0 rounded border-2 border-[#0f4c81] overflow-hidden">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-[#0f4c81] tracking-tight uppercase mb-2">{data.personalInfo.fullName}</h1>
            <h2 className="text-xl font-medium text-gray-600">{data.personalInfo.jobTitle}</h2>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-1">
          <p>{data.personalInfo.city}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.email}</p>
          {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#0f4c81] mb-2 uppercase tracking-wider">Profil Professionnel</h3>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experiences */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#0f4c81] mb-4 uppercase tracking-wider border-b border-gray-200 pb-1">Parcours Professionnel</h3>
        <div className="space-y-6">
          {data.experiences.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-gray-900 text-base">{exp.title}</h4>
                <span className="text-sm font-semibold text-[#0f4c81]">{exp.startDate} - {exp.endDate || 'Présent'}</span>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">{exp.company}</div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Educations */}
        <div>
          <h3 className="text-lg font-bold text-[#0f4c81] mb-4 uppercase tracking-wider border-b border-gray-200 pb-1">Formation</h3>
          <div className="space-y-4">
            {data.educations.map((edu) => (
              <div key={edu.id}>
                <h4 className="font-bold text-gray-900 text-sm">{edu.degree}</h4>
                <div className="text-sm text-gray-600">{edu.school}</div>
                <div className="text-xs text-gray-500 italic mt-1">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Languages */}
        <div>
          <h3 className="text-lg font-bold text-[#0f4c81] mb-4 uppercase tracking-wider border-b border-gray-200 pb-1">Domaines d'expertise</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.skills?.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 text-sm font-medium">{skill}</span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-[#0f4c81] mb-4 uppercase tracking-wider border-b border-gray-200 pb-1">Langues</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.languages?.map((lang, idx) => (
              <li key={idx}>{lang}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
