
import React from 'react';
import { Theme } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  theme: Theme;
  onBookClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ theme, onBookClick }) => {
  const isDark = theme === Theme.DARK;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background dinámico */}
      <div className={`absolute inset-0 z-0 opacity-30 pointer-events-none transition-colors duration-1000 ${isDark ? 'bg-[radial-gradient(circle_at_50%_50%,#1e3a8a_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]'}`}></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-12">
          <Sparkles size={14} className="animate-pulse" />
          Innovación Dental
        </div>
        
        <h1 className={`text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.9] perspective-text ${isDark ? 'text-white' : 'text-black'}`}>
          CREAMOS <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 animate-gradient-x bg-[length:200%_auto]">PERFECCIÓN.</span>
        </h1>
        
        <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-16 font-medium leading-relaxed opacity-60 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Odontología de alta precisión donde la estética se encuentra con la tecnología para diseñar tu mejor versión.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
          <button 
            onClick={onBookClick}
            className="group px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase tracking-widest text-xs flex items-center transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/40"
          >
            Reservar Consulta
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
          <a 
            href="#tratamientos" 
            className={`px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs border transition-all hover:bg-black/5 ${isDark ? 'border-white/10 hover:bg-white/10 text-white' : 'border-black/5 hover:bg-black/5 text-black'}`}
          >
            Ver Especialidades
          </a>
        </div>
      </div>

      {/* Orbes de luz */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
    </div>
  );
};

export default Hero;
