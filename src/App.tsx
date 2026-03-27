import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Zap, HardDrive, CircleDot, ArrowRight, CheckCircle2, ExternalLink, Database, Cpu, Layers, TrendingDown, Sparkles, Scale, AlertTriangle, Lightbulb } from 'lucide-react';

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
        
        <div className="mt-6 flex gap-4 items-start bg-rose-500/10 p-4 rounded-xl border border-rose-500/30">
          <AlertTriangle className="text-rose-400 shrink-0 mt-1" />
          <p className="text-sm md:text-base text-slate-300">
            Векторы в кэше состоят из тысяч чисел с плавающей запятой (FP16). Для длинных текстов этот кэш может весить <b>сотни гигабайт</b>, становясь главным "бутылочным горлышком" (bottleneck) при работе ИИ. Это физически ограничивает размер "памяти" нейросети!
          </p>
        </div>
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
          Индустрия использует квантование: мы берем "тяжелое" 16-битное число и сжимаем его до 4 бит. Но есть подвох: чтобы числа не потеряли свой масштаб (отличить 0.001 от 1000), для каждой группы чисел нужно хранить <b>дополнительные метаданные (константы масштаба)</b>.
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
          
          <div className="mt-6 flex gap-4 items-start bg-slate-900/80 p-4 rounded-xl border border-slate-700">
            <Scale className="text-amber-400 shrink-0 mt-1" />
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Аномальные выбросы (выбросы-аутлаеры) в одном измерении ломают всё сжатие — приходится подстраивать масштаб под них, теряя точность для всех остальных чисел. А сами метаданные (масштаб) съедают еще 1-2 бита на каждое число. В итоге вместо 4 бит мы тратим 5-6!
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto"></div>
    </div>
  );
};

const Step3 = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [rotation, setRotation] = useState(0);

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRotating) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRotating]);

  return (
    <div className="flex flex-col flex-1 animate-fade-in w-full max-w-5xl mx-auto">
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 flex items-center gap-3">
          <CircleDot className="text-emerald-400 shrink-0 w-6 h-6 md:w-8 md:h-8" /> Шаг 1: Случайное вращение (Размазывание)
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
          Чтобы избавиться от аномальных выбросов и необходимости хранить "масштаб", алгоритм делает гениальную вещь: он <b>случайно вращает весь вектор</b> в многомерном пространстве.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center justify-center flex-1 my-4">
        {/* Interactive Visualization */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-[300px] aspect-square bg-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0 flex items-center justify-center">
            
            <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible p-8">
              {/* Axes */}
              <line x1="-100" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="2" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="#334155" strokeWidth="2" />
              
              {/* Vector with outlier (long on X, short on Y) */}
              <g transform={`rotate(${rotation})`} className="transition-transform duration-75">
                {/* Outlier Vector */}
                <line x1="0" y1="0" x2="80" y2="10" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <circle cx="80" cy="10" r="4" fill="#ef4444" />
                
                {/* Normal Vector */}
                <line x1="0" y1="0" x2="-20" y2="-30" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
                <circle cx="-20" cy="-30" r="4" fill="#3b82f6" />
                
                {/* Projections (Dashed lines to axes) */}
                <g className="opacity-40" strokeDasharray="4 4">
                  {/* For outlier */}
                  <line x1="80" y1="10" x2={80 * Math.cos(rotation * Math.PI / 180) + 10 * Math.sin(rotation * Math.PI / 180)} y2="0" stroke="#ef4444" strokeWidth="2" />
                  <line x1="80" y1="10" x2="0" y2={-80 * Math.sin(rotation * Math.PI / 180) + 10 * Math.cos(rotation * Math.PI / 180)} stroke="#ef4444" strokeWidth="2" />
                </g>
              </g>
              
              {/* Projected Values on Axes (Dynamic based on rotation) */}
              <g>
                {/* X Axis Projection */}
                <circle cx={80 * Math.cos(rotation * Math.PI / 180) - 10 * Math.sin(rotation * Math.PI / 180)} cy="0" r="6" fill="#fca5a5" className="opacity-80" />
                {/* Y Axis Projection */}
                <circle cx="0" cy={80 * Math.sin(rotation * Math.PI / 180) + 10 * Math.cos(rotation * Math.PI / 180)} r="6" fill="#fca5a5" className="opacity-80" />
              </g>
            </svg>

            <button 
              onClick={toggleRotation}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all ${isRotating ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
            >
              {isRotating ? 'Остановить вращение' : 'Вращать вектор!'}
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4">
          <div className="bg-slate-800/80 p-5 md:p-6 rounded-2xl border-l-4 border-emerald-500 shadow-xl">
            <h3 className="text-emerald-400 font-bold text-lg mb-3 flex items-center gap-2"><Sparkles size={20} /> Магия математики</h3>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              При вращении аномально большое значение (красный вектор) <b>"размазывается" по всем остальным осям</b>. В многомерных пространствах (тысячи измерений) по <a href="https://ru.wikipedia.org/wiki/Закон_больших_чисел" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">закону больших чисел</a> это приводит к тому, что значения на каждой оси сходятся к <b>идеальному нормальному распределению (колоколу)</b>.
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 md:p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-slate-200 font-bold text-lg mb-3">Готовая сетка (K-means)</h3>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-4">
              Зная, что после вращения данные всегда принимают форму "колокола", мы можем заранее рассчитать идеальную сетку округления: плотнее в центре (где большинство чисел) и реже по краям. 
            </p>
            <div className="h-12 w-full bg-gradient-to-r from-slate-800 via-emerald-900/50 to-slate-800 rounded-lg relative overflow-hidden flex items-center border border-slate-700">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-emerald-500/80"></div>
              <div className="absolute inset-y-0 left-1/2 -translate-x-4 w-1 bg-emerald-500/60"></div>
              <div className="absolute inset-y-0 left-1/2 translate-x-3 w-1 bg-emerald-500/60"></div>
              <div className="absolute inset-y-0 left-1/2 -translate-x-10 w-1 bg-emerald-500/40"></div>
              <div className="absolute inset-y-0 left-1/2 translate-x-9 w-1 bg-emerald-500/40"></div>
              <div className="absolute inset-y-0 left-4 w-1 bg-emerald-500/20"></div>
              <div className="absolute inset-y-0 right-4 w-1 bg-emerald-500/20"></div>
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">Округление происходит на лету без хранения метаданных!</p>
          </div>
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
          <Zap className="text-amber-400 shrink-0 w-6 h-6 md:w-8 md:h-8" /> Шаг 2: Компенсация ошибки (QJL)
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
          Для механизма <b>Attention (Внимания)</b> в ИИ критически важно идеально точное скалярное произведение векторов. Сжатие на первом шаге вносит искажения — ИИ может начать галлюцинировать. Чтобы это исправить, вычисляется <b>остаток (разница)</b> между оригиналом и сжатой версией.
        </p>
      </div>

      <div className="bg-slate-900 p-5 md:p-8 rounded-2xl border border-slate-700 w-full shadow-2xl my-6">
        <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-slate-800 pb-4 md:pb-6">
          <h3 className="text-sm md:text-lg font-medium text-slate-200 leading-tight pr-4">Вектор-остаток: сохраняем только знак!</h3>
          <button 
            onClick={generateNew} 
            disabled={isAnimating}
            className="text-xs md:text-sm bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl transition-all shadow-lg font-medium shrink-0 flex items-center gap-2"
          >
            Новая ошибка
          </button>
        </div>

        {/* High precision row */}
        <div className="mb-6 md:mb-8 relative">
          <div className="text-xs md:text-sm tracking-widest text-slate-500 uppercase mb-3 md:mb-4 font-bold">Остаточная погрешность (дробная)</div>
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
          <div className="relative bg-slate-900 px-4 py-2 rounded-full border border-slate-700 text-amber-500 font-bold text-sm shadow-sm z-10 flex items-center gap-2">
            Случайная матрица <ArrowRight size={18} /> Знак (1 бит)
          </div>
        </div>

        {/* 1-bit row */}
        <div>
          <div className="flex gap-2 md:gap-4">
            {vector.map((val, i) => (
              <div key={i} className={`flex-1 rounded-xl py-3 md:py-5 text-center font-mono text-lg md:text-3xl font-black transform transition-all duration-500 shadow-lg border-2 ${val > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]'}`}>
                {val > 0 ? '+1' : '-1'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mt-2">
        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
          Этот крошечный остаток умножается на случайную матрицу, и от результата сохраняется <b>ТОЛЬКО ЗНАК (1 бит)</b>. Магия случайных проекций заключается в том, что даже сохраняя лишь знаки, мы с высочайшей точностью кодируем взаимные углы и расстояния между векторами (похоже на методы быстрого векторного поиска соседей). Это полностью компенсирует смещение!
        </p>
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
          Итог: Эффект и Рынок
        </h2>
        
        <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-4xl">
          Весь пайплайн TurboQuant <b>не требует переобучения (zero-shot)</b>, шикарно параллелится на видеокартах (GPU) и позволяет сжимать гигантские кэши в 4-6 раз без потери точности скалярных произведений!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-500/10 rounded-2xl mb-3 text-emerald-400"><HardDrive size={28} /></div>
          <h4 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest">KV-кэш</h4>
          <div className="text-4xl font-black text-slate-50 mb-1">~6<span className="text-2xl text-emerald-400">x</span></div>
          <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">Сжатие</span>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex flex-col items-center text-center">
          <div className="p-3 bg-amber-500/10 rounded-2xl mb-3 text-amber-400"><Zap size={28} /></div>
          <h4 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest">Вычисления</h4>
          <div className="text-4xl font-black text-slate-50 mb-1">8<span className="text-2xl text-amber-400">x</span></div>
          <span className="text-amber-400 text-xs font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">Ускорение</span>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex flex-col items-center text-center">
          <div className="p-3 bg-blue-500/10 rounded-2xl mb-3 text-blue-400"><CheckCircle2 size={28} /></div>
          <h4 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest">Loss</h4>
          <div className="text-4xl font-black text-slate-50 mb-1">0<span className="text-2xl text-blue-400">%</span></div>
          <span className="text-blue-400 text-xs font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">Потерь</span>
        </div>
        
        <div className="bg-rose-900/20 border border-rose-800/50 p-6 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="p-3 bg-rose-500/10 rounded-2xl mb-3 text-rose-400"><TrendingDown size={28} /></div>
          <h4 className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-widest">Акции Памяти</h4>
          <div className="text-4xl font-black text-rose-400 mb-1">-5<span className="text-2xl text-rose-500">%</span></div>
          <span className="text-rose-400 text-xs font-medium bg-rose-500/10 px-2 py-0.5 rounded-full">Падение</span>
          
          <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <p className="text-xs text-slate-300">Инвесторы запаниковали, думая, что ИИ больше не нужна память. Но алгоритму уже год, а память всё равно в дефиците!</p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg mt-auto relative overflow-hidden">
        <Lightbulb className="absolute -right-4 -top-4 text-slate-800 w-32 h-32 opacity-50" />
        <h3 className="text-xl font-bold text-slate-200 mb-3 relative z-10 flex items-center gap-2">
          Драма на фондовом рынке 📉
        </h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed relative z-10">
          Когда Google Research опубликовали этот пост в блоге и Twitter, акции производителей памяти (Samsung, Micron, SK Hynix) <b>мгновенно рухнули на 4-5%</b>. Инвесторы решили: "Всё, ИИ научился сжимать данные в 6 раз, память больше не нужна, продажи SSD и DRAM упадут!" <br/><br/>
          Ирония в том, что сама научная статья (пейпер) вышла еще в апреле 2025 года, и аналоги (например, DeepSeek MLA) существуют давно. Крупные игроки просто играют на ожиданиях толпы: продают на "страшной" новости, чтобы потом закупиться подешевле. Спрос на память для ИИ никуда не денется!
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "KV-Кэш", component: Step1 },
    { title: "Проблема масштаба", component: Step2 },
    { title: "Случайное вращение", component: Step3 },
    { title: "QJL и Знаки", component: Step4 },
    { title: "Итог и Рынок", component: Step5 }
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
      
      <div className="absolute inset-0 flex flex-col bg-[#0f172a] text-slate-50 font-sans overflow-hidden">
        
        <header className="shrink-0 flex items-center justify-between px-4 md:px-8 py-4 border-b border-slate-800 bg-slate-900 z-20 shadow-sm">
          <h1 className="text-lg md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent truncate pr-4">
            Алгоритм TurboQuant (Deep Dive)
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

        <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="min-h-full flex flex-col p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
            <CurrentComponent key={step} />
          </div>
        </main>

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
