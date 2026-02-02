import React, { useState } from 'react';
import { Theme } from '../types';
// Import AlertCircle to fix missing component error
import { ArrowLeft, User, Mail, Lock, Phone, Calendar as CalIcon, Loader2, Sparkles, CheckCircle2, SendHorizontal, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  theme: Theme;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ theme, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: ''
  });

  const isDark = theme === Theme.DARK;

  const validateText = (text: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$/.test(text);
  const validateNumber = (text: string) => /^[0-9]*$/.test(text);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'firstName' || field === 'lastName') {
      if (!validateText(value)) return;
    }
    if (field === 'phone') {
      if (!validateNumber(value)) return;
    }
    setFormData({ ...formData, [field]: value });
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (signInError) throw signInError;
      } else {
        if (formData.password !== formData.confirmPassword) throw new Error('Las contraseñas no coinciden');
        if (calculateAge(formData.dob) < 18) throw new Error('Debes ser mayor de 18 años para registrarte');

        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;
        
        if (user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            role: 'patient' 
          });
          
          if (profileError) {
             console.error("Error insertando perfil:", profileError);
             throw new Error("No se pudo crear el perfil correctamente.");
          }
          
          setIsEmailSent(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "Error inesperado");
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className={`min-h-screen pt-24 pb-12 flex items-center justify-center overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse"></div>
        </div>
        
        <div className={`relative z-10 w-full max-w-2xl mx-6 p-12 lg:p-20 rounded-[4rem] border shadow-2xl text-center animate-in zoom-in-95 fade-in duration-700 ${isDark ? 'bg-neutral-900/40 border-white/10 backdrop-blur-3xl' : 'bg-white/80 border-gray-100 backdrop-blur-3xl'}`}>
          <div className="mb-12 inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-600/10 text-blue-500 relative">
            <SendHorizontal size={48} className="animate-bounce" />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 size={24} />
            </div>
          </div>
          
          <h2 className={`text-5xl lg:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-600 ${isDark ? 'text-white' : 'text-black'}`}>
            Confirm your signup
          </h2>
          
          <div className="space-y-6 max-w-md mx-auto">
            <p className={`text-xl font-medium opacity-60 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Hemos enviado un email de verificación a <span className="text-blue-500 font-black">{formData.email}</span>.
            </p>
            
            <div className={`p-8 rounded-[2.5rem] border text-left space-y-4 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50/50 border-gray-100 shadow-inner'}`}>
               <p className={`text-xs font-black uppercase tracking-[0.3em] opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>
                 Follow this link to confirm your user:
               </p>
               <div className="flex items-center gap-4">
                 <div className="p-3 rounded-full bg-blue-600">
                    <ExternalLink size={16} className="text-white" />
                 </div>
                 <button className="text-blue-500 text-lg font-black hover:underline underline-offset-4 decoration-2">
                   Confirm your mail
                 </button>
               </div>
            </div>
            
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest pt-8">
              ¿No recibiste el correo? <button onClick={() => setIsEmailSent(false)} className="text-blue-500 hover:text-blue-400 underline ml-2">Inténtalo de nuevo</button>
            </p>
          </div>
          
          <button 
            onClick={onBack}
            className="mt-12 px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-xs transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/40"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-12 flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-6xl mx-6 grid grid-cols-1 lg:grid-cols-2 rounded-[3rem] overflow-hidden shadow-2xl ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
        
        {/* Lado Izquierdo: Branding */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-blue-600 text-white relative overflow-hidden group">
          <button onClick={onBack} className="absolute top-8 left-8 flex items-center space-x-2 hover:opacity-80 transition-opacity z-10">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Volver</span>
          </button>
          
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/20 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors duration-1000"></div>
          
          <h2 className="text-7xl font-black tracking-tighter mb-6 leading-[0.9] relative z-10">
            PRECISIÓN <br /> <span className="text-blue-200 italic font-serif">DENTAL.</span>
          </h2>
          <p className="text-xl text-blue-100 font-medium max-w-sm relative z-10 opacity-80">
            Accede a la tecnología de vanguardia del Dr. Salvadó. Gestiona tu salud con un solo clic.
          </p>
          
          <div className="mt-12 flex items-center gap-4 relative z-10">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-500 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Patient" />
                 </div>
               ))}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">+500 pacientes confían en nosotros</p>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="p-12 lg:p-20 relative">
          <div className="flex justify-between items-center mb-16">
             <div>
               <h3 className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                 {isLogin ? 'Welcome' : 'Join Us'}
               </h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mt-2">Clínica Dental Salvadó</p>
             </div>
             <button 
               onClick={() => { setIsLogin(!isLogin); setError(null); }}
               className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors py-2 px-4 rounded-full bg-blue-600/5"
             >
               {isLogin ? 'Sign Up' : 'Log In'}
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>First Name</label>
                  <input type="text" required value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} placeholder="Doe" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="email" required value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} placeholder="name@example.com" />
              </div>
            </div>

            {!isLogin && (
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Phone</label>
                    <input type="text" required value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} placeholder="600000000" />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Birth Date</label>
                    <input type="date" required value={formData.dob} onChange={e => handleInputChange('dob', e.target.value)} className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} />
                  </div>
               </div>
            )}

            <div className={`space-y-2 ${!isLogin ? "grid grid-cols-2 gap-6 space-y-0" : ""}`}>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="password" required value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} placeholder="••••••••" />
                </div>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Verify</label>
                  <input type="password" required value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${isDark ? 'bg-black border-white/10 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-500 shadow-sm'}`} placeholder="••••••••" />
                </div>
              )}
            </div>

            {error && (
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-in slide-in-from-top-2">
                <span className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 shadow-2xl shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Sparkles size={16} />
                  <span>{isLogin ? 'Iniciar Sesión' : 'Crear mi Cuenta'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
