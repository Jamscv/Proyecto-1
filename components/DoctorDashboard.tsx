
import React, { useState, useEffect } from 'react';
import { Theme, Profile, Appointment, ClinicSchedule } from '../types';
import { Check, Calendar, Clock, Loader2, User, X, AlertCircle, Save, CalendarOff, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DoctorDashboardProps {
  theme: Theme;
  profile: Profile;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ theme, profile }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedule, setSchedule] = useState<ClinicSchedule[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [scheduleTime, setScheduleTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isManagingSchedule, setIsManagingSchedule] = useState(false);
  const isDark = theme === Theme.DARK;

  const fetchData = async () => {
    try {
      const { data: apps, error: appsError } = await supabase
        .from('appointments')
        .select(`*, patient:profiles(*)`)
        .order('created_at', { ascending: false });
      if (appsError) throw appsError;
      if (apps) setAppointments(apps as Appointment[]);

      const { data: sched, error: schedError } = await supabase
        .from('clinic_schedule')
        .select('*')
        .order('id', { ascending: true });
      if (schedError) throw schedError;
      if (sched) setSchedule(sched as ClinicSchedule[]);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (appId: string) => {
    if (!scheduleTime) return;
    setLoading(true);
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'accepted', scheduled_at: scheduleTime })
      .eq('id', appId);
    if (!error) {
      setSelectedApp(null);
      setScheduleTime('');
      fetchData();
    }
    setLoading(false);
  };

  const handleCancel = async (appId: string) => {
    if (!confirm("¿Seguro que deseas cancelar esta cita?")) return;
    setLoading(true);
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appId);
    if (!error) fetchData();
    setLoading(false);
  };

  const updateScheduleItem = async (idx: number, updates: Partial<ClinicSchedule>) => {
    const newSchedule = [...schedule];
    newSchedule[idx] = { ...newSchedule[idx], ...updates };
    setSchedule(newSchedule);
    
    // Save to DB
    const item = newSchedule[idx];
    await supabase.from('clinic_schedule').upsert({
      id: (idx + 1), // Assuming ID 1-7 for Mon-Sun
      day: item.day,
      open: item.open,
      close: item.close,
      is_closed: item.is_closed
    });
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
              Dr. Salvadó
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Gestión Administrativa y Médica</p>
          </div>
          <button 
            onClick={() => setIsManagingSchedule(!isManagingSchedule)}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
          >
            <Settings className="w-5 h-5" />
            <span>{isManagingSchedule ? 'Ver Citas' : 'Ajustar Horarios'}</span>
          </button>
        </div>

        {isManagingSchedule ? (
          <div className={`p-10 rounded-[3rem] border animate-in fade-in slide-in-from-top-4 ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
            <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-black'}`}>Gestión de Horarios Semanales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {schedule.map((item, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border ${isDark ? 'bg-black/50 border-white/5' : 'bg-gray-50 border-gray-200'} ${item.is_closed ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>{item.day}</span>
                    <button 
                      onClick={() => updateScheduleItem(idx, { is_closed: !item.is_closed })}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${item.is_closed ? 'bg-red-500 text-white' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                    >
                      {item.is_closed ? 'CERRADO' : 'ABIERTO'}
                    </button>
                  </div>
                  {!item.is_closed && (
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Apertura</label>
                        <input type="time" value={item.open} onChange={e => updateScheduleItem(idx, { open: e.target.value })} className={`w-full p-2 rounded-lg bg-transparent border ${isDark ? 'border-white/10 text-white' : 'border-gray-200 text-black'}`} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Cierre</label>
                        <input type="time" value={item.close} onChange={e => updateScheduleItem(idx, { close: e.target.value })} className={`w-full p-2 rounded-lg bg-transparent border ${isDark ? 'border-white/10 text-white' : 'border-gray-200 text-black'}`} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             {appointments.length === 0 ? (
               <p className="text-center text-gray-500 py-20 italic">No hay solicitudes de citas en este momento.</p>
             ) : appointments.map(app => (
               <div key={app.id} className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                     <div className="flex items-start space-x-6">
                        <div className={`p-5 rounded-2xl bg-blue-500/10 text-blue-500 flex-shrink-0`}>
                           <User className="w-8 h-8" />
                        </div>
                        <div>
                           <div className="flex items-center space-x-3 mb-2">
                             <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>
                               {app.patient?.first_name} {app.patient?.last_name}
                             </p>
                             <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${app.status === 'accepted' ? 'bg-green-500/20 text-green-500' : app.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                               {app.status}
                             </span>
                           </div>
                           <p className={`text-lg font-bold text-blue-500 mb-1`}>{app.title}</p>
                           <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} italic`}>"{app.description}"</p>
                           
                           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                               <p className="text-[10px] uppercase font-bold text-red-500 mb-1">Alergias</p>
                               <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{app.allergies || 'Ninguna reportada'}</p>
                             </div>
                             <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                               <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">Pago</p>
                               <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{app.payment_method}</p>
                             </div>
                           </div>
                        </div>
                     </div>

                     <div className="w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-4 border-t lg:border-t-0 pt-6 lg:pt-0">
                        {app.status === 'pending' ? (
                          <div className="flex flex-col gap-3">
                             <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <input 
                                  type="datetime-local" 
                                  value={selectedApp === app.id ? scheduleTime : ''}
                                  onChange={e => {
                                    setSelectedApp(app.id);
                                    setScheduleTime(e.target.value);
                                  }}
                                  className={`px-4 py-3 rounded-xl border outline-none text-sm ${isDark ? 'bg-black border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                                />
                             </div>
                             <div className="flex gap-2">
                               <button 
                                 onClick={() => handleAccept(app.id)}
                                 disabled={loading || selectedApp !== app.id || !scheduleTime}
                                 className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-green-700 disabled:opacity-50"
                               >
                                 {loading && selectedApp === app.id ? <Loader2 className="animate-spin" /> : <Check className="w-4 h-4" />}
                                 <span>Aceptar</span>
                               </button>
                               <button 
                                 onClick={() => handleCancel(app.id)}
                                 className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                               >
                                 <X className="w-5 h-5" />
                               </button>
                             </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center space-x-3 text-green-500 font-bold bg-green-500/10 px-6 py-3 rounded-xl">
                               <Calendar className="w-5 h-5" />
                               <span>Confirmada: {new Date(app.scheduled_at!).toLocaleString()}</span>
                            </div>
                            <button onClick={() => handleCancel(app.id)} className="text-xs text-red-500 hover:underline font-bold">Cancelar Cita</button>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
