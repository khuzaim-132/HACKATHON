import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getTodayAppointments } from '../../services/appointmentService';
import { getDoctorPrescriptionsCount } from '../../services/prescriptionService';
import { Loader2, Calendar, FileText, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptionCount, setPrescriptionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      setError(null);
      try {
        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          getTodayAppointments(user.uid),
          getDoctorPrescriptionsCount(user.uid)
        ]);

        if (appointmentsRes?.success) {
          setAppointments(appointmentsRes.appointments || []);
        } else {
          console.error("Failed to fetch appointments:", appointmentsRes?.error);
        }

        if (prescriptionsRes?.success) {
          setPrescriptionCount(prescriptionsRes.count || 0);
        } else {
          console.error("Failed to fetch prescriptions:", prescriptionsRes?.error);
        }
      } catch (err) {
        console.error('Error fetching doctor dashboard data:', err);
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Schedule...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-slate-900">Doctor Overview</h1>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-500 uppercase tracking-widest">
            Logged in as: <span className="text-blue-600">{user?.email}</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Calendar size={24} />
              </div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Today's Appointments</div>
            </div>
            <div className="text-5xl font-black text-slate-900">{appointments?.length || 0}</div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <FileText size={24} />
              </div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Prescriptions</div>
            </div>
            <div className="text-5xl font-black text-slate-900">{prescriptionCount || 0}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Clock className="text-blue-600" size={20} />
            Today's Schedule
          </h2>
          
          {appointments?.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment?.id} className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100">
                      {appointment?.patientName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{appointment?.patientName || 'Anonymous'}</p>
                      <p className="text-xs text-slate-400 font-medium">{appointment?.reason || 'Routine Checkup'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{appointment?.time || 'TBD'}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg inline-block mt-1 ${
                      appointment?.status === 'scheduled' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {appointment?.status || 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 font-medium italic">Welcome back! You have no appointments scheduled for today.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
