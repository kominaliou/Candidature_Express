import React from 'react';
import { CVTemplateProps } from './types';

export const DataScience: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#f0f4f8] text-[#334155] font-sans flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header Dashboard Style */}
      <header className="bg-white border-b-4 border-[#0ea5e9] p-8 flex justify-between items-center shadow-sm">
        <div className="flex gap-6 items-center">
          {data.personalInfo.photoUrl && (
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-24 h-24 rounded-lg object-cover shadow-md border border-gray-100" />
          )}
          <div>
            <div className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider mb-1">CANDIDAT_DATA_NODE</div>
            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">{data.personalInfo.fullName}</h1>
            <h2 className="text-xl font-medium text-[#64748b]">{data.personalInfo.jobTitle}</h2>
          </div>
        </div>
        
        {/* KPI Mini-cards */}
        <div className="flex gap-4">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-lg text-center min-w[80px]">
            <div className="text-2xl font-bold text-[#0ea5e9]">{data.experiences.length}</div>
            <div className="text-[10px] text-[#64748b] uppercase font-bold">Rôles</div>
          </div>
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-lg text-center min-w[80px]">
            <div className="text-2xl font-bold text-[#10b981]">{data.skills.length}</div>
            <div className="text-[10px] text-[#64748b] uppercase font-bold">Skills</div>
          </div>
        </div>
      </header>

      <div className="p-8 grid grid-cols-12 gap-8 flex-1">
        
        {/* Left Column (Metadata) */}
        <div className="col-span-4 space-y-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9] pb-2 mb-3"># Parameters</h3>
            <div className="space-y-3 text-sm text-[#475569]">
              <div className="flex justify-between items-center"><span className="text-[#94a3b8]">LOC</span> <span className="font-medium text-right">{data.personalInfo.city}</span></div>
              <div className="flex justify-between items-center"><span className="text-[#94a3b8]">TEL</span> <span className="font-medium text-right">{data.personalInfo.phone}</span></div>
              <div className="flex flex-col"><span className="text-[#94a3b8]">MAIL</span> <span className="font-medium truncate">{data.personalInfo.email}</span></div>
              {data.personalInfo.linkedin && <div className="flex flex-col"><span className="text-[#94a3b8]">LINK</span> <span className="font-medium truncate text-[#0ea5e9]">{data.personalInfo.linkedin}</span></div>}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9] pb-2 mb-3"># Skill_Matrix</h3>
            <div className="space-y-2">
              {data.skills.map((skill: string, i: number) => {
                // Generate a pseudo-random width between 60% and 95% based on index
                const barWidth = 60 + ((i * 17) % 35); 
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-[#334155]">{skill}</span>
                      <span className="text-[#94a3b8]">{barWidth}%</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5">
                      <div className="bg-[#0ea5e9] h-1.5 rounded-full" style={{ width: `${barWidth}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e2e8f0]">
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9] pb-2 mb-3"># Education_Log</h3>
            <div className="space-y-4">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                  <div className="text-[#64748b] text-xs">{edu.school}</div>
                  <div className="text-[#0ea5e9] text-[10px] font-bold mt-1 bg-[#e0f2fe] inline-block px-2 py-0.5 rounded">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Data streams) */}
        <div className="col-span-8 space-y-8">
          
          {data.personalInfo.summary && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0]">
              <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3"># Executive_Summary</h3>
              <p className="text-[#334155] text-sm leading-relaxed border-l-4 border-[#0ea5e9] pl-4 bg-[#f8fafc] py-2">
                {data.personalInfo.summary}
              </p>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0] flex-1">
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider border-b border-[#f1f5f9] pb-3 mb-6"># Experience_Timeline</h3>
            <div className="relative border-l-2 border-[#e2e8f0] ml-3 space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-white border-4 border-[#0ea5e9] rounded-full -left-[9px] top-1"></div>
                  
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 relative before:absolute before:-left-2 before:top-3 before:w-2 before:h-2 before:bg-[#f8fafc] before:border-l before:border-b before:border-[#e2e8f0] before:transform before:rotate-45">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-lg leading-tight">{exp.title}</h4>
                        <div className="text-[#0ea5e9] font-medium text-sm">{exp.company}</div>
                      </div>
                      <span className="text-[10px] font-bold text-[#64748b] bg-[#f1f5f9] px-2 py-1 rounded">
                        {exp.startDate} / {exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line mt-3">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
