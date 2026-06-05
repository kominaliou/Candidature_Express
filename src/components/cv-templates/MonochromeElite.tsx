import React from 'react';
import { CVTemplateProps } from './types';

export const MonochromeElite: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-black font-sans flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header pleine largeur noir */}
      <header className="bg-black text-white p-12 flex flex-col items-center text-center">
        {data.personalInfo.photoUrl && (
          <div className="w-28 h-28 mb-6 rounded-full overflow-hidden border-2 border-white">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover grayscale" />
          </div>
        )}
        <h1 className="text-5xl font-black uppercase tracking-[0.2em] mb-3">{data.personalInfo.fullName}</h1>
        <h2 className="text-xl font-light tracking-[0.3em] uppercase text-gray-300">{data.personalInfo.jobTitle}</h2>
      </header>

      {/* Info Bar */}
      <div className="border-b border-black py-4 px-12 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black">
        <span>{data.personalInfo.city}</span>
        <span>{data.personalInfo.phone}</span>
        <span className="lowercase">{data.personalInfo.email}</span>
      </div>

      <div className="p-12 grid grid-cols-12 gap-12 flex-1">
        
        {/* Left Column */}
        <div className="col-span-4 space-y-10 border-r border-black pr-8">
          <section>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6">Compétences</h3>
            <ul className="space-y-3">
              {data.skills.map((skill: string, i: number) => (
                <li key={i} className="text-sm font-bold uppercase border-b border-gray-300 pb-1">{skill}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6">Formation</h3>
            <div className="space-y-6">
              {data.educations.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="font-black text-sm uppercase">{edu.degree}</p>
                  <p className="text-xs font-bold uppercase text-gray-500 mt-1">{edu.school}</p>
                  <p className="text-xs font-bold bg-black text-white px-2 py-1 inline-block mt-2">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-10 pl-4">
          
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-lg font-black uppercase tracking-widest mb-4">Profil</h3>
              <p className="text-sm font-medium leading-loose text-justify">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-lg font-black uppercase tracking-widest mb-8">Expérience</h3>
            <div className="space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-lg uppercase">{exp.title}</h4>
                    <span className="text-xs font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 border border-black">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{exp.company}</div>
                  <p className="text-sm font-medium leading-loose text-justify whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};
