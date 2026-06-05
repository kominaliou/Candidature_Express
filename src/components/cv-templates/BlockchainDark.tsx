import React from 'react';
import { CVTemplateProps } from './types';

export const BlockchainDark: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#121212] text-[#e0e0e0] font-sans p-10 flex flex-col relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[30%] bg-[#d4af37] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[30%] bg-[#f8f9fa] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center border-b border-[#333] pb-8 mb-10 z-10">
        <div>
          <h1 className="text-5xl font-light tracking-widest text-white uppercase mb-2">
            {data.personalInfo.fullName.split(' ')[0]} <span className="font-bold text-[#d4af37]">{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <h2 className="text-xl font-medium tracking-[0.2em] text-[#a0a0a0] uppercase">{data.personalInfo.jobTitle}</h2>
        </div>
        {data.personalInfo.photoUrl && (
          <div className="w-28 h-28 shrink-0 rounded-full border border-[#d4af37] p-1 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover rounded-full filter grayscale" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-10 flex-1 z-10">
        
        {/* Left Column (Metadata) */}
        <div className="col-span-4 space-y-10">
          <section>
            <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-[#333] pb-2">Network</h3>
            <div className="space-y-3 text-sm font-light text-[#b0b0b0]">
              <p>{data.personalInfo.city}</p>
              <p>{data.personalInfo.phone}</p>
              <p className="break-all">{data.personalInfo.email}</p>
              {data.personalInfo.linkedin && <p className="break-all text-[#d4af37]">{data.personalInfo.linkedin}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-[#333] pb-2">Nodes / Skills</h3>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill: string, i: number) => (
                <div key={i} className="bg-[#1e1e1e] border border-[#2a2a2a] px-3 py-2 text-xs uppercase tracking-widest text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-[#333] pb-2">Genesis Blocks</h3>
            <div className="space-y-4">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="font-bold text-white uppercase tracking-wider text-xs mb-1">{edu.degree}</p>
                  <p className="text-[#888] font-light">{edu.school}</p>
                  <p className="text-[#d4af37] text-[10px] uppercase tracking-widest mt-1">{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Transactions/Experience) */}
        <div className="col-span-8 space-y-10">
          
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-[#333] pb-2">Smart Contract</h3>
              <p className="text-[#c0c0c0] font-light leading-relaxed text-sm bg-[#1a1a1a] p-5 border border-[#222]">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em] mb-6 border-b border-[#333] pb-2">Ledger / Experience</h3>
            <div className="space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative pl-6 border-l border-[#333]">
                  {/* Block node */}
                  <div className="absolute w-2 h-2 bg-[#121212] border border-[#d4af37] -left-[4.5px] top-1.5 transform rotate-45"></div>
                  
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-white text-lg tracking-wide">{exp.title}</h4>
                    <span className="text-[10px] font-mono text-[#888] border border-[#333] px-2 py-1 bg-[#1a1a1a]">
                      {exp.startDate} / {exp.endDate}
                    </span>
                  </div>
                  <div className="text-[#d4af37] font-medium text-sm mb-3 tracking-wider">{exp.company}</div>
                  <p className="text-sm text-[#a0a0a0] font-light leading-relaxed whitespace-pre-line">
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
