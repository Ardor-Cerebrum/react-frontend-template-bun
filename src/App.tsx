import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Zap, HardDrive, CircleDot, ArrowRight, CheckCircle2, ExternalLink, Database, Cpu, Layers } from 'lucide-react';

const Step1 = () => {
  const [memory, setMemory] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setMemory(prev => (prev >= 95 ? 10 : prev + 5));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="mb-auto">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <Database className="text-blue-400 shrink-0 w-6 h-6 md:w-8 md:h-8" /> Проблема: Прожорливый KV-кэш
        </h2>
        <p className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed">
          Современные ИИ (LLM) генерируют текст слово за словом. Чтобы не перечитывать весь предыдущий текст заново, они сохраняют промежуточные состояния в так называемый <b>KV-кэш (Key-Value cache)</b>. Но чем длиннее контекст (например, целая книга), тем быстрее переполняется память!
        </p>
      </div>
      
      <div className="bg-slate-800/50 p-5 md:p-8 rounded-2xl border border-slate-700 shadow-xl my-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm md:text-lg font-medium text-slate-200 flex items-center gap-2">
            <Cpu size={20} className="text-slate-400"/> Память видеокарты (VRAM)
          </h3>
          <span className="text-xs md:text-sm font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-700">Рост контекста →</span>
        </div>
        
        <div className="relative w-full h-16 md:h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-rose-500 to-rose-600 transition-all duration-300 ease-linear flex items-center justify-end px-4"
            style={{ width: `${memory}%` }}
          >
            {memory > 80 && <span className="text-white text-xs md:text-sm font-bold animate-pulse whitespace-nowrap shadow-sm drop-shadow-md">OOM Error! (Нехватка памяти)</span>}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 flex">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-slate-700/50 h-full"></div>
            ))}
          </div>
        </div>
        
        <p className="text-sm md:text-base text-slate-400 mt-6 border-l-2 border-rose-500/50 pl-4">
          Векторы в кэше состоят из тысяч чисел с плавающей запятой (FP16). Для длинных текстов этот кэш может весить <b>сотни гигабайт</b>, становясь главным "бутылочным горлышком" (bottleneck) при работе ИИ.
        </p>
      </div>
      
      <div className="mt-auto"></div>
    </div>
  );
};

const Step2 = () => {
  return (
    <div className="flex flex-col flex-1 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="mb-auto">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <Layers className="text-rose-400 shrink-0 w-6 h-6 md:w-8 md:h-8" /> Иллюзия обычного сжатия
        </h2>
        <p className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed">
          Классическое решение — квантование. Мы берем "тяжелое" 16-битное число и сжимаем его до 4 бит. Но есть подвох: чтобы числа не потеряли свой масштаб (отличить 0.001 от 1000), для каждой группы чисел нужно хранить <b>дополнительные метаданные (константы масштаба)</b>.
        </p>
      </div>

      <div className="space-y-6 my-6">
        {/* FP16 */}
        <div className="bg-slate-800/40 p-5 md:p-6 rounded-2xl border border-slate-700/50 shadow-lg">
          <div className="flex justify-between mb-3 text-sm md:text-base">
            <span className="text-slate-300 font-medium">Оригинал (16 бит / FP16)</span>
            <span className="text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded">100% объема</span>
          </div>
          <div className="flex gap-1.5 h-8 md:h-12 w-full">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="flex-1 bg-rose-500/60 rounded-sm md:rounded shadow-[0_0_8px_rgba(244,63,94,0.2)]"></div>
            ))}
          </div>
        </div>

        {/* Quantized */}
        <div className="bg-slate-800/40 p-5 md:p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex justify-between mb-3 text-sm md:text-base">
            <span className="text-slate-300 font-medium">Обычное сжатие (INT4 + Scale)</span>
            <span className="text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">Вредный Overhead</span>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            <div className="flex gap-1.5 h-8 md:h-12 w-1/4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 bg-blue-500/80 rounded-sm md:rounded shadow-[0_0_8px_rgba(59,130,246,0.2)]"></div>
              ))}
            </div>
            <span className="text-slate-500 font-black text-xl">+</span>
            {/* Overhead block */}
            <div className="flex-1 max-w-[120px] h-8 md:h-12 bg-amber-500/80 rounded-sm md:rounded relative group flex items-center justify-center text-xs md:text-sm font-bold text-amber-950 shadow-[0_0_12px_rgba(245,158,11,0.4)] overflow-hidden">
              <span className="relative z-10 truncate px-2">Метаданные</span>
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]"></div>
            </div>
          </div>
          <p className="text-sm md:text-base text-slate-300 mt-6 leading-relaxed bg-slate-900/60 p-4 md:p-5 rounded-xl border border-slate-700/80 shadow-inner">
            Эти метаданные съедают до 1-2 дополнительных бит на каждое число! В итоге вместо желаемых 3-4 бит мы получаем 5-6. И здесь на сцену выходит <b>PolarQuant</b>.
          </p>
        </div>
      </div>
      
      <div className="mt-auto"></div>
    </div>
  );
};

const Step3 = () => {
  const [mode, setMode] = useState('cartesian'); 
  const [point, setPoint] = useState({ x: 60, y: 40 });
  const svgRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!svgRef.current || e.buttons !== 1) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200 - 100;
    const y = -(((e.clientY - rect.top) / rect.height) * 200 - 100); 
    setPoint({ 
      x: Math.max(-90, Math.min(90, x)), 
      y: Math.max(-90, Math.min(90, y)) 
    });
  };

  const r = Math.sqrt(point.x**2 + point.y**2);
  const theta = (Math.atan2(point.y, point.x) * 180 / Math.PI + 360) % 360;

  return (
    <div className="flex flex-col flex-1 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 flex items-center gap-3">
          <CircleDot className="text-emerald-400 shrink-0 w-6 h-6 md:w-8 md:h-8" /> Шаг 1: PolarQuant
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
          Вместо классической сетки (X, Y), данные переводятся в <b>полярные координаты</b>: Радиус и Угол. Угол всегда заперт в рамках от 0° до 360° — мы заранее знаем его точные границы! Это позволяет нарезать данные на куски без сохранения дополнительных констант масштаба (Zero Overhead).
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center flex-1 my-4">
        {/* Interactive Graph */}
        <div className="w-full md:w-1/2 flex flex-col items-center max-w-sm">
          <div className="flex bg-slate-900 p-1.5 rounded-xl mb-6 border border-slate-700 shadow-inner w-full">
            <button onClick={() => setMode('cartesian')} className={`flex-1 px-4 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all ${mode === 'cartesian' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              Декартовы (X, Y)
            </button>
            <button onClick={() => setMode('polar')} className={`flex-1 px-4 py-2.5 rounded-lg text-sm md:text-base font-medium transition-all ${mode === 'polar' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              Полярные (R, θ)
            </button>
          </div>
          
          <div className="relative w-full aspect-square bg-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden cursor-crosshair shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0 group"
               style={{ touchAction: 'none' }}
               ref={svgRef}
               onPointerDown={handlePointerMove}
               onPointerMove={handlePointerMove}>
            <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible">
              <defs>
                <filter id="glowCartesian"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glowPolar"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>

              {/* Cartesian Grid */}
              {mode === 'cartesian' && (
                <g className="opacity-20 stroke-blue-500" strokeWidth="1.5">
                  {[...Array(11)].map((_, i) => (
                    <React.Fragment key={`c-${i}`}>
                      <line x1="-100" y1={-100 + i*20} x2="100" y2={-100 + i*20} />
                      <line x1={-100 + i*20} y1="-100" x2={-100 + i*20} y2="100" />
                    </React.Fragment>
                  ))}
                </g>
              )}
              {/* Polar Grid */}
              {mode === 'polar' && (
                <g className="opacity-20 stroke-emerald-500" strokeWidth="1.5" fill="none">
                  {[...Array(5)].map((_, i) => <circle key={`p-${i}`} cx="0" cy="0" r={(i+1)*20} />)}
                  {[...Array(12)].map((_, i) => <line key={`a-${i}`} x1="0" y1="0" x2={Math.cos(i*Math.PI/6)*100} y2={Math.sin(i*Math.PI/6)*100} />)}
                </g>
              )}
              
              {/* Axes */}
              <line x1="-100" y1="0" x2="100" y2="0" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="#475569" strokeWidth="2" />
              
              {/* Lines & Point */}
              {mode === 'cartesian' ? (
                <g filter="url(#glowCartesian)">
                  <line x1={point.x} y1="0" x2={point.x} y2={-point.y} stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4" />
                  <line x1="0" y1={-point.y} x2={point.x} y2={-point.y} stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4" />
                </g>
              ) : (
                <g filter="url(#glowPolar)">
                  <line x1="0" y1="0" x2={point.x} y2={-point.y} stroke="#10b981" strokeWidth="3" />
                  <path d={`M 25 0 A 25 25 0 ${theta > 180 ? 1 : 0} 0 ${Math.cos(theta*Math.PI/180)*25} ${-Math.sin(theta*Math.PI/180)*25}`} fill="none" stroke="#10b981" strokeWidth="3" />
                </g>
              )}
              <circle cx={point.x} cy={-point.y} r="6" fill={mode === 'cartesian' ? '#60a5fa' : '#34d399'} className="pointer-events-none shadow-lg transition-colors" />
            </svg>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Зажмите и тяните
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full min-h-[250px]">
          {mode === 'cartesian' ? (
            <div className="bg-slate-800/80 p-6 md:p-8 rounded-2xl border-l-4 border-blue-500 shadow-xl h-full flex flex-col justify-center animate-fade-in">
              <h3 className="text-blue-400 font-bold text-lg md:text-xl mb-4">Декартова система</h3>
              <div className="font-mono text-3xl md:text-4xl space-y-3 font-light mb-6">
                <div className="flex items-center gap-4"><span className="text-slate-500 w-8">X:</span> <span className="text-blue-300 font-medium">{point.x.toFixed(1)}</span></div>
                <div className="flex items-center gap-4"><span className="text-slate-500 w-8">Y:</span> <span className="text-blue-300 font-medium">{point.y.toFixed(1)}</span></div>
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Сетка может расширяться до бесконечности в любую сторону. Модели приходится каждый раз вычислять, <b>насколько велик масштаб</b> текущих чисел, и сохранять этот коэффициент отдельно.
              </p>
            </div>
          ) : (
            <div className="bg-slate-800/80 p-6 md:p-8 rounded-2xl border-l-4 border-emerald-500 shadow-xl h-full flex flex-col justify-center animate-fade-in">
              <h3 className="text-emerald-400 font-bold text-lg md:text-xl mb-4">Полярная система</h3>
              <div className="font-mono text-3xl md:text-4xl space-y-3 font-light mb-6">
                <div className="flex items-center gap-4"><span className="text-slate-500 w-8">R:</span> <span className="text-emerald-300 font-medium">{r.toFixed(1)}</span></div>
                <div className="flex items-center gap-4"><span className="text-slate-500 w-8">θ:</span> <span className="text-emerald-300 font-medium">{theta.toFixed(1)}°</span></div>
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Информация перетекает в угол θ, который <b>строго заперт в рамках 360°</b>. Масштаб фиксирован самой геометрией круга — дополнительные метаданные больше не нужны!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Step4 = () => {
  const [vector, setVector] = useState([0.73, -0.42, 0.15, -0.89, 0.55]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const generateNew = () => {
    setIsAnimating(true);
    setVector(Array.from({length: 5}, () => (Math.random() * 2 - 1)));
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex flex-col flex-1 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="mb-auto">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <Zap className="text-amber-400 shrink-0 w-6 h-6 md:w-8 md:h-8" /> Шаг 2: QJL (Магия одного бита)
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
          После грубого сжатия через PolarQuant остаётся крошечная математическая погрешность (ошибка). Алгоритм <b>QJL (Quantized Johnson-Lindenstrauss)</b> берёт этот остаток и сохраняет от него <b>только 1 бит — знак (+ или -)</b>. Математика доказывает, что в многомерных пространствах этот единственный бит превосходно сохраняет суть направления вектора!
        </p>
      </div>

      <div className="bg-slate-900 p-5 md:p-8 rounded-2xl border border-slate-700 w-full shadow-2xl my-6">
        <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-slate-800 pb-4 md:pb-6">
          <h3 className="text-sm md:text-lg font-medium text-slate-200 leading-tight pr-4">Трансформация ошибки: от дробей к знакам</h3>
          <button 
            onClick={generateNew} 
            disabled={isAnimating}
            className="text-xs md:text-sm bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl transition-all shadow-lg font-medium shrink-0 flex items-center gap-2"
          >
            Новый вектор
          </button>
        </div>

        {/* High precision row */}
        <div className="mb-6 md:mb-8 relative">
          <div className="text-xs md:text-sm tracking-widest text-slate-500 uppercase mb-3 md:mb-4 font-bold">Остаточная погрешность (FP16)</div>
          <div className="flex gap-2 md:gap-4">
            {vector.map((val, i) => (
              <div key={i} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 md:py-6 text-center font-mono text-sm md:text-lg shadow-inner relative overflow-hidden group">
                <div className={`absolute bottom-0 left-0 right-0 opacity-20 transition-all duration-500 ease-out ${val > 0 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ height: `${Math.max(15, Math.abs(val)*100)}%` }}></div>
                <span className={`relative z-10 font-medium transition-colors duration-300 ${val > 0 ? 'text-amber-300' : 'text-rose-300'}`}>{val > 0 ? '+' : ''}{val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-6 md:mb-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800 border-dashed"></div>
          </div>
          <div className="relative bg-slate-900 p-2 md:p-3 rounded-full border border-slate-700 text-slate-400 shadow-sm z-10">
            <ArrowRight className="rotate-90" size={24} />
          </div>
        </div>

        {/* 1-bit row */}
        <div>
          <div className="text-xs md:text-sm tracking-widest text-amber-500/80 uppercase mb-3 md:mb-4 font-bold flex items-center gap-2">
            <Zap size={16} className="shrink-0" /> 1-битный QJL фильтр
          </div>
          <div className="flex gap-2 md:gap-4">
            {vector.map((val, i) => (
              <div key={i} className={`flex-1 rounded-xl py-3 md:py-5 text-center font-mono text-lg md:text-3xl font-black transform transition-all duration-500 shadow-lg border-2 ${val > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]'}`}>
                {val > 0 ? '+1' : '-1'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto"></div>
    </div>
  );
};

const Step5 = () => {
  return (
    <div className="flex flex-col flex-1 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="mb-6 md:mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent inline-block">
          Итог: Эффект TurboQuant
        </h2>
        
        <p className="text-slate-300 text-base md:text-xl leading-relaxed max-w-4xl">
          Скрестив геометрическую элегантность <b>PolarQuant</b> и мощную статистику <b>QJL</b>, исследователи Google создали <b>TurboQuant</b>. Алгоритм упаковывает огромные объемы контекста в микроскопические размеры без переобучения моделей.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-auto">
        {/* Metric 1 */}
        <div className="bg-slate-800/40 border border-slate-700 p-6 md:p-8 rounded-3xl flex flex-col items-center text-center group transition-all duration-300 hover:bg-slate-800 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
          <div className="p-4 bg-emerald-500/10 rounded-2xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform"><HardDrive size={36} /></div>
          <h4 className="text-slate-400 text-xs md:text-sm font-bold mb-2 uppercase tracking-widest">Память KV-кэша</h4>
          <div className="text-5xl md:text-6xl font-black text-slate-50 mb-2">~6<span className="text-3xl md:text-4xl text-emerald-400">x</span></div>
          <span className="text-emerald-400 text-sm md:text-base font-medium bg-emerald-500/10 px-3 py-1 rounded-full">Компактнее</span>
          <p className="text-xs md:text-sm text-slate-500 mt-4 pt-4 border-t border-slate-700 w-full">Упаковано в 3 бита на число без метаданных</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-800/40 border border-slate-700 p-6 md:p-8 rounded-3xl flex flex-col items-center text-center group transition-all duration-300 hover:bg-slate-800 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(245,158,11,0.1)]">
          <div className="p-4 bg-amber-500/10 rounded-2xl mb-4 text-amber-400 group-hover:scale-110 transition-transform"><Zap size={36} /></div>
          <h4 className="text-slate-400 text-xs md:text-sm font-bold mb-2 uppercase tracking-widest">Ускорение</h4>
          <div className="text-5xl md:text-6xl font-black text-slate-50 mb-2">8<span className="text-3xl md:text-4xl text-amber-400">x</span></div>
          <span className="text-amber-400 text-sm md:text-base font-medium bg-amber-500/10 px-3 py-1 rounded-full">Быстрее вычисления</span>
          <p className="text-xs md:text-sm text-slate-500 mt-4 pt-4 border-t border-slate-700 w-full">В тестах на GPU NVIDIA H100</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-800/40 border border-slate-700 p-6 md:p-8 rounded-3xl flex flex-col items-center text-center group transition-all duration-300 hover:bg-slate-800 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)]">
          <div className="p-4 bg-blue-500/10 rounded-2xl mb-4 text-blue-400 group-hover:scale-110 transition-transform"><CheckCircle2 size={36} /></div>
          <h4 className="text-slate-400 text-xs md:text-sm font-bold mb-2 uppercase tracking-widest">Точность (Recall)</h4>
          <div className="text-5xl md:text-6xl font-black text-slate-50 mb-2">0<span className="text-3xl md:text-4xl text-blue-400">%</span></div>
          <span className="text-blue-400 text-sm md:text-base font-medium bg-blue-500/10 px-3 py-1 rounded-full">Потерь качества</span>
          <p className="text-xs md:text-sm text-slate-500 mt-4 pt-4 border-t border-slate-700 w-full">Zero-shot (без дообучения модели)</p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm md:text-base pb-4">
        Этот прорыв открывает дорогу к нейросетям, способным держать в голове миллионы страниц текста одновременно, и кардинально ускоряет векторный поиск по гигантским базам данных.
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Проблема KV-Кэша", component: Step1 },
    { title: "Накладные расходы", component: Step2 },
    { title: "PolarQuant", component: Step3 },
    { title: "QJL", component: Step4 },
    { title: "Результаты", component: Step5 }
  ];

  const CurrentComponent = steps[step].component;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 1); 
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 1); 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 1); 
        }
      `}</style>
      
      {/* Root Container: Stretches fully via absolute inset-0 */}
      <div className="absolute inset-0 flex flex-col bg-[#0f172a] text-slate-50 font-sans overflow-hidden">
        
        {/* Header: Fixed height, always stable */}
        <header className="shrink-0 flex items-center justify-between px-4 md:px-8 py-4 border-b border-slate-800 bg-slate-900 z-20 shadow-sm">
          <h1 className="text-lg md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent truncate pr-4">
            Алгоритм TurboQuant
          </h1>
          <a 
            href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-blue-400 transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 md:px-4 py-2 rounded-lg border border-slate-700 shadow-sm shrink-0"
            title="Оригинал статьи (Google Research)"
          >
            <span className="hidden sm:inline font-medium tracking-wide">Google Research</span>
            <ExternalLink size={16} />
          </a>
        </header>

        {/* Main Content Area: Flexible, scrollable, independent of header/footer */}
        <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="min-h-full flex flex-col p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
            <CurrentComponent key={step} />
          </div>
        </main>

        {/* Footer: Fixed height, stable controls */}
        <footer className="shrink-0 flex justify-between items-center px-4 md:px-8 py-5 md:py-6 border-t border-slate-800 bg-slate-900 z-20 min-h-[80px] md:min-h-[100px] shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
          
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-sm md:text-base font-medium transition-all shadow-sm min-w-[100px] md:min-w-[140px]"
          >
            <ChevronLeft size={20} /> <span className="hidden sm:inline">Назад</span>
          </button>
          
          <div className="flex flex-col items-center gap-2 md:gap-3 px-2">
            <div className="flex gap-2 md:gap-3 justify-center items-center">
              {steps.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setStep(i)}
                  className={`flex-shrink-0 h-2 md:h-2.5 rounded-full transition-all duration-300 relative group
                    ${i === step ? 'w-10 md:w-16 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : i < step ? 'w-4 md:w-6 bg-emerald-500/50 hover:bg-emerald-500' : 'w-4 md:w-6 bg-slate-700 hover:bg-slate-600'}`}
                  aria-label={s.title}
                >
                  {/* Tooltip on hover for dots */}
                  <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-30">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
            <span className="text-slate-400 text-xs md:text-sm font-medium tracking-wide text-center">
              <span className="text-slate-500 mr-2">{step + 1}/{steps.length}</span> {steps[step].title}
            </span>
          </div>
          
          <button 
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-xl text-sm md:text-base font-bold transition-all shadow-lg min-w-[100px] md:min-w-[140px]
              ${step === steps.length - 1 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)]'}`}
          >
            <span className="hidden sm:inline">Далее</span> <ChevronRight size={20} />
          </button>
        </footer>
      </div>
    </>
  );
}
