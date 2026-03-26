import { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PresentationViewer({ presentation }: { presentation: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = presentation.slides;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const slide = slides[currentSlide];

  if (!slide) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen bg-gray-950 text-white font-sans overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <main className="relative z-10 flex-1 w-full max-w-6xl flex flex-col items-center justify-center p-8">
        <div key={`header-${slide.id}`} className="flex flex-col items-center mb-10 animate-in slide-in-from-top-4 fade-in duration-500">
          {slide.icon}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 text-center">
            {slide.title}
          </h1>
          <h2 className="text-lg md:text-xl text-blue-400 font-medium tracking-wide text-center uppercase tracking-widest">
            {slide.subtitle}
          </h2>
        </div>

        <div key={`content-${slide.id}`} className="w-full flex-1 flex items-center justify-center animate-in zoom-in-95 fade-in duration-500 delay-100 fill-mode-both">
          {slide.content}
        </div>
      </main>

      <footer className="relative z-20 w-full px-6 py-4 flex justify-between items-center bg-gray-950/80 backdrop-blur-xl border-t border-gray-800/80">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-gray-700 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="hidden sm:inline">Назад</span>
        </button>

        <div className="flex space-x-2.5">
          {slides.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? 'bg-blue-500 w-8 shadow-[0_0_10px_rgba(59,130,246,0.6)]' 
                  : 'bg-gray-700 hover:bg-gray-500 w-2.5'
              }`}
              aria-label={`Перейти к слайду ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          <span className="hidden sm:inline">Далее</span>
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </footer>
    </div>
  );
}
