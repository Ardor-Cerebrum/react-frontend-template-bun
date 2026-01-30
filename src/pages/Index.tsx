import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal, Code, Cpu, Zap, ExternalLink } from "lucide-react";

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-25 pointer-events-none" />;
};

const TypingText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Slower typing for dramatic effect
    return () => clearInterval(interval);
  }, [started, text]);

  return <span className={`font-mono ${className}`}>{displayedText}<span className="animate-pulse">_</span></span>;
};

const StatusItem = ({ label, delay }: { label: string; delay: number }) => {
  const [status, setStatus] = useState("WAITING");

  useEffect(() => {
    const timeout = setTimeout(() => setStatus("RUNNING"), delay);
    const timeout2 = setTimeout(() => setStatus("OK"), delay + 800);
    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, [delay]);

  return (
    <div className="flex items-center justify-between font-mono text-sm py-1 border-b border-green-900/30 last:border-0">
      <span className="text-green-400/80">{label}</span>
      <span className={`${status === "OK" ? "text-green-400" : status === "RUNNING" ? "text-yellow-400 animate-pulse" : "text-gray-600"}`}>
        [{status}]
      </span>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden selection:bg-green-500/30 selection:text-white">
      <MatrixBackground />
      
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-24 relative z-10">
        
        <div className="flex flex-col items-center justify-center text-center space-y-6 mb-16">
          <div className="inline-block border border-green-500/50 bg-black/80 backdrop-blur-sm px-4 py-2 rounded mb-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-xs tracking-widest uppercase">System Online</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase">
            <TypingText text="Ardor Environment" delay={200} />
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-green-400/70">
            Development protocols initiated. Access granted to local system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <Card className="bg-black/80 border-green-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,0,0.1)]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-green-500/30 bg-green-900/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-green-500">BOOT_SEQUENCE.EXE</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="p-4 space-y-2 h-[260px] overflow-y-auto font-mono text-xs md:text-sm">
              <StatusItem label="Initializing React Core..." delay={500} />
              <StatusItem label="Loading Tailwind Engine..." delay={1500} />
              <StatusItem label="Connecting to Shadcn UI..." delay={2500} />
              <StatusItem label="Mounting Virtual DOM..." delay={3500} />
              <StatusItem label="Checking File Permissions..." delay={4500} />
              <StatusItem label="Starting Development Server..." delay={5500} />
              
              <div className="mt-4 pt-4 border-t border-green-500/30 text-center animate-pulse">
                <span className="text-green-400 font-bold">{">"} READY FOR INPUT</span>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
             <Card className="bg-black/40 border-green-500/20 hover:border-green-400 transition-all duration-300 group cursor-pointer relative overflow-hidden" onClick={() => {}}>
                <div className="absolute inset-0 bg-green-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-500/20 p-2 rounded">
                      <Code className="w-6 h-6 text-green-400" />
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-50 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-500 group-hover:text-green-300 transition-colors">Start Coding</h3>
                  <p className="text-green-400/60 text-sm mb-4">
                    Target file located at:
                  </p>
                  <code className="bg-green-900/20 border border-green-500/30 px-3 py-1 rounded text-sm block w-fit text-green-400">
                    src/pages/Index.tsx
                  </code>
                </div>
             </Card>

             <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 bg-black/40 border-green-500/20 hover:bg-green-500/10 hover:border-green-400 text-green-400 flex flex-col items-center gap-2 group"
                  onClick={() => window.open('https://ui.shadcn.com', '_blank')}
                >
                  <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">COMPONENTS</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 bg-black/40 border-green-500/20 hover:bg-green-500/10 hover:border-green-400 text-green-400 flex flex-col items-center gap-2 group"
                  onClick={() => window.open('https://react.dev', '_blank')}
                >
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">DOCS</span>
                </Button>
             </div>
          </div>
        </div>

        <div className="mt-20 text-center text-xs text-green-500/30">
          SYSTEM_ID: ARDOR_CLOUD_V2.0 // SECURE_CONNECTION_ESTABLISHED
        </div>

      </div>
    </div>
  );
};

export default Index;
