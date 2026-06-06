import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  title: string;
  subtitle: string;
  icon: string;
  tags: string[];
  backgroundImage: string;
  boyImage: string;
  link?: string;
}

const PROJECTS_DATA: Project[] = [
  {
    title: "Learning to Optimize",
    subtitle: "Developed an Agentic AutoML framework for breast cancer MRI classification using deep metric learning, reward-driven optimization, and self-regulating feedback mechanisms. Evaluated multiple CNN and Transformer architectures, achieving 99.49% accuracy and 0.9996 ROC-AUC. A book chapter based on this work is currently under development.",
    icon: "🧬",
    tags: ["Agentic AI", "AutoML", "Deep Metric Learning", "CNN / Transformer", "ROC-AUC 0.9996"],
    backgroundImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80",
    boyImage: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
    link: "https://github.com/Muskan6122005"
  },
  {
    title: "MediKin – AI Medical App",
    subtitle: "Built a dark-themed medical emergency companion app (React, Vite, Firebase) where scanning a patient's QR code gives doctors instant access to medical history, prescriptions, and scans. Features multi-channel SOS dispatch (voice, WhatsApp, SMS, email via Twilio & EmailJS), canvas-based image compression, AI medical summaries via Groq's LLaMA 3.3-70B flagging high-risk medications and allergies, and multilingual support across English, Hindi, and Bengali.",
    icon: "🏥",
    tags: ["React / Vite", "Firebase", "Groq LLaMA 3.3", "Twilio & EmailJS", "QR Code Scan"],
    backgroundImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80",
    boyImage: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
    link: "https://github.com/captainramen35-lgtm/MediKin"
  },
  {
    title: "PlacePilot – Full-Stack AI Prep Hub",
    subtitle: "Built a full-stack AI-powered placement prep platform (React, Firebase, Tailwind CSS, Framer Motion) featuring a dynamic progress dashboard, topic-wise DSA roadmap tracker, centralized prep hub for mock interviews and aptitudes, Firebase-driven notes system, ATS resume analyzer, and company-specific preparation paths — all wrapped in a premium Dark Academia x Futurism UI.",
    icon: "🎓",
    tags: ["React / Firebase", "Tailwind CSS", "Framer Motion", "ATS Analyzer", "Dark Academia UI"],
    backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    boyImage: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
    link: "https://github.com/captainramen35-lgtm/PlacePilot"
  },
  {
    title: "ResumeForge – AI Resume Builder",
    subtitle: "Built a client-side SPA resume builder (Groq LLaMA-3, Glassmorphism UI) with dynamic role-based profiles for freshers and experienced users, AI-powered bullet point rewriting, auto-generated professional summaries, an ATS match evaluator that pinpoints missing keywords against a job description, multiple CSS templates, theme customization, and PDF export via html2pdf.js.",
    icon: "🌟",
    tags: ["Groq LLaMA-3", "Glassmorphism UI", "html2pdf.js", "ATS Evaluator", "SPA Builder"],
    backgroundImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop&q=80",
    boyImage: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
    link: "https://github.com/captainramen35-lgtm/ResumeForge-an-AI-powered-resume-builder"
  },
  {
    title: "StudyMind AI – AI Study Partner",
    subtitle: "Built a premium single-page AI study platform (Groq API, LLaMA 3.3-70B) featuring a conversational AI tutor, interactive flashcard forge with 3D flip animations, adaptive 5-question MCQ quizzes with live scoring, a one-click text summarizer, and a Chronos study planner that auto-generates hour-by-hour cramming timelines based on syllabus and days remaining.",
    icon: "📖",
    tags: ["Groq API / LLaMA 3.3", "3D Flashcards", "MCQ Quizzes", "Chronos Planner", "Single-Page"],
    backgroundImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80",
    boyImage: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
    link: "https://github.com/captainramen35-lgtm/StudyMind-AI-Platform"
  },
  {
    title: "CodeSensei – Serverless AI Assistant",
    subtitle: "Built a premium serverless AI coding assistant (Vanilla HTML/CSS/JS, Groq LLaMA 3.3-70B) with deep code review computing Big-O complexity and Cyclomatic scores, an LLM-simulated CLI code runner with STDIN support, an algorithm synthesizer for word problems, line-by-line code decryption into plain English, and multi-language support across 16 languages including Python, C++, Rust, and Go.",
    icon: "🔮",
    tags: ["Vanilla JS / CSS", "Groq LLaMA 3.3", "Code Review (Big-O)", "Simulated CLI", "Multi-Language"],
    backgroundImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    boyImage: "https://i.ibb.co/Y4FKvK38/20250831-113022.png",
    link: "https://github.com/Muskan6122005/CodeSensei"
  }
];

export const ProjectShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % PROJECTS_DATA.length);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length);
  };

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 9000);
    return () => clearInterval(timer);
  }, [handleNext]);

  // Responsive scaling of the 3D slide
  useEffect(() => {
    function adjustContentSize() {
      if (contentRef.current) {
        const viewportWidth = window.innerWidth;
        const baseWidth = 1140;
        const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.95 : 1;
        contentRef.current.style.transform = `scale(${scaleFactor})`;
      }
    }

    adjustContentSize();
    window.addEventListener("resize", adjustContentSize);
    return () => window.removeEventListener("resize", adjustContentSize);
  }, []);

  return (
    <section id="projects" className="reveal relative pt-[90px] pb-6 bg-black overflow-hidden">
      
      {/* Background ambient flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[300px] bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-6 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 relative">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
            Projects
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl text-sm md:text-base">
            A curated selection of intelligent systems, autonomous agents, and full-stack web platforms.
          </p>
        </div>
        <div className="text-sm font-mono text-orange-500/80 bg-orange-500/5 border border-orange-500/10 px-4 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
          <span>PROJECT_INDEX: 0{currentIndex + 1} / 0{PROJECTS_DATA.length}</span>
        </div>
      </div>

      {/* Carousel Showcase Viewport */}
      <div className="relative w-full h-[380px] md:h-[460px] flex items-center justify-center z-10 select-none overflow-hidden">
        
        {/* Navigation - Prev */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 z-30 bg-black/60 border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all duration-300"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* 3D Container viewport */}
        <div className="relative w-full max-w-[1100px] h-[380px] md:h-[460px] flex items-center justify-center">
          
          {/* Loop through all project elements to render positioning */}
          {PROJECTS_DATA.map((project, index) => {
            const offset = index - currentIndex;
            const total = PROJECTS_DATA.length;
            let pos = (offset + total) % total;
            
            // Normalize offsets to show adjacent items
            if (pos > Math.floor(total / 2)) {
              pos = pos - total;
            }

            const isCenter = pos === 0;
            const isAdjacent = Math.abs(pos) === 1;

            if (isCenter) {
              // Renders the 3D rotating text cube scenery
              return (
                <div
                  key={index}
                  ref={contentRef}
                  className="absolute w-[1100px] h-[380px] md:h-[460px] z-20 origin-center transition-all duration-700 ease-out flex items-center justify-center"
                >
                  <div className="hero-section-3d w-full h-full">
                    <div className="content-3d w-full h-full relative">
                      
                      {/* Hue Filter Layer */}
                      <div className="animated-hue-3d" />

                      {/* Tech Background Image */}
                      <img
                        className="backgroundImage-3d"
                        src={project.backgroundImage}
                        alt={project.title}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />

                      {/* Foreground Character Overlay */}
                      <img
                        className="boyImage-3d select-none pointer-events-none"
                        src={project.boyImage}
                        alt="Project Illustration Character"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />

                      {/* Glassmorphic Project Info Card inside the viewport */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-[92%] backdrop-blur-md bg-zinc-950/70 border border-orange-500/20 p-5 md:p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col items-center justify-center border-b border-orange-500/10 pb-2.5 mb-2.5 text-center">
                            <span className="text-3xl mb-1 animate-bounce">{project.icon}</span>
                            <h3 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wider font-display">
                              {project.title}
                            </h3>
                            <p className="text-[9px] font-mono text-orange-500/70 mt-0.5">STATUS: DEPLOYED_STABLE</p>
                          </div>
                          <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-sans text-center">
                            {project.subtitle}
                          </p>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                            {project.tags.slice(0, 5).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono bg-orange-500/5 text-orange-400 border border-orange-500/15 px-2.5 py-0.5 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {project.link && (
                            <div className="flex justify-center">
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(249,115,22,0.45)] hover:scale-105 transition-all duration-300"
                              >
                                <span>Explore Repository</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            }

            if (isAdjacent) {
              // Renders adjacent preview cards curved into background
              return (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="absolute cursor-pointer w-64 h-[380px] rounded-3xl overflow-hidden border border-orange-500/20 bg-zinc-950/90 shadow-2xl transition-all duration-700 ease-in-out z-10 flex flex-col justify-between p-6 hover:border-orange-500/50 group"
                  style={{
                    transform: `
                      translateX(${(pos) * 115}%) 
                      scale(0.75)
                      rotateY(${(pos) * -20}deg)
                    `,
                    opacity: 0.35,
                    filter: 'blur(3px)',
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-4xl">{project.icon}</span>
                    <span className="text-xs font-mono text-zinc-500">PRJ_0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight uppercase group-hover:text-orange-400 transition-colors duration-300">
                      {project.title.split(',')[0]}
                    </h3>
                    <p className="text-zinc-500 text-xs line-clamp-3">
                      {project.subtitle}
                    </p>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500/30 w-full" />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Navigation - Next */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 z-30 bg-black/60 border-orange-500/30 text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all duration-300"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Centered page-fitting dashed border line at the bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-4 relative z-10">
        <div className="border-b border-dashed border-zinc-800 w-full" />
      </div>
    </section>
  );
};
