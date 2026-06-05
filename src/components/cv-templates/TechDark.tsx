import React from 'react';
import { CVTemplateProps } from './types';

export const TechDark: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] p-10 font-mono" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header Style Terminal */}
      <div className="border border-[#30363d] rounded-lg overflow-hidden mb-8">
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <div className="ml-2 text-xs text-[#8b949e]">guest@{data.personalInfo.fullName.replace(/\s+/g, '').toLowerCase()} ~ % </div>
        </div>
        <div className="p-6 bg-[#0d1117] flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#58a6ff] mb-2">&gt; {data.personalInfo.fullName}</h1>
            <h2 className="text-xl text-[#8b949e] mb-4">  role: "{data.personalInfo.jobTitle}"</h2>
            <div className="text-sm space-y-1 text-[#c9d1d9]">
              <p>  <span className="text-[#ff7b72]">email:</span> "{data.personalInfo.email}"</p>
              <p>  <span className="text-[#ff7b72]">phone:</span> "{data.personalInfo.phone}"</p>
              <p>  <span className="text-[#ff7b72]">location:</span> "{data.personalInfo.city}"</p>
              {data.personalInfo.linkedin && <p>  <span className="text-[#ff7b72]">link:</span> "{data.personalInfo.linkedin}"</p>}
            </div>
          </div>
          {data.personalInfo.photoUrl && (
            <div className="w-28 h-28 shrink-0 rounded overflow-hidden border border-[#30363d] grayscale opacity-80 shadow-lg">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-8">
          <div>
            <h3 className="text-[#58a6ff] font-bold border-b border-[#30363d] pb-2 mb-4">/* SKILLS */</h3>
            <div className="flex flex-col gap-2">
              {data.skills?.map((skill, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-[#ff7b72]">-</span> {skill}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#58a6ff] font-bold border-b border-[#30363d] pb-2 mb-4">/* LANGUAGES */</h3>
            <div className="flex flex-col gap-2">
              {data.languages?.map((lang, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-[#79c0ff]">&gt;</span> {lang}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-[#58a6ff] font-bold border-b border-[#30363d] pb-2 mb-4">/* EDUCATION */</h3>
            <div className="space-y-4">
              {data.educations.map((edu) => (
                <div key={edu.id}>
                  <div className="text-[#d2a8ff] font-bold text-sm">{edu.degree}</div>
                  <div className="text-[#8b949e] text-xs mt-1">{edu.school}</div>
                  <div className="text-[#79c0ff] text-xs mt-1">[{edu.startDate} - {edu.endDate}]</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-8">
          {data.personalInfo.summary && (
            <div>
              <h3 className="text-[#58a6ff] font-bold border-b border-[#30363d] pb-2 mb-4">/* ABOUT */</h3>
              <p className="text-sm leading-relaxed text-[#8b949e]">{data.personalInfo.summary}</p>
            </div>
          )}

          <div>
            <h3 className="text-[#58a6ff] font-bold border-b border-[#30363d] pb-2 mb-4">/* EXPERIENCES */</h3>
            <div className="space-y-6">
              {data.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-[#30363d] pl-4 relative">
                  <div className="absolute w-2 h-2 bg-[#238636] rounded-full -left-[5px] top-1.5"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-[#c9d1d9] text-base">{exp.title}</h4>
                    <span className="text-xs text-[#8b949e]">[{exp.startDate} : {exp.endDate || 'now'}]</span>
                  </div>
                  <div className="text-[#d2a8ff] text-sm mb-2">@{exp.company}</div>
                  <p className="text-sm text-[#8b949e] leading-relaxed whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
