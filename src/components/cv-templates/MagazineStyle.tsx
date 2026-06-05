import React from 'react';
import { CVTemplateProps } from './types';

export const MagazineStyle: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#fdfbf7] text-[#1a1a1a] p-12 font-serif flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Magazine Header */}
      <header className="text-center mb-10 pb-6 border-b-[3px] border-[#1a1a1a] relative">
        <p className="text-xs font-sans tracking-widest uppercase mb-4 text-gray-500">The Professional Edit</p>
        <h1 className="text-7xl font-black uppercase tracking-tighter mb-2 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
          {data.personalInfo.fullName.split(' ')[0]}<br/>
          {data.personalInfo.fullName.split(' ').slice(1).join(' ')}
        </h1>
        <h2 className="text-xl italic text-gray-600 mt-4 font-sans tracking-widest uppercase">{data.personalInfo.jobTitle}</h2>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Col: Contact & Photo */}
        <div className="col-span-3 border-r border-gray-300 pr-6 space-y-8">
          {data.personalInfo.photoUrl && (
            <div className="w-full aspect-[3/4] overflow-hidden filter grayscale contrast-125 mb-6">
              <img src={data.personalInfo.photoUrl} alt="Profil" className="w-full h-full object-cover" />
            </div>
          )}
          
          <section className="text-xs font-sans text-gray-500 uppercase tracking-widest space-y-3">
            <h3 className="font-bold text-[#1a1a1a] mb-4 border-b border-gray-200 pb-2">Direct</h3>
            <p>{data.personalInfo.city}</p>
            <p>{data.personalInfo.phone}</p>
            <p className="break-all lowercase">{data.personalInfo.email}</p>
            {data.personalInfo.linkedin && <p className="break-all lowercase">{data.personalInfo.linkedin}</p>}
          </section>

          <section className="text-xs font-sans text-gray-500 uppercase tracking-widest space-y-3">
            <h3 className="font-bold text-[#1a1a1a] mb-4 border-b border-gray-200 pb-2">Education</h3>
            {data.educations.map((edu: any, i: number) => (
              <div key={i} className="mb-4">
                <p className="font-bold text-[#1a1a1a]">{edu.degree}</p>
                <p className="italic lowercase">{edu.school}</p>
                <p>{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Col: Content */}
        <div className="col-span-9 space-y-10 pl-2">
          {data.personalInfo.summary && (
            <section>
              <p className="text-xl leading-relaxed text-justify italic border-l-4 border-[#1a1a1a] pl-6 text-gray-700">
                "{data.personalInfo.summary}"
              </p>
            </section>
          )}

          <section>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Selected Work</h3>
            <div className="space-y-8">
              {data.experiences.map((exp: any, i: number) => (
                <article key={i} className="flex gap-6">
                  <div className="w-1/4 text-right shrink-0">
                    <p className="font-sans text-xs uppercase tracking-widest text-gray-400 font-bold">{exp.startDate}</p>
                    <p className="font-sans text-xs uppercase tracking-widest text-gray-400">{exp.endDate}</p>
                  </div>
                  <div className="w-3/4">
                    <h4 className="text-xl font-bold uppercase tracking-wide leading-tight">{exp.title}</h4>
                    <p className="font-sans text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{exp.company}</p>
                    <p className="text-sm leading-relaxed text-gray-700 text-justify">{exp.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-6 mt-12">Expertise</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {data.skills.map((skill: string, i: number) => (
                <span key={i} className="font-sans text-xs uppercase tracking-widest font-bold border border-gray-300 px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
