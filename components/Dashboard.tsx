
import React from 'react';
import { Theme, Profile } from '../types';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

interface DashboardProps {
  theme: Theme;
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ theme, profile }) => {
  if (profile.role === 'doctor') {
    return <DoctorDashboard theme={theme} profile={profile} />;
  }
  return <PatientDashboard theme={theme} profile={profile} />;
};

export default Dashboard;
