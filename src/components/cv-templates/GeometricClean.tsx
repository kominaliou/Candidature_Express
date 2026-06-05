import React from 'react';
import { CVTemplateProps } from './types';

export const GeometricClean: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-800 font-sans relative" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Design Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-10 left-0 w-32 h-64 bg-blue-500 -z-10 mix-blend-multiply"></div>

      <div className="p-12 z-10">
        <header className="mb-16 border-b-8 border-gray-900 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-2">{data.personalInfo.fullName}</h1>
            <h2 className="text-2xl font-bold text-gray-500 tracking-widest uppercase">{data.personalInfo.jobTitle}</h2>
          </div>
          {data.personalInfo.photoUrl && (
            <div className="w-32 h-32 bg-gray-200 shrink-0 border-4 border-gray-900">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover grayscale" />
            </div>
          )}
        </header>

        <div className="grid grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="col-span-4 space-y-12">
            <section>
              <h3 className="bg-gray-900 text-white px-3 py-1 font-bold uppercase tracking-widest inline-block mb-4">Contact</h3>
              <div className="space-y-2 text-sm font-medium text-gray-800">
                <p>{data.personalInfo.city}</p>
                <p>{data.personalInfo.phone}</p>
                <p className="break-all">{data.personalInfo.email}</p>
                {data.personalInfo.linkedin && <p className="break-all">{data.personalInfo.linkedin}</p>}
              </div>
            </section>

            <section>
              <h3 className="bg-gray-900 text-white px-3 py-1 font-bold uppercase tracking-widest inline-block mb-4">Skills</h3>
              <div className="space-y-2 text-sm font-bold text-gray-800">
                {data.skills.map((skill: string, i: number) => (
                  <div key={i} className="border-b-2 border-gray-200 pb-1 uppercase">{skill}</div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="bg-gray-900 text-white px-3 py-1 font-bold uppercase tracking-widest inline-block mb-4">Edu</h3>
              <div className="space-y-4">
                {data.educations.map((edu: any, i: number) => (
                  <div key={i} className="text-sm">
                    <p className="font-bold text-gray-900 uppercase">{edu.degree}</p>
                    <p className="font-medium text-gray-600">{edu.school}</p>
                    <p className="text-xs text-gray-500 font-bold">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="col-span-8 space-y-12">
            {data.personalInfo.summary && (
              <section>
                <h3 className="bg-blue-500 text-white px-3 py-1 font-bold uppercase tracking-widest inline-block mb-4">Profile</h3>
                <p className="text-gray-700 leading-relaxed font-medium text-justify">
                  {data.personalInfo.summary}
                </p>
              </section>
            )}

            <section>
              <h3 className="bg-yellow-400 text-gray-900 px-3 py-1 font-bold uppercase tracking-widest inline-block mb-6">Experience</h3>
              <div className="space-y-8">
                {data.experiences.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-2 border-b-2 border-gray-900 pb-2">
                      <h4 className="font-black text-xl text-gray-900 uppercase">{exp.title}</h4>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 uppercase">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="font-bold text-blue-600 uppercase tracking-widest text-sm mb-3">{exp.company}</div>
                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
