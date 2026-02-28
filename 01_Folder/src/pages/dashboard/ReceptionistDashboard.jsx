import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { getTodayAppointments } from '../../services/appointmentService';
import { getPatientsCount } from '../../services/patientService';

const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientsRes] = await Promise.all([
          getTodayAppointments(),
          getPatientsCount()
        ]);

        if (appointmentsRes.success) {
          setAppointments(appointmentsRes.appointments);
        }
        if (patientsRes.success) {
          setPatientCount(patientsRes.count);
        }
      } catch (error) {
        console.error('Error fetching receptionist dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-700">
        <h1 className="text-3xl font-black text-slate-900">Receptionist Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Today's Total Appointments</div>
            <div className="text-4xl font-black text-slate-900">{appointments.length}</div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total Patients</div>
            <div className="text-4xl font-black text-slate-900">{patientCount}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Today's Check-ins</h2>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-900">{appointment.patientName}</p>
                    <p className="text-sm text-slate-500">Dr. {appointment.doctorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{appointment.time}</p>
                    <p className="text-xs uppercase font-bold text-emerald-600">{appointment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 font-medium">No pending check-ins for today.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
