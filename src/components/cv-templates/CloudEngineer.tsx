import React from 'react';
import { CVTemplateProps } from './types';

export const CloudEngineer: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#f8fafc] text-[#334155] font-sans p-10 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Cloud Top Navigation Bar Style */}
      <div className="bg-[#0f172a] text-white px-6 py-3 rounded-t-xl flex justify-between items-center shadow-md z-10 relative">
        <div className="flex gap-4 items-center">
          <div className="w-4 h-4 bg-[#38bdf8] rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          </div>
          <span className="font-semibold tracking-wide uppercase text-sm">Cloud_Profile_Manager</span>
        </div>
        <div className="text-xs text-[#94a3b8] font-mono">
          Region: {data.personalInfo.city} | Status: ACTIVE
        </div>
      </div>

      {/* Main Content Area (Dashboard) */}
      <div className="bg-white border-x border-b border-[#e2e8f0] rounded-b-xl p-8 flex-1 shadow-sm">
        
        {/* Header Profile Section */}
        <div className="flex gap-6 items-start mb-10 pb-8 border-b border-[#e2e8f0] border-dashed">
          {data.personalInfo.photoUrl && (
            <div className="w-28 h-28 shrink-0 rounded-lg bg-[#f1f5f9] p-1 border border-[#cbd5e1]">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover rounded-md" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#0f172a] mb-1">{data.personalInfo.fullName}</h1>
            <h2 className="text-lg text-[#0ea5e9] font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              {data.personalInfo.jobTitle}
            </h2>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[#64748b]">
              <span className="bg-[#f1f5f9] px-2 py-1 rounded">📞 {data.personalInfo.phone}</span>
              <span className="bg-[#f1f5f9] px-2 py-1 rounded">✉️ {data.personalInfo.email}</span>
              {data.personalInfo.linkedin && <span className="bg-[#f1f5f9] px-2 py-1 rounded text-[#0ea5e9]">🔗 {data.personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column (Metadata/Resources) */}
          <div className="col-span-4 space-y-8">
            <section>
              <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#38bdf8] rounded-sm"></div> Resource: Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, i: number) => (
                  <span key={i} className="text-xs bg-white border border-[#cbd5e1] text-[#334155] px-2.5 py-1.5 rounded-md shadow-sm font-medium hover:border-[#38bdf8] transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#38bdf8] rounded-sm"></div> Base Image: Edu
              </h3>
              <div className="space-y-4">
                {data.educations.map((edu: any, i: number) => (
                  <div key={i} className="text-sm border-l-2 border-[#e2e8f0] pl-3">
                    <p className="font-bold text-[#0f172a]">{edu.degree}</p>
                    <p className="text-[#64748b]">{edu.school}</p>
                    <p className="text-[10px] uppercase font-mono text-[#94a3b8] mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Deployments/Experience) */}
          <div className="col-span-8 space-y-8">
            {data.personalInfo.summary && (
              <section>
                <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#10b981] rounded-sm"></div> Configuration Summary
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
                  {data.personalInfo.summary}
                </p>
              </section>
            )}

            <section>
              <h3 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#8b5cf6] rounded-sm"></div> Deployment History
              </h3>
              <div className="space-y-5">
                {data.experiences.map((exp: any, i: number) => (
                  <div key={i} className="border border-[#e2e8f0] rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-2 border-b border-[#f1f5f9] pb-3">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-lg">{exp.title}</h4>
                        <div className="text-[#64748b] font-medium text-sm flex items-center gap-1">
                          <span className="text-[#0ea5e9]">@</span> {exp.company}
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-[#f1f5f9] text-[#475569] px-2 py-1 rounded">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-[#475569] whitespace-pre-line leading-relaxed pt-2">
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
