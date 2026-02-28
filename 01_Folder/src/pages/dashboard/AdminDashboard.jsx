import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { subscribeToDashboardStats } from '../../services/dashboardService';
import { subscribeToDoctors } from '../../services/doctorService';
import { subscribeToAppointments } from '../../services/appointmentService';
import { createPatientWithAppointment } from '../../services/patientService';

// Import sub-pages directly for stability
import UserList from '../users/UserList';
import PatientList from '../patients/PatientList';
import AppointmentList from '../appointments/AppointmentList';

import { 
  Users, Stethoscope, Calendar, Search, 
  Plus, Phone, Mail, X, CheckCircle2, 
  Clock, AlertCircle, MoreVertical
} from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientForm, setPatientForm] = useState({ name: '', age: '', gender: 'Male', phone: '' });

  useEffect(() => {
    try {
      const unsubStats = subscribeToDashboardStats((data) => setStats(data || { patients: 0, doctors: 0, appointments: 0 }));
      const unsubDoctors = subscribeToDoctors((data) => setDoctors(data || []));
      const unsubAppointments = subscribeToAppointments((data) => setAppointments(data || []));

      setLoading(false);
      return () => {
        unsubStats?.();
        unsubDoctors?.();
        unsubAppointments?.();
      };
    } catch (error) {
      console.error("Dashboard subscription failed:", error);
      setLoading(false);
    }
  }, []);

  const handleAddPatient = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setPatientForm({ name: '', age: '', gender: 'Male', phone: '' });
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();
    if (!selectedDoctor?.id) return;
    
    try {
      const res = await createPatientWithAppointment(patientForm, selectedDoctor.id);
      if (res.success) {
        handleModalClose();
      } else {
        alert(res.error || "Failed to create patient");
      }
    } catch (err) {
      console.error("Create patient failed:", err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Patients" value={stats?.patients || 0} color="blue" />
        <StatCard icon={<Stethoscope className="text-indigo-600" />} label="Total Doctors" value={stats?.doctors || 0} color="indigo" />
        <StatCard icon={<Calendar className="text-emerald-600" />} label="Total Appointments" value={stats?.appointments || 0} color="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Our Specialists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(doctors || []).slice(0, 4).map((doctor) => (
              <div key={doctor?.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                    <Stethoscope className="text-slate-400 group-hover:text-blue-600" size={24} />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 truncate">{doctor?.name || 'Doctor'}</h3>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mt-1">{doctor?.specialization || 'General'}</p>
                </div>
                <button 
                  onClick={() => handleAddPatient(doctor)}
                  className="w-full py-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-blue-600"
                >
                  <Plus size={18} />
                  <span>Add Patient</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Recent Appointments</h2>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            {(appointments || []).slice(0, 5).map((app) => (
              <div key={app?.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 shrink-0">
                  {app?.patientName?.charAt(0) || 'P'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 truncate">{app?.patientName}</h4>
                  <p className="text-xs text-slate-400">with Dr. {app?.doctorName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden p-8 space-y-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-slate-900">Add Patient</h3>
              <button onClick={handleModalClose}><X /></button>
            </div>
            <form onSubmit={handleSubmitPatient} className="space-y-4">
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 font-bold"
                placeholder="Patient Name"
                value={patientForm.name}
                onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                required
              />
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 font-bold"
                placeholder="Phone Number"
                value={patientForm.phone}
                onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                required
              />
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl">Confirm</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${color}-50`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2">{label}</div>
    <div className="text-4xl font-black text-slate-900 tracking-tight">{value?.toLocaleString() || 0}</div>
  </div>
);

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<UserList />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="appointments" element={<AppointmentList />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
