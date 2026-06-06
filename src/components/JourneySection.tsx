import React, { useState } from 'react';
import { Calendar, Award, Users, Briefcase, ChevronRight } from 'lucide-react';

interface JourneyItem {
  id: number;
  title: string;
  imageUrl: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function JourneySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const journeyItems: JourneyItem[] = [
    {
      id: 1,
      title: 'INTERNSHIP',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
      icon: <Briefcase className="w-6 h-6" />,
      content: (
        <div className="flex flex-col h-full justify-between p-8 md:p-10 text-left text-white z-10 relative">
          <div>
            <div className="flex items-center gap-2 text-orange-500 font-mono text-sm mb-4">
              <Calendar className="w-4 h-4" />
              <span>[ DEC 2025 – MAR 2026 ]</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 font-display text-white uppercase">
              Winter Intern
            </h3>
            <p className="text-sm font-semibold text-orange-400 mb-4 font-mono uppercase tracking-wider">
              Innovation & Entrepreneurship Development Cell
            </p>
            <p className="text-xs text-zinc-500 font-mono mb-6 uppercase">
              Dept. of CSE, IoT, CS & BT, UEM Kolkata
            </p>
            <p className="text-zinc-300 text-base leading-relaxed font-sans border-l-2 border-orange-500/30 pl-5 py-1">
              Contributed to entrepreneurship and innovation-focused research and development initiatives under faculty mentorship.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-500 border-t border-zinc-800/60 pt-4 uppercase">
            SIMULATION_LOG: COMPLETED_STABLE
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'CAMPUS & COMMUNITY',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="flex flex-col h-full justify-between p-8 md:p-10 text-left text-white z-10 relative">
          <div>
            <span className="text-orange-500 font-mono text-xs tracking-wider uppercase mb-3 block">UEMK Engagement Log</span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-5 font-display text-white uppercase">
              Campus Activities
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { role: "Student Operations Lead", org: "Microsoft Student Society, UEMK" },
                { role: "Member", org: "IEEE Computer Society Student Branch, UEMK" },
                { role: "Member", org: "Geeks for Geeks Student Chapter, UEMK" },
                { role: "Member", org: "RoboMellontikos Robotics Society, UEMK" },
                { role: "Coordinator, Robotics", org: "URECKON'26" },
                { role: "Registration & Database Lead", org: "IGNITIA'26" },
                { role: "Volunteer, Robotics", org: "URECKON'25" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <ChevronRight className="w-4 h-4 text-orange-500/70 mt-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 leading-tight">{item.role}</h4>
                    <p className="text-xs text-zinc-500 font-mono leading-none mt-1">{item.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs font-mono text-zinc-500 border-t border-zinc-800/60 pt-4 uppercase">
            ENGAGEMENT_COUNT: 07_ROLES
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'CERTIFICATIONS',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      icon: <Award className="w-6 h-6" />,
      content: (
        <div className="flex flex-col h-full justify-between p-8 md:p-10 text-left text-white z-10 relative">
          <div>
            <span className="text-orange-500 font-mono text-xs tracking-wider uppercase mb-3 block">Verified Credentials</span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-5 font-display text-white uppercase">
              Certifications
            </h3>
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                "Introduction to Generative AI & Agents — Microsoft",
                "Introduction to AI Concepts — Microsoft",
                "NLP Concepts — Microsoft",
                "ML Concepts — Microsoft",
                "Foundations of Project Management — Google",
                "The Joy of Computing using Python — NPTEL",
                "English for Competitive Exams — NPTEL",
                "Understanding Research Methods",
                "Introduction to Large Language Models"
              ].map((cert, idx) => {
                const parts = cert.split(' — ');
                return (
                  <div key={idx} className="flex items-start gap-3 group">
                    <Award className="w-4 h-4 text-orange-500/70 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 leading-tight">{parts[0]}</h4>
                      {parts[1] && <p className="text-xs text-zinc-500 font-mono leading-none mt-1">{parts[1]}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs font-mono text-zinc-500 border-t border-zinc-800/60 pt-4 uppercase">
            VERIFIED_COUNT: 09_DOCS
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="experience" className="reveal relative py-20 bg-black overflow-hidden">
      
      {/* Background ambient flares */}
      <div className="absolute top-1/3 left-1/4 w-[50vw] h-[350px] bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none font-display">
              Journey
            </h2>
            <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              A chronological ledger of professional training, campus leadership, and verified technical credentials.
            </p>
            <p className="mt-4 text-sm font-mono text-zinc-600 max-w-xl mx-auto lg:mx-0">
              Hover over each panel on the right to expand the detailed log of each milestone.
            </p>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full lg:w-2/3 flex justify-center lg:justify-end">
            <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4 w-full max-w-[900px]">
              {journeyItems.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={item.id}
                    className={`
                      relative h-[560px] rounded-2xl overflow-hidden cursor-pointer
                      transition-all duration-700 ease-in-out border
                      ${isActive 
                        ? 'w-[540px] border-orange-500/30 shadow-[0_0_35px_rgba(249,115,22,0.15)] bg-zinc-950/90' 
                        : 'w-[90px] border-zinc-800/60 bg-zinc-950/60 hover:border-orange-500/20'
                      }
                    `}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {/* Background Image */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className={`
                        absolute inset-0 w-full h-full object-cover transition-all duration-700
                        ${isActive ? 'opacity-20 scale-105' : 'opacity-10 scale-100'}
                      `}
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent z-0" />

                    {/* Active Content rendering */}
                    {isActive ? (
                      item.content
                    ) : (
                      // Inactive state vertical text title
                      <div className="absolute inset-0 flex flex-col items-center justify-between py-12 z-10 select-none pointer-events-none">
                        <div className="bg-orange-500/5 p-3.5 rounded-2xl border border-orange-500/15 text-orange-500">
                          {item.icon}
                        </div>
                        <span className="text-zinc-500 text-sm font-bold tracking-[0.2em] whitespace-nowrap uppercase transform -rotate-90 origin-center my-auto font-mono">
                          {item.title}
                        </span>
                        <div className="text-xs text-zinc-700 font-mono">
                          0{item.id}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Centered page-fitting dashed border line at the bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
        <div className="border-b border-dashed border-zinc-800 w-full" />
      </div>
    </section>
  );
}
