
import React, { useState, useEffect } from 'react';
import { Theme, Profile, Appointment, ClinicSchedule } from '../types';
import { Plus, Calendar, Clock, CheckCircle, Loader2, CalendarCheck, X, AlertCircle, Timer, Zap, ShieldAlert, Hourglass } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PatientDashboardProps {
  theme: Theme;
  profile: Profile;
}

const PROCEDIMIENTOS = [
  "Consulta General",
  "Limpieza Profunda",
  "Extracción Dental",
  "Blanqueamiento",
  "Tratamiento de Caries",
  "Ortodoncia (Ajuste)",
  "Urgencia Dental"
];

const Countdown: React.FC<{ targetDate: string, isDark: boolean }> = ({ targetDate, isDark }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-xl">Cita en curso o finalizada</span>;

  return (
    <div className="flex items-center gap-2">
      {[
        { label: 'd', value: timeLeft.days },
        { label: 'h', value: timeLeft.hours },
        { label: 'm', value: timeLeft.minutes },
        { label: 's', value: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-blue-100 shadow-sm'}`}>
          <span className={`text-lg font-black tabular-nums ${isDark ? 'text-white' : 'text-blue-600'}`}>
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-[7px] font-black opacity-30 uppercase tracking-tighter">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const PatientDashboard: React.FC<PatientDashboardProps> = ({ theme, profile }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ClinicSchedule[]>([]);
  
  const [formData, setFormData] = useState({
    title: PROCEDIMIENTOS[0],
    description: '',
    allergies: '',
    payment_method: 'Efectivo' as 'Efectivo' | 'Banco' | 'Occidente'
  });

  const isDark = theme === Theme.DARK;

  const fetchData = async () => {
    try {
      const { data: apps } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });
      if (apps) setAppointments(apps as Appointment[]);

      const { data: sched } = await supabase.from('clinic_schedule').select('*').order('id', { ascending: true });
      if (sched) setSchedule(sched as ClinicSchedule[]);
    } catch (err) {
      console.error("Error al refrescar datos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile.id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('appointments').insert({
        patient_id: profile.id,
        title: formData.title,
        description: formData.description || "Sin descripción",
        reason: formData.description || "Sin motivo especificado", 
        allergies: formData.allergies || "Ninguna",
        payment_method: formData.payment_method,
        status: 'pending'
      });

      if (insertError) throw insertError;

      setIsBooking(false);
      setFormData({ title: PROCEDIMIENTOS[0], description: '', allergies: '', payment_method: 'Efectivo' });
      await fetchData();
    } catch (err: any) {
      console.error("Error al agendar:", err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-40 pb-20 transition-all duration-1000 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
           <div className="animate-in slide-in-from-left-10 duration-1000">
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Dashboard de Paciente</span>
              <h1 className={`text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                Hola, <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">{profile.first_name}</span>
              </h1>
              <p className={`text-lg font-medium opacity-50 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bienvenido a tu portal de salud dental avanzada.</p>
           </div>
           <button 
             onClick={() => setIsBooking(true)}
             className="group px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center space-x-4 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/40"
           >
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
             <span>Nueva Cita</span>
           </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Horarios Estilo Premium */}
          <div className="space-y-8">
            <h2 className={`text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              <Clock className="w-4 h-4" />
              <span>Horarios de la Clínica</span>
            </h2>
            <div className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
              <div className="space-y-6">
                {schedule.map((s, idx) => (
                  <div key={idx} className={`flex justify-between items-center pb-4 border-b last:border-0 last:pb-0 ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                    <span className="text-xs font-bold opacity-70 uppercase tracking-widest">{s.day}</span>
                    <span className={`text-[10px] font-black tabular-nums py-1 px-3 rounded-full ${s.is_closed ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {s.is_closed ? 'CERRADO' : `${s.open.slice(0,5)} — ${s.close.slice(0,5)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Listado de Citas - ALTO NIVEL */}
          <div className="lg:col-span-2 space-y-8">
             <h2 className={`text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                <Zap className="w-4 h-4" />
                <span>Mis Tratamientos</span>
             </h2>
             {appointments.length === 0 ? (
               <div className={`p-32 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center space-y-4 ${isDark ? 'border-white/5 text-gray-700' : 'border-gray-100 text-gray-300'}`}>
                  <Hourglass className="w-12 h-12 opacity-20" />
                  <p className="font-bold uppercase tracking-[0.3em] text-[10px]">No hay citas registradas</p>
               </div>
             ) : (
               appointments.map(app => (
                 <div key={app.id} className={`p-10 rounded-[3rem] border transition-all transform hover:scale-[1.02] ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100 shadow-2xl shadow-gray-100/50'} ${app.status === 'accepted' ? 'border-blue-500/30 ring-4 ring-blue-500/5' : ''}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                       <div className="flex items-center gap-8">
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${app.status === 'accepted' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-blue-500/10 text-blue-500'}`}>
                             {app.status === 'accepted' ? <CalendarCheck size={36} /> : <Clock size={36} />}
                          </div>
                          <div>
                             <h3 className={`text-3xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-black'}`}>{app.title}</h3>
                             <p className="text-sm opacity-50 mb-4 line-clamp-1">{app.description}</p>
                             
                             <div className="flex flex-wrap gap-2">
                               {app.status === 'accepted' && app.scheduled_at && (
                                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-600/10">
                                   <Calendar size={12} />
                                   <span>{new Date(app.scheduled_at).toLocaleDateString()} — {new Date(app.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                 </div>
                               )}
                               {app.allergies && app.allergies !== 'Ninguna' && (
                                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-500/10">
                                   <ShieldAlert size={12} />
                                   <span>Condición Médica</span>
                                 </div>
                               )}
                             </div>
                          </div>
                       </div>
                       
                       {app.status === 'accepted' && app.scheduled_at ? (
                         <div className={`p-6 rounded-[2rem] flex flex-col items-center justify-center min-w-[180px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-blue-50 shadow-inner'}`}>
                           <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${isDark ? 'text-white/40' : 'text-blue-500/60'}`}>Inicia en</p>
                           <Countdown targetDate={app.scheduled_at} isDark={isDark} />
                         </div>
                       ) : (
                         <div className="flex flex-col items-end gap-2">
                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${app.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}>
                               {app.status === 'pending' ? 'Bajo Revisión' : 'Cancelada'}
                            </span>
                            <span className="text-[9px] font-bold opacity-20 uppercase tracking-widest">Id: {app.id.slice(0,8)}</span>
                         </div>
                       )}
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>

      {/* Modal Nueva Cita - REFINADO */}
      {isBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className={`w-full max-w-2xl rounded-[3.5rem] p-12 border shadow-2xl overflow-y-auto max-h-[90vh] ${isDark ? 'bg-neutral-900 border-white/10 text-white' : 'bg-white border-gray-100 text-black'}`}>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-2">Reserva Técnica</h2>
                <p className="text-sm opacity-40 font-bold uppercase tracking-widest">Clínica Dental Salvadó</p>
              </div>
              <button onClick={() => setIsBooking(false)} className="p-4 rounded-full bg-black/5 hover:bg-black/10 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleBook} className="space-y-8">
              {error && (
                <div className="p-5 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                  <AlertCircle size={20}/> <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 ml-4 italic">Tratamiento</label>
                  <select 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className={`w-full p-5 rounded-[1.5rem] border outline-none font-bold appearance-none bg-no-repeat bg-right transition-all ${isDark ? 'bg-black border-white/10' : 'bg-gray-50 border-gray-100 focus:border-blue-500'}`}
                  >
                    {PROCEDIMIENTOS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 ml-4 italic">Modalidad de Pago</label>
                  <select 
                    value={formData.payment_method} 
                    onChange={e => setFormData({...formData, payment_method: e.target.value as any})}
                    className={`w-full p-5 rounded-[1.5rem] border outline-none font-bold appearance-none transition-all ${isDark ? 'bg-black border-white/10' : 'bg-gray-50 border-gray-100 focus:border-blue-500'}`}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Banco">Transferencia Bancaria</option>
                    <option value="Occidente">Financiación Occidente</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-[0.3em] text-red-500 ml-4 flex items-center gap-2 italic">
                  <ShieldAlert size={14} />
                  <span>Información Médica Crítica</span>
                </label>
                <input 
                  type="text"
                  value={formData.allergies} 
                  onChange={e => setFormData({...formData, allergies: e.target.value})}
                  className={`w-full p-5 rounded-[1.5rem] border outline-none font-bold transition-all ${isDark ? 'bg-black border-white/10 text-red-400 placeholder:text-red-900/40' : 'bg-red-50/20 border-red-100 text-red-600'}`}
                  placeholder="¿Alergias o patologías? (Ej: Látex, Penicilina)"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-500 ml-4 italic">Motivo de la Intervención</label>
                <textarea 
                  required
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className={`w-full p-6 rounded-[2rem] border h-32 resize-none outline-none font-medium transition-all ${isDark ? 'bg-black border-white/10 text-white placeholder:text-gray-700' : 'bg-gray-50 border-gray-100 focus:border-blue-500'}`}
                  placeholder="Explique brevemente su necesidad médica..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs transition-all active:scale-95 flex items-center justify-center shadow-2xl shadow-blue-600/30"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Solicitar Intervención"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
