import React from 'react';
import { CVTemplateProps } from './types';

export const ConsultantPro: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#f8f9fa] text-[#2b2b2b] font-sans flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Top Banner */}
      <div className="bg-[#1f3b4d] text-white p-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">{data.personalInfo.fullName}</h1>
          <h2 className="text-xl font-light text-[#8ab4f8]">{data.personalInfo.jobTitle}</h2>
        </div>
        {data.personalInfo.photoUrl && (
          <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden shadow-lg">
            <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <div className="w-1/3 bg-[#eceef1] p-8 border-r border-[#dee2e6] space-y-8">
          
          <section>
            <h3 className="text-sm font-bold uppercase text-[#1f3b4d] mb-4 border-b-2 border-[#1f3b4d] inline-block pb-1">Contact</h3>
            <div className="space-y-3 text-sm text-[#495057]">
              <p className="flex flex-col"><span className="text-xs font-bold text-[#868e96]">Localisation</span> {data.personalInfo.city}</p>
              <p className="flex flex-col"><span className="text-xs font-bold text-[#868e96]">Téléphone</span> {data.personalInfo.phone}</p>
              <p className="flex flex-col"><span className="text-xs font-bold text-[#868e96]">Email</span> <span className="break-all">{data.personalInfo.email}</span></p>
              {data.personalInfo.linkedin && <p className="flex flex-col"><span className="text-xs font-bold text-[#868e96]">LinkedIn</span> <span className="break-all">{data.personalInfo.linkedin}</span></p>}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase text-[#1f3b4d] mb-4 border-b-2 border-[#1f3b4d] inline-block pb-1">Domaines d'expertise</h3>
            <ul className="space-y-2 text-sm text-[#495057] font-medium">
              {data.skills.map((skill: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#8ab4f8] rounded-full"></span> {skill}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase text-[#1f3b4d] mb-4 border-b-2 border-[#1f3b4d] inline-block pb-1">Formation</h3>
            <div className="space-y-4">
              {data.educations.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="font-bold text-[#343a40]">{edu.degree}</p>
                  <p className="text-[#495057] italic text-xs">{edu.school}</p>
                  <p className="text-[#868e96] text-xs font-medium mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-10 space-y-8 bg-white">
          
          {data.personalInfo.summary && (
            <section>
              <h3 className="text-lg font-bold uppercase text-[#1f3b4d] mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-[#1f3b4d]"></span> Résumé Exécutif
              </h3>
              <p className="text-sm text-[#495057] leading-relaxed text-justify bg-[#f8f9fa] p-4 border-l-4 border-[#8ab4f8]">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-lg font-bold uppercase text-[#1f3b4d] mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-[#1f3b4d]"></span> Expérience Professionnelle
            </h3>
            <div className="space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-base text-[#212529]">{exp.title}</h4>
                    <span className="text-xs font-bold text-[#8ab4f8] bg-[#eef3f8] px-2 py-1 rounded">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#1f3b4d] mb-3">{exp.company}</div>
                  <p className="text-sm text-[#495057] leading-relaxed whitespace-pre-line text-justify">
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
