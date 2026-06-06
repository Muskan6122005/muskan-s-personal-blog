import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Mail, Phone, Linkedin, Instagram } from 'lucide-react';

interface ContactLink {
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  hoverColor: string;
}

interface ConnectWithMeProps {
  id?: string;
  className?: string;
  links?: ContactLink[];
}

export const ConnectWithMe: React.FC<ConnectWithMeProps> = ({ id, className, links = defaultLinks }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);

  const animation = {
    scale: clicked ? [1, 1.3, 1] : 1,
    transition: { duration: 0.3 },
  };

  React.useEffect(() => {
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, 200);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clicked]);

  return (
    <div id={id} className={`min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans w-full relative overflow-hidden ${className || ''}`}>
      
      {/* Background ambient flares */}
      <div className="absolute top-1/3 left-1/4 w-[50vw] h-[350px] bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-3xl mx-auto text-center mb-16 z-10">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 mb-6 font-display uppercase tracking-tight">
          Connect <span className="text-white">With Me</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Whether you're here to collaborate on a research idea, build something ambitious together, or just say hello — I'm always open. Drop a message and let's talk.
        </p>
      </div>

      <div className="relative w-full max-w-4xl z-10">
        <div
          className="rounded-3xl bg-zinc-950/80 border border-orange-500/10 shadow-2xl backdrop-blur-3xl overflow-hidden p-8 transition-all duration-500 hover:scale-105 hover:border-orange-500/20"
          style={{
            boxShadow: '0 0 50px rgba(249, 115, 22, 0.1), 0 0 80px rgba(245, 158, 11, 0.05)',
          }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            {links.map((link, index) => (
              <div
                key={index}
                className={`relative cursor-pointer transition-opacity duration-200 ${
                  hoveredLink && hoveredLink !== link.name ? 'opacity-50' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setClicked(true)}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-decoration-none cursor-none"
                >
                  <motion.div
                    className="flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-in-out relative overflow-hidden"
                    style={{
                      background: hoveredLink === link.name ? link.hoverColor : 'rgba(255, 255, 255, 0.03)',
                      boxShadow: hoveredLink === link.name 
                        ? `0 0 20px ${link.color}` 
                        : '0 8px 32px rgba(0, 0, 0, 0.4)',
                      backdropFilter: 'blur(4px)',
                      border: hoveredLink === link.name ? `1px solid ${link.color}` : '1px solid rgba(249, 115, 22, 0.1)',
                    }}
                    whileHover={{ scale: 1.1, y: -10 }}
                    animate={hoveredLink === link.name ? animation : {}}
                  >
                    <div className="text-white z-10">
                      {link.icon}
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {hoveredLink === link.name && (
                      <motion.span
                        className="mt-3 text-orange-400 font-bold text-sm tracking-wider uppercase font-mono"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultLinks: ContactLink[] = [
  {
    name: 'GitHub',
    icon: <Github size={32} />,
    href: 'https://github.com/captainramen35-lgtm',
    color: 'rgba(217, 119, 6, 0.4)',
    hoverColor: '#d97706',
  },
  {
    name: 'Email',
    icon: <Mail size={32} />,
    href: 'mailto:muskanyeshminali@gmail.com',
    color: 'rgba(234, 88, 12, 0.4)',
    hoverColor: '#ea580c',
  },
  {
    name: 'Phone',
    icon: <Phone size={32} />,
    href: 'tel:+918240457094',
    color: 'rgba(245, 158, 11, 0.4)',
    hoverColor: '#f59e0b',
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin size={32} />,
    href: 'https://www.linkedin.com/in/muskan-yeshmin-ali-448731333/',
    color: 'rgba(249, 115, 22, 0.4)',
    hoverColor: '#f97316',
  },
  {
    name: 'Instagram',
    icon: <Instagram size={32} />,
    href: 'https://www.instagram.com/captainramen612/',
    color: 'rgba(234, 179, 8, 0.4)',
    hoverColor: '#eab308',
  },
];
