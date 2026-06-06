import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  id: string;
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems: NavItem[] = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about-me', id: 'about-me' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Journey', href: '#experience', id: 'experience' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // trigger when section is scroll-aligned
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetEl = document.getElementById(id);
    if (targetEl) {
      const offset = 80; // height offset for fixed navbar clearing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetEl.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // Fallback to set hash
      window.history.pushState(null, '', `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
      <nav 
        className={`
          relative w-full max-w-4xl backdrop-blur-xl border rounded-full transition-all duration-500 ease-in-out
          ${isOpen 
            ? 'rounded-[28px] px-6 py-5 bg-zinc-950/90 border-orange-500/30 shadow-[0_15px_40px_rgba(249,115,22,0.15)]' 
            : 'px-6 py-2.5 bg-zinc-950/75 border-orange-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(249,115,22,0.05)]'
          }
          hover:border-orange-500/25
        `}
      >
        {/* Main Bar Wrapper */}
        <div className="flex items-center justify-between">
          
          {/* Logo / Branding */}
          <a 
            href="#home" 
            onClick={(e) => handleScroll(e, 'home')}
            className="flex items-center gap-2 group cursor-none"
          >
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316] group-hover:scale-125 transition-transform duration-300" />
            <span className="font-display font-extrabold tracking-[0.15em] text-white text-sm uppercase select-none">
              MUSKAN<span className="text-orange-500">.</span>ALI
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.id)}
                  className={`
                    relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-none
                    ${isActive 
                      ? 'text-black bg-gradient-to-r from-orange-500 to-yellow-500 font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10 cursor-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Expanded Navigation Panel */}
        <div 
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? 'max-h-[350px] opacity-100 mt-5 pt-4 border-t border-orange-500/10' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.id)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-none
                    ${isActive 
                      ? 'text-orange-500 bg-orange-500/10 border-l-2 border-orange-500 pl-3' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]" />}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
