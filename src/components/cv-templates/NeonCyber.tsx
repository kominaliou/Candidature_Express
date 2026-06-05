import React from 'react';
import { CVTemplateProps } from './types';

export const NeonCyber: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#050510] text-[#e0e0ff] p-10 font-sans tracking-wide" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header Neon */}
      <div className="flex items-center gap-8 mb-10 pb-6 border-b border-[#00f0ff]/30">
        {data.personalInfo.photoUrl && (
          <div className="w-28 h-28 shrink-0 rounded-lg border-2 border-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.5)] overflow-hidden">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover grayscale contrast-125" />
          </div>
        )}
        <div>
          <h1 className="text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ff003c] tracking-widest drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] mb-2">
            {data.personalInfo.fullName}
          </h1>
          <h2 className="text-xl text-[#00f0ff] font-mono tracking-widest">{data.personalInfo.jobTitle}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-8">
          <section>
            <h3 className="text-[#ff003c] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-[#ff003c] shadow-[0_0_8px_#ff003c]"></div> SYS.CONTACT
            </h3>
            <div className="text-xs font-mono space-y-2 text-[#a0a0d0]">
              <p>LOC :: {data.personalInfo.city}</p>
              <p>COM :: {data.personalInfo.phone}</p>
              <p className="break-all">NET :: {data.personalInfo.email}</p>
              {data.personalInfo.linkedin && <p className="break-all">LNK :: {data.personalInfo.linkedin}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-[#ff003c] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-[#ff003c] shadow-[0_0_8px_#ff003c]"></div> SYS.SKILLS
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, i: number) => (
                <span key={i} className="bg-transparent border border-[#00f0ff] text-[#00f0ff] px-2 py-1 text-xs font-mono uppercase shadow-[inset_0_0_5px_rgba(0,240,255,0.3)]">
                  {skill}
                </span>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="text-[#ff003c] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-[#ff003c] shadow-[0_0_8px_#ff003c]"></div> SYS.EDU
            </h3>
            <div className="space-y-4 text-xs font-mono text-[#a0a0d0]">
              {data.educations.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="text-[#00f0ff] uppercase">{edu.degree}</p>
                  <p>{edu.school}</p>
                  <p className="text-[#ff003c] opacity-80">{edu.startDate} : {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-8 pl-4 border-l border-[#00f0ff]/20">
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-[#00f0ff] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></div> EXE.PROFILE
              </h3>
              <p className="text-sm font-mono text-[#c0c0f0] leading-relaxed bg-[#00f0ff]/5 p-4 border border-[#00f0ff]/30">
                {"> "}{data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-[#00f0ff] font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></div> EXE.EXPERIENCE
            </h3>
            <div className="space-y-6">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <h4 className="font-bold text-lg text-white uppercase">{exp.title}</h4>
                  <div className="font-mono text-xs text-[#ff003c] mb-2">{exp.company} // {exp.startDate} TO {exp.endDate}</div>
                  <p className="text-sm font-mono text-[#a0a0d0] whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
