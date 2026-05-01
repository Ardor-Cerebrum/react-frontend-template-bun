import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, Aperture, Users, Image as ImageIcon } from 'lucide-react';

const FilmCanisterSVG = () => (
  <svg viewBox="-5 -10 110 160" className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#222" />
        <stop offset="15%" stopColor="#888" />
        <stop offset="35%" stopColor="#f5f5f5" />
        <stop offset="60%" stopColor="#888" />
        <stop offset="85%" stopColor="#ddd" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>
      <linearGradient id="metal-dark" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#111" />
        <stop offset="35%" stopColor="#444" />
        <stop offset="85%" stopColor="#222" />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>
      <linearGradient id="yellow-body" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8a5a00" />
        <stop offset="15%" stopColor="#eab308" />
        <stop offset="30%" stopColor="#fef08a" />
        <stop offset="65%" stopColor="#ca8a04" />
        <stop offset="85%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#5a3a00" />
      </linearGradient>
      <linearGradient id="slit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#000" />
        <stop offset="60%" stopColor="#222" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>
    </defs>

    <path d="M 40 -8 L 60 -8 L 62 0 L 38 0 Z" fill="url(#metal-dark)" />
    <rect x="38" y="0" width="24" height="2" fill="#000" />

    <rect x="10" y="12" width="86" height="116" fill="url(#yellow-body)" />
    
    <g transform="translate(68, 25)">
      <rect x="0" y="0" width="28" height="90" fill="#111" />
      <rect x="0" y="5" width="28" height="6" fill="#ddd" />
      <rect x="0" y="15" width="28" height="4" fill="#ddd" />
      <rect x="0" y="23" width="28" height="12" fill="#ddd" />
      <rect x="0" y="45" width="28" height="4" fill="#ddd" />
      <rect x="0" y="55" width="28" height="20" fill="#ddd" />
      <rect x="0" y="80" width="28" height="5" fill="#ddd" />
    </g>

    <text x="-115" y="42" transform="rotate(-90)" fontFamily="monospace" fontWeight="900" fontSize="24" fill="#000" letterSpacing="1">SNG-ALG</text>
    <text x="-115" y="55" transform="rotate(-90)" fontFamily="sans-serif" fontWeight="bold" fontSize="10" fill="#222">400 / 36 EXP</text>
    <circle cx="28" cy="80" r="4" fill="#000" />
    <text x="36" y="83" fontFamily="sans-serif" fontWeight="900" fontSize="9" fill="#000">C-41</text>

    <rect x="6" y="0" width="94" height="12" rx="2" fill="url(#metal)" />
    <rect x="6" y="12" width="94" height="2" fill="rgba(0,0,0,0.5)" />
    {[...Array(20)].map((_, i) => (
      <line key={`tr-${i}`} x1={8 + i * 4.6} y1="1" x2={8 + i * 4.6} y2="11" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    ))}

    <rect x="6" y="128" width="94" height="12" rx="2" fill="url(#metal)" />
    <rect x="6" y="126" width="94" height="2" fill="rgba(0,0,0,0.4)" />
    {[...Array(20)].map((_, i) => (
      <line key={`br-${i}`} x1={8 + i * 4.6} y1="129" x2={8 + i * 4.6} y2="139" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    ))}

    <g transform="translate(0, 0)">
      <path d="M 12 20 L 0 24 L 0 116 L 12 120 Z" fill="url(#slit-grad)" />
      <rect x="-2" y="24" width="4" height="92" fill="#000" rx="1" />
      <rect x="2" y="24" width="1" height="92" fill="rgba(255,255,255,0.1)" />
    </g>

    <path d="M 15 12 L 25 12 L 25 128 L 15 128 Z" fill="rgba(255,255,255,0.1)" pointerEvents="none" />
  </svg>
);

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timer, setTimer] = useState(432);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 432));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans overflow-x-hidden selection:bg-red-900 selection:text-white relative">
      <div 
        className="fixed inset-0 opacity-[0.15] pointer-events-none z-50 mix-blend-overlay"
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
      />

      <div 
        className="fixed inset-0 pointer-events-none z-40 mix-blend-screen transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(220, 38, 38, 0.12), transparent 70%)`
        }}
      />

      <div className="fixed top-8 right-8 z-50 flex items-center h-32">
        <div 
          className={`absolute right-[78px] h-[72px] w-[450px] bg-gradient-to-b from-[#2a2a2a] via-[#111] to-[#2a2a2a] shadow-[-20px_10px_30px_rgba(0,0,0,0.8)] origin-right transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] flex flex-col justify-center border-y border-l border-[#444] rounded-l-[1px] z-10 ${
            isMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          }`}
        >
          <div className="absolute top-1 left-0 right-0 h-2 flex flex-row justify-around px-2 items-center pointer-events-none">
            {[...Array(20)].map((_, i) => <div key={`T${i}`} className="w-[10px] h-[6px] bg-[#050505] rounded-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,1)]" />)}
          </div>
          
          <div className="absolute bottom-1 left-0 right-0 h-2 flex flex-row justify-around px-2 items-center pointer-events-none">
            {[...Array(20)].map((_, i) => <div key={`B${i}`} className="w-[10px] h-[6px] bg-[#050505] rounded-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,1)]" />)}
          </div>

          <div className="w-full flex flex-row px-4 py-[14px] relative z-10 h-full items-center">
            {['EXPOSE', 'DEVELOP', 'FIXER', 'GALLERY'].map((item, index) => (
              <div key={item} className="relative group/item flex-1 cursor-pointer border-r border-[#333] last:border-0 h-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 border border-transparent group-hover/item:border-red-600/30 transition-colors bg-black/20 group-hover/item:bg-red-900/10" />
                <span className="text-[11px] font-mono font-bold tracking-[0.15em] text-gray-300 group-hover/item:text-red-400 transition-colors relative z-10">
                  {item}
                </span>
                <span className="absolute bottom-0 left-1 text-[7px] text-yellow-600 font-mono opacity-80">
                  {index + 1}A
                </span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="relative w-24 h-32 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 z-20 group"
          aria-label="Toggle Menu"
        >
          <div className="absolute inset-0 group-hover:brightness-110 transition-all duration-300">
            <FilmCanisterSVG />
          </div>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-32">
          
          <div className="w-full lg:w-1/2 space-y-8 relative">
            <div className="absolute -left-12 -top-12 w-24 h-24 border-l border-t border-red-900/30" />
            <div className="absolute -left-12 -bottom-12 w-24 h-24 border-l border-b border-red-900/30" />
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-600 leading-none">
              SING<br/>ANALOG.
            </h1>
            <p className="text-xl text-gray-400 font-mono leading-relaxed border-l-2 border-red-800 pl-6">
              A community for analog photographers in Singapore. <br />
              <span className="text-red-500">Shoot film. Develop ideas. Fix memories.</span>
            </p>
            <div className="flex items-center gap-6">
              <button className="bg-red-700 hover:bg-red-600 text-white px-8 py-3 rounded-sm font-mono tracking-widest text-sm uppercase transition-colors shadow-[0_0_15px_rgba(185,28,28,0.4)]">
                Join the Darkroom
              </button>
              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <MapPin size={14} className="text-red-700" /> SG / 1.3521° N, 103.8198° E
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto bg-[#e4e2dd] p-4 shadow-[0_20px_60px_rgba(0,0,0,1)] rotate-2 hover:rotate-0 transition-all duration-700 group cursor-crosshair">
              <div className="relative w-full h-full bg-[#d0cdc5] overflow-hidden rounded-[2px] shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1617396900799-f4c28d72cdbe?auto=format&fit=crop&q=80&w=1200" 
                  alt="Undeveloped"
                  className="w-full h-full object-cover contrast-50 grayscale brightness-[1.3] sepia-[.2]" 
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518182170546-076616fdcdfa?auto=format&fit=crop&q=80&w=1200"; }}
                />
                <img 
                  src="https://images.unsplash.com/photo-1617396900799-f4c28d72cdbe?auto=format&fit=crop&q=80&w=1200" 
                  alt="Developed"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[4000ms] ease-in-out" 
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = "https://images.unsplash.com/photo-1518182170546-076616fdcdfa?auto=format&fit=crop&q=80&w=1200"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2a1b1b]/30 to-transparent -translate-y-full group-hover:translate-y-[200%] transition-transform duration-[4000ms] ease-linear pointer-events-none mix-blend-multiply" />
              </div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 rotate-90 origin-left text-black/30 font-mono text-xs tracking-widest font-bold">
                ILFORD MULTIGRADE IV RC
              </div>
              <div className="absolute -bottom-10 left-0 right-0 text-center opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                <span className="bg-[#111] text-red-500 text-xs font-mono px-3 py-1 rounded-sm border border-red-900/50 shadow-lg">
                  HOVER TO DEVELOP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent my-24" />

        <section className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <Aperture size={20} className="animate-[spin_10s_linear_infinite]" />
              <span className="font-mono text-sm tracking-[0.3em]">EXPOSURE SCHEDULE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Stop Bath & Fixer.</h2>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              Join us for our monthly photowalks around Singapore's heritage districts, followed by a communal developing session in our shared darkroom space at Bras Basah.
            </p>
            <div className="space-y-4 pt-6">
              {[
                { title: 'Chinatown Night Walk (Cinestill 800T)', date: 'Oct 24, 19:00', type: 'SHOOT' },
                { title: 'B&W Intro: Loading & Developing', date: 'Nov 02, 14:00', type: 'WORKSHOP' },
              ].map((event, i) => (
                <div key={i} className="group flex items-start gap-4 p-4 border border-gray-800 hover:border-red-900/50 bg-[#0a0a0a] transition-colors cursor-pointer shadow-lg">
                  <div className="text-red-700 mt-1"><Calendar size={18} /></div>
                  <div>
                    <h3 className="text-gray-200 font-bold group-hover:text-red-400 transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-gray-500">
                      <span>{event.date}</span>
                      <span className="w-1 h-1 bg-gray-700 rounded-full" />
                      <span className="text-yellow-600/70">{event.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="bg-[#1a1a1a] border-y-2 border-t-[#333] border-b-[#0a0a0a] rounded-xl p-8 max-w-md w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <div className="absolute top-4 left-6 flex gap-2 opacity-50">
                {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-6 bg-black rounded-full shadow-inner" />)}
              </div>
              <div className="text-center mb-6 mt-4">
                <span className="text-gray-500 font-mono text-[10px] tracking-widest font-bold uppercase">Enlarger Timer Module</span>
              </div>
              <div className="bg-[#050000] border-4 border-[#0a0a0a] rounded p-6 flex justify-center items-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] mb-8">
                 <span className="font-mono text-6xl text-red-600 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.9)] tabular-nums">
                   {formatTime(timer)}
                 </span>
              </div>
              <div className="flex justify-between items-end px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-16 bg-gradient-to-b from-[#222] to-[#111] rounded shadow-lg border border-[#333] relative flex justify-center items-center cursor-pointer">
                    <div className="w-6 h-8 bg-gradient-to-b from-gray-700 to-gray-900 shadow-[0_5px_10px_rgba(0,0,0,0.5)] border-b-2 border-gray-950 rounded-sm -translate-y-2"></div>
                  </div>
                  <span className="text-gray-600 font-mono text-[9px] uppercase font-bold">Focus</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#2a2a2a] to-[#111] rounded-full flex justify-center items-center shadow-[0_5px_15px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] border-2 border-black cursor-pointer active:scale-95 transition-transform">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-800 to-red-950 shadow-inner flex justify-center items-center">
                      <div className="w-12 h-12 rounded-full border border-red-900/50" />
                    </div>
                  </div>
                  <span className="text-gray-600 font-mono text-[9px] uppercase font-bold">Expose</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#333] to-[#111] border-2 border-black shadow-lg relative cursor-pointer">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/80 rounded-full" />
                    <div className="absolute inset-2 rounded-full border border-gray-700/50" />
                  </div>
                  <span className="text-gray-600 font-mono text-[9px] uppercase font-bold">x0.1 / x1</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-900 bg-[#020202] py-8 text-center relative z-10">
        <p className="font-mono text-xs text-gray-600 tracking-widest">
          © {new Date().getFullYear()} SINGANALOG. DEVELOPED IN SINGAPORE.
        </p>
      </footer>
    </div>
  );
}
