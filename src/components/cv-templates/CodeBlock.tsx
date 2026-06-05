import React from 'react';
import { CVTemplateProps } from './types';

export const CodeBlock: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="bg-[#1e1e1e] text-[#d4d4d4] font-mono p-10 flex flex-col" style={{ width: '210mm', minHeight: '297mm' }}>
      
      {/* VSCode Editor UI Mock */}
      <div className="flex border-b border-[#333] pb-2 mb-6">
        <div className="flex gap-2 items-center px-4 py-1 bg-[#1e1e1e] border-t-2 border-[#007acc] text-[#ccc] text-sm">
          <span className="text-[#569cd6] font-bold">TS</span> profile.ts
        </div>
      </div>

      <div className="flex-1 flex text-sm">
        {/* Line Numbers */}
        <div className="w-8 text-[#858585] text-right pr-4 select-none flex flex-col justify-between">
          {[...Array(40)].map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>

        {/* Code Content */}
        <div className="flex-1 space-y-1">
          <div><span className="text-[#c586c0]">import</span> {'{'} <span className="text-[#4fc1ff]">Developer</span> {'}'} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'@world/recruitment'</span>;</div>
          <br/>
          
          <div><span className="text-[#c586c0]">const</span> <span className="text-[#4fc1ff]">candidate</span> = {'{'}</div>
          
          <div className="pl-8">
            <span className="text-[#9cdcfe]">name</span>: <span className="text-[#ce9178]">'{data.personalInfo.fullName}'</span>,
          </div>
          <div className="pl-8">
            <span className="text-[#9cdcfe]">role</span>: <span className="text-[#ce9178]">'{data.personalInfo.jobTitle}'</span>,
          </div>
          <div className="pl-8">
            <span className="text-[#9cdcfe]">contact</span>: {'{'}
          </div>
          <div className="pl-16"><span className="text-[#9cdcfe]">email</span>: <span className="text-[#ce9178]">'{data.personalInfo.email}'</span>,</div>
          <div className="pl-16"><span className="text-[#9cdcfe]">phone</span>: <span className="text-[#ce9178]">'{data.personalInfo.phone}'</span>,</div>
          <div className="pl-16"><span className="text-[#9cdcfe]">location</span>: <span className="text-[#ce9178]">'{data.personalInfo.city}'</span>,</div>
          {data.personalInfo.linkedin && <div className="pl-16"><span className="text-[#9cdcfe]">linkedin</span>: <span className="text-[#ce9178]">'{data.personalInfo.linkedin}'</span>,</div>}
          <div className="pl-8">{'}'},</div>

          {data.personalInfo.summary && (
            <>
              <div className="pl-8 mt-2"><span className="text-[#9cdcfe]">summary</span>: <span className="text-[#ce9178]">`</span></div>
              <div className="pl-12 text-[#ce9178] max-w-2xl whitespace-pre-line">{data.personalInfo.summary}</div>
              <div className="pl-8"><span className="text-[#ce9178]">`</span>,</div>
            </>
          )}

          <div className="pl-8 mt-2"><span className="text-[#9cdcfe]">skills</span>: [</div>
          <div className="pl-12 text-[#ce9178]">
            {data.skills.map((skill: string, i: number) => (
              <span key={i}>'{skill}'{i < data.skills.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
          <div className="pl-8">],</div>

          <div className="pl-8 mt-2"><span className="text-[#9cdcfe]">experience</span>: [</div>
          {data.experiences.map((exp: any, i: number) => (
            <div key={i} className="pl-12 mb-2">
              {'{'}
              <div className="pl-4"><span className="text-[#9cdcfe]">role</span>: <span className="text-[#ce9178]">'{exp.title}'</span>,</div>
              <div className="pl-4"><span className="text-[#9cdcfe]">company</span>: <span className="text-[#ce9178]">'{exp.company}'</span>,</div>
              <div className="pl-4"><span className="text-[#9cdcfe]">period</span>: <span className="text-[#ce9178]">'{exp.startDate} - {exp.endDate}'</span>,</div>
              <div className="pl-4"><span className="text-[#9cdcfe]">description</span>: <span className="text-[#ce9178]">`{exp.description.replace(/\n/g, ' ')}`</span></div>
              {'}'}{i < data.experiences.length - 1 ? ',' : ''}
            </div>
          ))}
          <div className="pl-8">],</div>

          <div className="pl-8 mt-2"><span className="text-[#9cdcfe]">education</span>: [</div>
          {data.educations.map((edu: any, i: number) => (
            <div key={i} className="pl-12">
              {'{'} <span className="text-[#9cdcfe]">degree</span>: <span className="text-[#ce9178]">'{edu.degree}'</span>, <span className="text-[#9cdcfe]">school</span>: <span className="text-[#ce9178]">'{edu.school}'</span> {'}'}{i < data.educations.length - 1 ? ',' : ''}
            </div>
          ))}
          <div className="pl-8">]</div>

          <div>{'};'}</div>
          <br/>
          <div><span className="text-[#c586c0]">export default</span> <span className="text-[#4fc1ff]">candidate</span>;</div>
        </div>
      </div>
    </div>
  );
};
