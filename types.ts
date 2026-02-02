
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  role: 'patient' | 'doctor';
}

export interface Appointment {
  id: string;
  patient_id: string;
  title: string;
  description: string;
  reason?: string; // Campo requerido por algunas configuraciones de Supabase
  allergies: string;
  payment_method: 'Efectivo' | 'Banco' | 'Occidente';
  status: 'pending' | 'accepted' | 'cancelled';
  scheduled_at: string | null;
  created_at: string;
  patient?: Profile;
}

export interface ClinicSchedule {
  day: string;
  open: string;
  close: string;
  is_closed: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
