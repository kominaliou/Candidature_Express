import React from 'react';
import { CVTemplateProps } from './types';

export const TravelPassport: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#e8ecef] text-[#2c3e50] font-sans p-10 flex flex-col items-center relative overflow-hidden" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* Background Passport Pages Effect */}
      <div className="absolute inset-4 bg-[#fdfbf7] rounded-xl shadow-xl overflow-hidden border border-[#dcdde1]">
        {/* Passport background watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-96 h-96 border-[20px] border-double border-[#2c3e50] rounded-full rotate-45 flex items-center justify-center">
            <span className="text-9xl font-serif">🌐</span>
          </div>
        </div>
        
        {/* Top Header / Passport identity page style */}
        <header className="flex gap-8 p-10 border-b-2 border-dashed border-[#bdc3c7] relative">
          <div className="absolute top-4 right-6 text-[#c0392b] font-mono text-xl font-bold tracking-widest opacity-80 transform rotate-12 border-2 border-[#c0392b] p-1 rounded">
            APPROVED
          </div>
          
          <div className="w-1/3 flex flex-col items-center">
            {data.personalInfo.photoUrl ? (
              <div className="w-36 h-48 border-2 border-[#ecf0f1] shadow-md p-2 bg-white mb-4">
                <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover filter contrast-125" />
              </div>
            ) : (
              <div className="w-36 h-48 border-2 border-[#ecf0f1] shadow-md p-2 bg-[#ecf0f1] mb-4 flex items-center justify-center">
                <span className="text-gray-400 uppercase text-xs font-bold">Photo</span>
              </div>
            )}
            <div className="text-center w-full">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.personalInfo.fullName)}`} alt="QR" className="w-16 h-16 mx-auto opacity-70" />
            </div>
          </div>

          <div className="w-2/3 space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-widest text-[#2c3e50] border-b border-[#ecf0f1] pb-2">
              {data.personalInfo.fullName}
            </h1>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono uppercase tracking-wider text-[#7f8c8d]">
              <div>
                <span className="block text-[9px] text-[#bdc3c7] font-bold mb-1">Type / Profession</span>
                <span className="text-[#34495e] font-bold text-sm">{data.personalInfo.jobTitle}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#bdc3c7] font-bold mb-1">Code / City</span>
                <span className="text-[#34495e] font-bold text-sm">{data.personalInfo.city}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#bdc3c7] font-bold mb-1">Comm / Phone</span>
                <span className="text-[#34495e] font-bold">{data.personalInfo.phone}</span>
              </div>
              <div>
                <span className="block text-[9px] text-[#bdc3c7] font-bold mb-1">Link / Email</span>
                <span className="text-[#34495e] font-bold lowercase break-all">{data.personalInfo.email}</span>
              </div>
            </div>

            {/* Passport Machine Readable Zone */}
            <div className="mt-8 pt-4 font-mono text-[10px] tracking-[0.2em] text-[#34495e] bg-[#ecf0f1] p-3 rounded">
              P&lt;FRA{data.personalInfo.fullName.replace(/\s+/g, '&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
              9901010M2501017FRA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;08
            </div>
          </div>
        </header>

        {/* Visas / Content */}
        <div className="p-10 grid grid-cols-2 gap-10">
          
          <div className="space-y-8 relative">
            {/* Stamp decorative */}
            <div className="absolute top-10 left-10 w-24 h-24 border-4 border-[#2980b9] rounded-full opacity-20 flex items-center justify-center transform -rotate-12 pointer-events-none">
              <span className="text-[#2980b9] font-bold text-sm text-center">VISA<br/>ENTRY</span>
            </div>

            {data.personalInfo.summary && (
              <section className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-[#ecf0f1] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-3 border-b border-[#ecf0f1] pb-1">Declaration</h3>
                <p className="text-sm font-serif italic text-[#34495e] leading-relaxed">
                  {data.personalInfo.summary}
                </p>
              </section>
            )}

            <section className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-[#ecf0f1] shadow-sm relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-4 border-b border-[#ecf0f1] pb-1">Destinations (Experience)</h3>
              <div className="space-y-6">
                {data.experiences.map((exp: any, i: number) => (
                  <div key={i} className="pl-4 border-l-2 border-[#3498db]">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2c3e50] uppercase text-sm">{exp.title}</h4>
                      <span className="text-[10px] font-mono bg-[#ecf0f1] px-1 text-[#7f8c8d]">{exp.startDate} / {exp.endDate}</span>
                    </div>
                    <div className="text-[#2980b9] font-bold text-xs uppercase tracking-wide mb-2">{exp.company}</div>
                    <p className="text-xs text-[#34495e] leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8 relative">
            {/* Stamp decorative */}
            <div className="absolute top-20 right-10 w-20 h-20 border-2 border-[#27ae60] opacity-20 flex items-center justify-center transform rotate-12 pointer-events-none">
              <span className="text-[#27ae60] font-bold text-sm text-center">DEPARTURE<br/>APPROVED</span>
            </div>

            <section className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-[#ecf0f1] shadow-sm relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-4 border-b border-[#ecf0f1] pb-1">Endorsements (Skills)</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, i: number) => (
                  <span key={i} className="text-xs uppercase font-mono bg-[#ecf0f1] border border-[#bdc3c7] text-[#2c3e50] px-2 py-1 transform -rotate-1">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-[#ecf0f1] shadow-sm relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-4 border-b border-[#ecf0f1] pb-1">Certifications (Edu)</h3>
              <div className="space-y-4">
                {data.educations.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start border-b border-[#ecf0f1] border-dashed pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-bold text-[#2c3e50] text-sm uppercase">{edu.degree}</div>
                      <div className="text-[#7f8c8d] text-xs font-serif italic mt-1">{edu.school}</div>
                    </div>
                    <div className="text-[10px] font-mono bg-[#ecf0f1] px-1 text-[#7f8c8d] whitespace-nowrap">{edu.startDate} - {edu.endDate}</div>
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
