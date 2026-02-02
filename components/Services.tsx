
import React, { useState, useEffect } from 'react';
import { Theme, Service } from '../types';
import { ShieldCheck, Zap, Smile, Heart, Star, Activity, X, Calendar } from 'lucide-react';

interface ServicesProps {
  theme: Theme;
  onBookClick: () => void;
}

const TREATMENTS: (Service & { details: string })[] = [
  { 
    id: '1', 
    title: 'Implantes Dentales', 
    description: 'Recupera tu sonrisa con la tecnología de carga inmediata más avanzada.', 
    details: 'Utilizamos titanio de alta pureza y escaneo 3D para una colocación precisa en una sola sesión.',
    icon: 'ShieldCheck' 
  },
  { 
    id: '2', 
    title: 'Ortodoncia Invisible', 
    description: 'Alinea tus dientes discretamente con alineadores transparentes.', 
    details: 'Planificación digital completa. Sin brackets, sin dolor y totalmente removible.',
    icon: 'Zap' 
  },
  { 
    id: '3', 
    title: 'Estética Dental', 
    description: 'Diseño de sonrisa personalizado con carillas de porcelana ultra delgadas.', 
    details: 'Mejoramos forma, color y posición de tus dientes con materiales estéticos premium.',
    icon: 'Smile' 
  },
];

const IconMap: Record<string, any> = { ShieldCheck, Zap, Smile, Heart, Star, Activity };

const Services: React.FC<ServicesProps> = ({ theme, onBookClick }) => {
  const isDark = theme === Theme.DARK;
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isFlipped) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TREATMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isFlipped]);

  const current = TREATMENTS[index];
  const Icon = IconMap[current.icon];

  return (
    <div className={`py-24 overflow-hidden ${isDark ? 'bg-neutral-950' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase ${isDark ? 'text-white' : 'text-black'}`}>Tratamientos</h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-2xl mx-auto perspective-1000">
          <div className="flex items-center justify-center min-h-[450px] relative">
            <div 
              className={`relative w-full h-[400px] transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className={`absolute inset-0 w-full h-full p-12 rounded-[3rem] border backface-hidden flex flex-col items-start justify-center transition-all ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-100 shadow-2xl'}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="p-5 rounded-3xl bg-blue-500/10 text-blue-500 mb-8 inline-block"><Icon className="w-12 h-12" /></div>
                <h3 className={`text-3xl md:text-4xl font-black mb-6 ${isDark ? 'text-white' : 'text-black'}`}>{current.title}</h3>
                <p className={`text-lg md:text-xl leading-relaxed mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{current.description}</p>
                <button 
                  onClick={() => setIsFlipped(true)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-blue-700 transition-colors"
                >
                  Solicitar Cita
                </button>
              </div>

              <div 
                className={`absolute inset-0 w-full h-full p-12 rounded-[3rem] border backface-hidden rotate-y-180 flex flex-col items-start justify-center transition-all ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-blue-50 border-blue-100'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <button onClick={() => setIsFlipped(false)} className={`absolute top-8 right-8 p-2 ${isDark ? 'text-white' : 'text-black'}`}><X /></button>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Detalles del Tratamiento</h3>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{current.details}</p>
                <button 
                  onClick={onBookClick}
                  className="flex items-center justify-center space-x-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:brightness-110"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Agendar Ahora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
