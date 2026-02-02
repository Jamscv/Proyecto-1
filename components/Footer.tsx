
import React from 'react';
import { Theme } from '../types';

interface FooterProps {
  theme: Theme;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === Theme.DARK;

  return (
    <footer className={`py-12 border-t ${isDark ? 'bg-black border-white/5' : 'bg-white border-gray-100'}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <span className={`text-xl font-bold tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
              Clínica Dental <span className="text-blue-500">Salvadó</span>
            </span>
            <p className={`text-[10px] mt-1 font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              © 2024 Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex space-x-6 text-[10px] font-black uppercase tracking-[0.2em]">
            <a href="#" className={`${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}>Privacidad</a>
            <a href="#" className={`${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}>Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
