import React from 'react';
import { CVTemplateProps } from './types';

export const HackerConsole: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#0a0a0a] text-[#00ff00] font-mono p-12 tracking-tight flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Console Header */}
      <div className="mb-10 pb-4 border-b-2 border-[#00ff00]/30 border-dashed">
        <div className="text-xs mb-4 opacity-70">
          <p>Login: root</p>
          <p>Last login: {new Date().toUTCString()} from 192.168.1.1</p>
        </div>
        <div className="flex gap-8 items-start">
          {data.personalInfo.photoUrl && (
            <div className="w-24 h-24 border border-[#00ff00] p-1 shrink-0">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover filter contrast-125 sepia hue-rotate-90 saturate-200" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{`root@${data.personalInfo.fullName.replace(/\s+/g, '_').toLowerCase()}:~$`}</h1>
            <h2 className="text-xl">echo "{data.personalInfo.jobTitle}"</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Info Box */}
        <div className="border border-[#00ff00]/50 p-4">
          <div className="text-xs mb-2"># System configuration</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="opacity-70">HOST=</span>{data.personalInfo.city}</p>
            <p><span className="opacity-70">TEL=</span>{data.personalInfo.phone}</p>
            <p className="break-all"><span className="opacity-70">MAIL=</span>{data.personalInfo.email}</p>
            {data.personalInfo.linkedin && <p className="break-all"><span className="opacity-70">NET=</span>{data.personalInfo.linkedin}</p>}
          </div>
        </div>

        {/* Profile */}
        {data.personalInfo.summary && (
          <section>
            <h3 className="text-lg font-bold mb-2">{'>'} cat /var/log/profile.txt</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line border-l-2 border-[#00ff00]/30 pl-4">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        <section>
          <h3 className="text-lg font-bold mb-4">{'>'} ./execute_experience.sh</h3>
          <div className="space-y-6">
            {data.experiences.map((exp: any, i: number) => (
              <div key={i} className="pl-4 border-l border-[#00ff00]/20">
                <div className="font-bold">[{exp.startDate} - {exp.endDate}] <span className="text-white">{exp.title}</span> @ {exp.company}</div>
                <p className="text-sm mt-2 whitespace-pre-line opacity-90">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-lg font-bold mb-4">{'>'} ls -la /usr/local/skills/</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {data.skills.map((skill: string, i: number) => (
              <span key={i}>drwxr-xr-x {skill}</span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-bold mb-4">{'>'} make education</h3>
          <div className="space-y-3">
            {data.educations.map((edu: any, i: number) => (
              <div key={i} className="text-sm flex justify-between">
                <span><span className="font-bold">{edu.degree}</span> -- {edu.school}</span>
                <span>[{edu.startDate} - {edu.endDate}]</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-4 text-xs opacity-50 text-center animate-pulse">
          _ cursor blinking
        </div>
      </div>
    </div>
  );
};
