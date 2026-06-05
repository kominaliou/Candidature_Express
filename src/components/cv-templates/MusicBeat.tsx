import React from 'react';
import { CVTemplateProps } from './types';

export const MusicBeat: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#0f0c29] text-white font-sans p-10 flex flex-col relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm', background: 'linear-gradient(to right, #24243e, #302b63, #0f0c29)' }}>
      
      {/* Sound wave decorative background */}
      <div className="absolute top-1/4 left-0 w-full h-32 flex items-center justify-center opacity-10 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="w-4 bg-white mx-1 rounded-full" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
        ))}
      </div>

      <header className="flex justify-between items-center z-10 mb-12 border-b border-[#ff007f] pb-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#7928ca] mb-2 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
            {data.personalInfo.fullName}
          </h1>
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#a8a8b3]">{data.personalInfo.jobTitle}</h2>
        </div>
        {data.personalInfo.photoUrl && (
          <div className="w-24 h-24 rounded-full border-4 border-[#ff007f] shadow-[0_0_20px_#ff007f] overflow-hidden">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-8 z-10 flex-1">
        
        {/* Left Column */}
        <div className="col-span-4 space-y-10 border-r border-white/10 pr-6">
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#ff007f] mb-4">▶ Setlist (Contact)</h3>
            <div className="space-y-3 text-sm text-[#e0e0e0] font-light">
              <p>{data.personalInfo.city}</p>
              <p>{data.personalInfo.phone}</p>
              <p className="break-all">{data.personalInfo.email}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#7928ca] mb-4">▶ Instruments (Skills)</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, i: number) => (
                <span key={i} className="bg-white/5 border border-[#7928ca] text-xs px-2 py-1 uppercase rounded-md shadow-[0_0_5px_rgba(121,40,202,0.3)]">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#ff007f] mb-4">▶ Backstage (Edu)</h3>
            <div className="space-y-5">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="font-bold text-white uppercase">{edu.degree}</p>
                  <p className="text-[#a8a8b3] mt-1">{edu.school}</p>
                  <p className="text-[#ff007f] text-xs font-bold mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-10 pl-2">
          
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#7928ca] mb-4 flex items-center gap-2">
                <span className="w-4 h-4 bg-[#7928ca] rounded-sm animate-pulse"></span> The Vibe
              </h3>
              <p className="text-sm leading-relaxed text-[#e0e0e0] bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#ff007f] mb-6 flex items-center gap-2">
              <span className="w-4 h-4 bg-[#ff007f] rounded-sm"></span> On Tour (Experience)
            </h3>
            <div className="space-y-6">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-[#ff007f]/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg uppercase tracking-wide">{exp.title}</h4>
                    <span className="text-[10px] font-bold bg-gradient-to-r from-[#ff007f] to-[#7928ca] px-3 py-1 rounded-full uppercase">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-[#7928ca] font-bold text-sm mb-3 uppercase tracking-wider">{exp.company}</div>
                  <p className="text-sm text-[#c0c0c0] leading-relaxed whitespace-pre-line">
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
