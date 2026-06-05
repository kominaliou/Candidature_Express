import React from 'react';
import { CVTemplateProps } from './types';

export const TeacherChalkboard: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#1e3b2e] text-[#f4f4f4] font-sans p-10 flex flex-col" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
      
      {/* Chalkboard Border Effect */}
      <div className="border-[8px] border-[#5c4033] rounded-sm p-8 h-full flex flex-col relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] bg-[url('https://www.transparenttextures.com/patterns/stucco.png')]">
        
        {/* Header */}
        <header className="text-center border-b-2 border-[#dcdcdc] border-dashed pb-6 mb-8 relative">
          {data.personalInfo.photoUrl && (
            <div className="w-24 h-24 mx-auto mb-4 bg-white p-2 shadow-md transform rotate-3">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-5xl font-bold tracking-wider text-[#fff] drop-shadow-md">{data.personalInfo.fullName}</h1>
          <h2 className="text-xl text-[#f0e68c] mt-2 underline decoration-wavy decoration-2">{data.personalInfo.jobTitle}</h2>
          
          <div className="flex justify-center gap-6 mt-4 text-sm font-medium text-[#dcdcdc]">
            <span>📍 {data.personalInfo.city}</span>
            <span>📞 {data.personalInfo.phone}</span>
            <span>✉️ {data.personalInfo.email}</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 flex-1">
          
          {/* Left Column */}
          <div className="col-span-4 space-y-8 border-r-2 border-[#dcdcdc] border-dashed pr-6">
            <section>
              <h3 className="text-xl font-bold text-[#f0e68c] mb-4 flex items-center gap-2">
                ✏️ Matières / Compétences
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {data.skills.map((skill: string, i: number) => (
                  <li key={i} className="text-[#fff]">{skill}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[#f0e68c] mb-4 flex items-center gap-2">
                🎓 Diplômes
              </h3>
              <div className="space-y-4">
                {data.educations.map((edu: any, i: number) => (
                  <div key={i} className="text-sm bg-white/10 p-3 rounded-lg border border-white/20">
                    <p className="font-bold text-[#fff]">{edu.degree}</p>
                    <p className="text-[#dcdcdc] text-xs mt-1">{edu.school}</p>
                    <p className="text-[#f0e68c] text-[10px] mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="col-span-8 space-y-8 pl-2">
            
            {data.personalInfo.summary && (
              <section>
                <h3 className="text-xl font-bold text-[#f0e68c] mb-3">📖 À propos de moi</h3>
                <p className="text-sm leading-relaxed text-[#fff] bg-white/5 p-4 rounded-xl border border-white/10">
                  {data.personalInfo.summary}
                </p>
              </section>
            )}

            <section>
              <h3 className="text-xl font-bold text-[#f0e68c] mb-6">🎒 Expérience Pédagogique</h3>
              <div className="space-y-6">
                {data.experiences.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-3 h-3 bg-[#f0e68c] rounded-full"></div>
                    <div className="absolute left-[5px] top-4 bottom-[-16px] w-[2px] bg-[#f0e68c]/30"></div>
                    
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-lg text-[#fff]">{exp.title}</h4>
                      <span className="text-xs bg-[#f0e68c] text-[#1e3b2e] px-2 py-1 rounded font-bold">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-bold text-[#dcdcdc] mb-2">@ {exp.company}</div>
                    <p className="text-sm text-[#fff] leading-relaxed whitespace-pre-line">
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
