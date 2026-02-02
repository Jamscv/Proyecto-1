
import React, { useState, useEffect, useCallback } from 'react';
import { Theme, Profile } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [view, setView] = useState<'home' | 'auth' | 'dashboard'>('home');
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Usamos maybeSingle para evitar el error PGRST116 si no hay fila
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;

      if (data) {
        setUserProfile(data as Profile);
        setView('dashboard');
      } else {
        // Si hay sesión de auth pero no perfil, limpiamos para evitar bucles
        console.warn("Sesión activa pero sin perfil en DB. Cerrando sesión...");
        await supabase.auth.signOut();
        setUserProfile(null);
        setView('auth');
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setUserProfile(null);
      setView('auth');
    }
  }, []);

  const handleLogout = async () => {
    try {
      setUserProfile(null);
      setView('home');
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setIsInitializing(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setView('home');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [fetchProfile]);

  useEffect(() => {
    const body = document.body;
    if (theme === Theme.DARK) {
      body.classList.add('bg-black', 'text-white');
      body.classList.remove('bg-white', 'text-black');
    } else {
      body.classList.add('bg-white', 'text-black');
      body.classList.remove('bg-black', 'text-white');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  const goToAuth = () => setView('auth');
  const goToHome = () => setView('home');

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme === Theme.DARK ? 'dark' : ''}`}>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onAuthClick={goToAuth} 
        onLogoutClick={handleLogout}
        isLoggedIn={!!userProfile}
        onLogoClick={goToHome}
      />
      
      {view === 'home' && (
        <main className="animate-in fade-in duration-1000">
          <Hero theme={theme} onBookClick={goToAuth} />
          <section id="tratamientos">
             <Services theme={theme} onBookClick={goToAuth} />
          </section>
          <section id="contacto">
            <Contact theme={theme} />
          </section>
        </main>
      )}

      {view === 'auth' && (
        <div className="animate-in slide-in-from-bottom-10 duration-500">
          <Auth theme={theme} onBack={goToHome} />
        </div>
      )}
      
      {view === 'dashboard' && userProfile && (
        <div className="animate-in fade-in duration-500">
          <Dashboard theme={theme} profile={userProfile} />
        </div>
      )}
      
      <Footer theme={theme} />
    </div>
  );
};

export default App;
