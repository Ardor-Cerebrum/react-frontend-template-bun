import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, Code, Cpu, Zap } from "lucide-react";

// --- Components ---

const RetroSun = () => (
  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-yellow-300 via-orange-500 to-rose-600 shadow-[0_0_80px_rgba(255,0,128,0.5)] z-0">
    {/* Sun Stripes */}
    <div className="absolute inset-0 w-full h-full flex flex-col justify-end gap-1 pb-4 opacity-100 mask-image-linear-gradient">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="w-full bg-black/40" style={{ height: `${i * 0.8 + 2}px` }} />
      ))}
    </div>
  </div>
);

const MovingGrid = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none perspective-1000">
    <div className="absolute bottom-0 w-full h-[50%] bg-[#1a0b2e] z-10" 
         style={{ transform: "rotateX(60deg) scale(2)", transformOrigin: "bottom" }}>
      <div className="w-full h-full animate-grid-flow"
           style={{
             backgroundImage: "linear-gradient(to right, rgba(255, 0, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 0, 255, 0.4) 1px, transparent 1px)",
             backgroundSize: "40px 40px",
             boxShadow: "0 0 100px rgba(255, 0, 255, 0.5) inset"
           }} 
      />
    </div>
    <div className="absolute top-0 w-full h-[50%] bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] -z-20" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent z-10" />
  </div>
);

const PixelCar = () => (
  <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-20 animate-bounce-custom">
    {/* Simple SVG Pixel Car representation */}
    <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]">
      {/* Body */}
      <rect x="40" y="50" width="120" height="30" fill="#00ffff" />
      <rect x="50" y="30" width="100" height="20" fill="#00bfff" />
      {/* Windows */}
      <rect x="60" y="35" width="80" height="15" fill="#1a0b2e" />
      {/* Lights */}
      <rect x="150" y="55" width="5" height="10" fill="#ff00ff" className="animate-pulse" />
      <rect x="45" y="55" width="5" height="10" fill="#ff00ff" className="animate-pulse" />
      {/* Wheels */}
      <rect x="50" y="75" width="20" height="10" fill="#111" />
      <rect x="130" y="75" width="20" height="10" fill="#111" />
      {/* Reflection */}
      <rect x="60" y="60" width="80" height="2" fill="rgba(255,255,255,0.5)" />
    </svg>
    {/* Exhaust */}
    <div className="absolute bottom-2 left-10 w-2 h-2 bg-pink-500 blur-sm animate-exhaust" />
    <div className="absolute bottom-2 right-10 w-2 h-2 bg-pink-500 blur-sm animate-exhaust-delay" />
  </div>
);

const CitySkyline = () => (
  <div className="absolute bottom-[50%] left-0 w-full h-32 z-0 flex items-end justify-center gap-1 opacity-80">
     {[...Array(40)].map((_, i) => {
       const height = Math.random() * 80 + 20;
       const width = Math.random() * 30 + 10;
       return (
         <div key={i} className="bg-[#050510] relative group" style={{ height: `${height}px`, width: `${width}px` }}>
            {/* Windows */}
            {Math.random() > 0.5 && (
              <div className="absolute top-2 left-1 w-[2px] h-[2px] bg-purple-500 animate-pulse" style={{ animationDelay: `${Math.random()}s` }} />
            )}
         </div>
       );
     })}
  </div>
);

const Index = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .font-pixel {
          font-family: 'Press Start 2P', cursive;
        }
        
        @keyframes grid-flow {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        .animate-grid-flow {
          animation: grid-flow 0.5s linear infinite;
        }

        @keyframes bounce-custom {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -3px); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 0.5s infinite ease-in-out;
        }

        @keyframes exhaust {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(2); }
        }
        .animate-exhaust {
          animation: exhaust 0.5s linear infinite;
        }
        .animate-exhaust-delay {
          animation: exhaust 0.5s linear infinite 0.25s;
        }
      `}</style>

      <div className="min-h-screen bg-[#1a0b2e] text-white font-pixel relative overflow-hidden flex flex-col items-center">
        
        <MovingGrid />
        <RetroSun />
        <CitySkyline />
        <PixelCar />

        {/* Content Overlay */}
        <div className="relative z-30 container mx-auto px-4 py-10 flex flex-col items-center justify-between h-screen pb-32">
          
          {/* Header */}
          <div className="text-center space-y-4 mt-8">
            <h1 className="text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-600 drop-shadow-[4px_4px_0_rgba(255,0,255,1)] tracking-widest leading-relaxed py-2">
              ARDOR DRIVE
            </h1>
            <p className="text-pink-500 text-[10px] md:text-xs animate-pulse tracking-widest">
              SYSTEM INITIALIZED // READY PLAYER ONE
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            
            <Card className="bg-black/60 border-2 border-cyan-500/50 backdrop-blur-md hover:border-cyan-400 hover:bg-black/80 transition-all group relative overflow-hidden rounded-none">
              <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <Terminal className="w-8 h-8 text-cyan-400 mb-2" />
                <h2 className="text-cyan-400 text-sm">DEV CONSOLE</h2>
                <div className="text-[10px] text-gray-300 leading-6 space-y-1 w-full text-left bg-black/50 p-3 border border-cyan-500/30">
                  <div className="flex justify-between"><span>REACT_CORE</span> <span className="text-green-400">OK</span></div>
                  <div className="flex justify-between"><span>TAILWIND</span> <span className="text-green-400">OK</span></div>
                  <div className="flex justify-between"><span>SHADCN_UI</span> <span className="text-green-400">OK</span></div>
                  <div className="flex justify-between"><span>DEV_PORT</span> <span className="text-yellow-400">1337</span></div>
                </div>
              </div>
            </Card>

            <Card className="bg-black/60 border-2 border-pink-500/50 backdrop-blur-md hover:border-pink-400 hover:bg-black/80 transition-all group relative overflow-hidden rounded-none cursor-pointer"
                  onClick={() => window.open('https://ui.shadcn.com', '_blank')}>
              <div className="absolute inset-0 bg-pink-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <Cpu className="w-8 h-8 text-pink-400 mb-2" />
                <h2 className="text-pink-400 text-sm">COMPONENTS</h2>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  ACCESS THE SHADCN COMPONENT LIBRARY TO UPGRADE YOUR VEHICLE.
                </p>
                <div className="mt-2 text-[10px] bg-pink-500 text-black px-2 py-1 animate-pulse">
                  CLICK TO OPEN
                </div>
              </div>
            </Card>

          </div>

          {/* Footer / Instructions */}
          <div className="bg-black/80 border border-purple-500/50 px-6 py-4 rounded-none backdrop-blur shadow-[0_0_20px_rgba(168,85,247,0.4)] text-center mb-12">
            <p className="text-[10px] md:text-xs text-purple-300 mb-2">
              MISSION OBJECTIVE:
            </p>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono bg-purple-900/30 px-3 py-1 border border-purple-500/30">
              <Code className="w-3 h-3 text-purple-400" />
              <span>EDIT <span className="text-white">src/pages/Index.tsx</span> TO START</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Index;
