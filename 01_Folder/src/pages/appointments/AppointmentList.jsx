import React, { useState, useEffect } from 'react';
import { subscribeToAppointments, createAppointment, deleteAppointment } from '../../services/appointmentService';
import { subscribeToPatients } from '../../services/patientService';
import { subscribeToUsers } from '../../services/userService';
import { Plus, Search, Trash2, Calendar, Clock, User, UserRound } from 'lucide-react';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', time: '', reason: '' });

  useEffect(() => {
    const unsubscribe = subscribeToAppointments((data) => {
      setAppointments(data || []);
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      const unsubP = subscribeToPatients(setPatients);
      const unsubD = subscribeToUsers('doctor', setDoctors);
      return () => { unsubP?.(); unsubD?.(); };
    }
  }, [isModalOpen]);

  const handleDelete = async (id) => {
    if (window.confirm('Cancel appointment?')) await deleteAppointment(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createAppointment(formData);
    if (res.success) setIsModalOpen(false);
    else alert(res.error);
  };

  const filtered = (appointments || []).filter(a => 
    a?.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a?.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-slate-400">Loading Appointments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">Appointments</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2">
          <Plus size={20} /> New Appointment
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <input 
            type="text" placeholder="Search appointments..." 
            className="w-full outline-none font-medium"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-6 text-xs font-black text-slate-500 uppercase">Patient</th>
              <th className="p-6 text-xs font-black text-slate-500 uppercase">Doctor</th>
              <th className="p-6 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <tr key={a.id}>
                <td className="p-6 font-bold text-slate-900">{a.patientName}</td>
                <td className="p-6 text-slate-600">Dr. {a.doctorName}</td>
                <td className="p-6 text-right">
                  <button onClick={() => handleDelete(a.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h3 className="text-xl font-black mb-6">Book Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" required
                value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              >
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" required
                value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name}</option>)}
              </select>
              <input 
                type="date" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" required
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl">Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
