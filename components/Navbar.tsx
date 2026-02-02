
import React, { useEffect, useState } from 'react';
import { Theme } from '../types';
import { Sun, Moon, Menu, X, User, LogOut } from 'lucide-react';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  onAuthClick: () => void;
  onLogoutClick: () => void;
  onLogoClick: () => void;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onAuthClick, onLogoutClick, onLogoClick, isLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setRevealed(true), 100); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = theme === Theme.DARK;
  const textColor = isDark ? 'text-white' : 'text-black';
  const bgColor = isDark ? 'bg-black/80' : 'bg-white/80';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${scrolled ? `${bgColor} backdrop-blur-2xl py-4 shadow-2xl` : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO SALIENDO DE LA ESQUINA (EFECTO CINE REFINADO) */}
        <div 
          onClick={onLogoClick}
          className="relative cursor-pointer py-2 px-4 group"
        >
          <div className={`text-2xl md:text-4xl font-black tracking-tighter transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] transform ${revealed ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full -translate-y-4 opacity-0 scale-90'} ${textColor}`}>
            Clínica <span className="text-blue-600 font-serif italic">Salvadó</span>
            {/* Elemento decorativo orbital */}
            <div className={`absolute -right-4 top-0 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-1000 ${revealed ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
          <div className={`h-[1px] bg-gradient-to-r from-blue-600 to-transparent transition-all duration-1000 delay-500 mt-1 ${revealed ? 'w-full' : 'w-0'}`}></div>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          {!isLoggedIn && (
            <div className="flex items-center space-x-8">
              <a href="#tratamientos" className={`text-[10px] font-black uppercase tracking-[0.4em] hover:text-blue-500 transition-all ${textColor} opacity-60 hover:opacity-100`}>Servicios</a>
              <a href="#contacto" className={`text-[10px] font-black uppercase tracking-[0.4em] hover:text-blue-500 transition-all ${textColor} opacity-60 hover:opacity-100`}>Contacto</a>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className={`p-3 rounded-full transition-all hover:rotate-45 ${isDark ? 'bg-white/5 text-yellow-400 border border-white/10' : 'bg-black/5 text-blue-600 border border-black/5'}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={isLoggedIn ? onLogoutClick : onAuthClick}
              className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isLoggedIn ? 'Cerrar' : 'Acceso'}
            </button>
          </div>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden ${textColor} p-2`}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Móvil Fullscreen */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-[-1] animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center space-y-12 p-12 backdrop-blur-3xl ${isDark ? 'bg-black/98' : 'bg-white/98'}`}>
          <div className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Menú Principal</div>
          <button onClick={() => { onLogoClick(); setMobileMenuOpen(false); }} className={`text-5xl font-black tracking-tighter ${textColor} hover:text-blue-600 transition-colors`}>Inicio</button>
          <a href="#tratamientos" onClick={() => setMobileMenuOpen(false)} className={`text-5xl font-black tracking-tighter ${textColor} hover:text-blue-600 transition-colors`}>Servicios</a>
          <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className={`text-5xl font-black tracking-tighter ${textColor} hover:text-blue-600 transition-colors`}>Contacto</a>
          <button 
            onClick={() => { isLoggedIn ? onLogoutClick() : onAuthClick(); setMobileMenuOpen(false); }} 
            className="w-full max-w-xs py-6 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/30"
          >
             {isLoggedIn ? 'Desconectar' : 'Iniciar Sesión'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
