import React from 'react';
import { CVTemplateProps } from './types';

export const ClassicTemplate: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-900 p-10 font-serif" style={{ width: '210mm', minHeight: '297mm' }}>
      {data.personalInfo.photoUrl && (
        <div className="mb-4 w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-gray-900">
          <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
        </div>
      )}
      <h1 className="text-4xl font-bold text-center mb-1">{data.personalInfo.fullName}</h1>
      <p className="text-center text-xl italic text-gray-700 mb-4">{data.personalInfo.jobTitle}</p>
      
      <div className="text-center text-sm mb-6 pb-6 border-b-2 border-gray-900">
        <span className="mx-2">{data.personalInfo.email}</span> | 
        <span className="mx-2">{data.personalInfo.phone}</span> | 
        <span className="mx-2">{data.personalInfo.city}</span>
        {data.personalInfo.linkedin && (
          <> | <span className="mx-2">{data.personalInfo.linkedin}</span></>
        )}
      </div>
      
      {data.personalInfo.summary && (
        <div className="mb-6 text-justify text-sm leading-relaxed">
          {data.personalInfo.summary}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-4 pb-1 tracking-widest">Expériences Professionnelles</h2>
        {data.experiences.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-lg">{exp.title}</h3>
              <span className="italic text-sm">{exp.startDate} - {exp.endDate || 'Présent'}</span>
            </div>
            <div className="font-semibold text-gray-700 mb-2">{exp.company}</div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-4 pb-1 tracking-widest">Formation</h2>
        {data.educations.map((edu) => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold">{edu.degree}</h3>
              <span className="italic text-sm">{edu.startDate} - {edu.endDate}</span>
            </div>
            <div className="text-gray-700 text-sm">{edu.school}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-4 pb-1 tracking-widest">Compétences</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {data.skills?.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold uppercase border-b border-gray-400 mb-4 pb-1 tracking-widest">Langues</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {data.languages?.map((lang, idx) => (
              <li key={idx}>{lang}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
