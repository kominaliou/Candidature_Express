import React from 'react';
import { CVTemplateProps } from './types';

export const StartupAgile: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-800 font-sans p-12" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Header Notion-like */}
      <div className="mb-8">
        {/* Cover Image Simulation */}
        <div className="h-24 bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl mb-[-40px]"></div>
        
        <div className="px-8 flex justify-between items-end relative">
          <div className="flex items-end gap-4">
            {data.personalInfo.photoUrl ? (
              <div className="w-24 h-24 rounded-lg shadow-sm border-4 border-white bg-white overflow-hidden">
                <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="text-6xl bg-white rounded-lg shadow-sm border-4 border-white">🚀</div>
            )}
            <div className="mb-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{data.personalInfo.fullName}</h1>
              <h2 className="text-xl text-gray-500 font-medium">{data.personalInfo.jobTitle}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 space-y-8">
        
        {/* Contact info (Properties-like) */}
        <div className="grid grid-cols-2 text-sm gap-y-2 max-w-2xl">
          <div className="flex gap-2"><span className="text-gray-400 w-24">📍 Location</span> <span className="font-medium">{data.personalInfo.city}</span></div>
          <div className="flex gap-2"><span className="text-gray-400 w-24">📱 Phone</span> <span className="font-medium">{data.personalInfo.phone}</span></div>
          <div className="flex gap-2"><span className="text-gray-400 w-24">✉️ Email</span> <span className="font-medium text-teal-600 underline">{data.personalInfo.email}</span></div>
          {data.personalInfo.linkedin && <div className="flex gap-2"><span className="text-gray-400 w-24">🔗 LinkedIn</span> <span className="font-medium text-teal-600 underline">{data.personalInfo.linkedin}</span></div>}
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* About */}
        {data.personalInfo.summary && (
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">👋 About me</h3>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-3 gap-8">
          
          {/* Main Content (Experiences) */}
          <div className="col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">💼 Experience</h3>
              <div className="space-y-6">
                {data.experiences.map((exp: any, i: number) => (
                  <div key={i} className="border border-gray-200 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{exp.title}</h4>
                        <div className="text-teal-600 font-medium text-sm">{exp.company}</div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                        {exp.startDate} → {exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed mt-2">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Content */}
          <div className="col-span-1 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">⚡ Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, i: number) => (
                  <span key={i} className="bg-teal-50 text-teal-700 border border-teal-100 px-2 py-1 rounded text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🎓 Education</h3>
              <div className="space-y-4">
                {data.educations.map((edu: any, i: number) => (
                  <div key={i} className="text-sm">
                    <p className="font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-gray-500">{edu.school}</p>
                    <p className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</p>
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
