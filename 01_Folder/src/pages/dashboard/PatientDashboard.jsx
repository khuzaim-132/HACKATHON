import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';

const PatientDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-700">
        <h1 className="text-3xl font-black text-slate-900">My Health Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-100">
            <h3 className="text-xl font-black mb-2">Next Appointment</h3>
            <p className="opacity-80 font-medium">Tomorrow at 10:30 AM with Dr. Smith</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-2">Recent Prescriptions</h3>
            <p className="text-slate-500 font-medium">Amoxicillin 500mg - 2 days ago</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
