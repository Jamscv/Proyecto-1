
import React from 'react';
import { Theme } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactProps {
  theme: Theme;
}

const Contact: React.FC<ContactProps> = ({ theme }) => {
  const isDark = theme === Theme.DARK;

  return (
    <div className={`py-32 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-5xl md:text-7xl font-black mb-8 tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
            Hablemos de tu Salud.
          </h2>
          <p className={`mb-20 text-xl md:text-2xl font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Estamos aquí para resolver cualquier duda. Agenda tu primera consulta gratuita hoy mismo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center group">
              <div className="p-5 rounded-full bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform"><Phone className="w-8 h-8" /></div>
              <p className={`text-xs uppercase font-black tracking-[0.2em] mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Teléfono</p>
              <a href="tel:+34900123456" className={`text-xl font-bold hover:text-blue-500 transition-colors ${isDark ? 'text-white' : 'text-black'}`}>+34 900 123 456</a>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="p-5 rounded-full bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform"><Mail className="w-8 h-8" /></div>
              <p className={`text-xs uppercase font-black tracking-[0.2em] mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
              <a href="mailto:hola@clinicasalvado.com" className={`text-xl font-bold hover:text-blue-500 transition-colors ${isDark ? 'text-white' : 'text-black'}`}>hola@clinicasalvado.com</a>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="p-5 rounded-full bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform"><MapPin className="w-8 h-8" /></div>
              <p className={`text-xs uppercase font-black tracking-[0.2em] mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Ubicación</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Calle Principal 123, Barcelona</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
