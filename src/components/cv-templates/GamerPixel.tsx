import React from 'react';
import { CVTemplateProps } from './types';

export const GamerPixel: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#2b2b44] text-[#e0e0e0] font-mono p-10 flex flex-col relative" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Pixel Art Border Effect */}
      <div className="absolute inset-4 border-4 border-[#3a3f58] pointer-events-none"></div>
      <div className="absolute inset-5 border-2 border-[#5c6784] pointer-events-none"></div>

      <header className="text-center z-10 mb-8 pt-6">
        <div className="inline-block bg-[#1a1c2c] border-4 border-[#3a3f58] p-4 mb-4 shadow-[4px_4px_0_0_#1a1a1a]">
          {data.personalInfo.photoUrl ? (
            <div className="w-20 h-20 bg-[#f4f4f4] border-2 border-[#1a1c2c] overflow-hidden">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover pixelated" style={{ imageRendering: 'pixelated' }} />
            </div>
          ) : (
            <div className="w-20 h-20 bg-[#3a3f58] flex items-center justify-center text-3xl">👾</div>
          )}
        </div>
        
        <h1 className="text-4xl font-bold uppercase text-[#ffeb3b] drop-shadow-[2px_2px_0_#d84315] mb-2 tracking-widest">
          {data.personalInfo.fullName}
        </h1>
        <h2 className="text-xl font-bold text-[#4fc3f7] drop-shadow-[1px_1px_0_#0277bd] uppercase">
          Lv. 99 {data.personalInfo.jobTitle}
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-8 z-10 mb-8 px-6">
        {/* Stats Box (Contact) */}
        <div className="bg-[#1a1c2c] border-4 border-[#3a3f58] p-4 shadow-[4px_4px_0_0_#1a1a1a]">
          <h3 className="text-[#ffeb3b] font-bold uppercase mb-3 text-sm flex justify-between">
            <span>Player Stats</span> <span>HP: 100/100</span>
          </h3>
          <div className="text-xs space-y-2 text-[#b0bec5]">
            <p><span className="text-[#4fc3f7]">LOC:</span> {data.personalInfo.city}</p>
            <p><span className="text-[#4fc3f7]">COM:</span> {data.personalInfo.phone}</p>
            <p className="break-all"><span className="text-[#4fc3f7]">NET:</span> {data.personalInfo.email}</p>
          </div>
        </div>

        {/* Inventory Box (Skills) */}
        <div className="bg-[#1a1c2c] border-4 border-[#3a3f58] p-4 shadow-[4px_4px_0_0_#1a1a1a]">
          <h3 className="text-[#ffeb3b] font-bold uppercase mb-3 text-sm flex justify-between">
            <span>Inventory</span> <span>MP: 100/100</span>
          </h3>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {data.skills.map((skill: string, i: number) => (
              <span key={i} className="bg-[#5c6784] text-white px-2 py-1 uppercase shadow-[2px_2px_0_0_#3a3f58]">
                [{skill}]
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 z-10 flex-1 space-y-8">
        
        {data.personalInfo.summary && (
          <div className="bg-[#1a1c2c] border-4 border-[#3a3f58] p-5 shadow-[4px_4px_0_0_#1a1a1a]">
            <h3 className="text-[#ffeb3b] font-bold uppercase mb-2 text-sm">Quest Log / Intro</h3>
            <p className="text-xs text-[#e0e0e0] leading-loose">
              {"> "} {data.personalInfo.summary}
            </p>
          </div>
        )}

        <div className="bg-[#1a1c2c] border-4 border-[#3a3f58] p-5 shadow-[4px_4px_0_0_#1a1a1a]">
          <h3 className="text-[#ffeb3b] font-bold uppercase mb-4 text-sm">Main Quests (Experience)</h3>
          <div className="space-y-6">
            {data.experiences.map((exp: any, i: number) => (
              <div key={i} className="border-l-4 border-[#5c6784] pl-4 relative">
                <div className="absolute w-3 h-3 bg-[#ffeb3b] -left-[8px] top-1"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[#fff] text-sm uppercase">{exp.title}</h4>
                  <span className="text-[10px] text-[#ffeb3b]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[#4fc3f7] text-xs font-bold uppercase mb-2">@ {exp.company}</div>
                <p className="text-xs text-[#b0bec5] leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1c2c] border-4 border-[#3a3f58] p-5 shadow-[4px_4px_0_0_#1a1a1a]">
          <h3 className="text-[#ffeb3b] font-bold uppercase mb-4 text-sm">Tutorials Completed (Edu)</h3>
          <div className="space-y-4">
            {data.educations.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-xs border-b border-[#3a3f58] pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-white uppercase">{edu.degree}</span>
                  <span className="text-[#b0bec5] ml-2">({edu.school})</span>
                </div>
                <span className="text-[#4fc3f7] font-bold">XP+{edu.endDate.split('-')[0]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
