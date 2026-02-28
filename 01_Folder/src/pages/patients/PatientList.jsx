import React, { useState, useEffect } from 'react';
import { subscribeToPatients, createPatient, updatePatient, deletePatient } from '../../services/patientService';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', phone: '' });

  useEffect(() => {
    const unsubscribe = subscribeToPatients((data) => {
      setPatients(data || []);
      setLoading(false);
    });
    return () => unsubscribe?.();
  }, []);

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setCurrentPatient(patient);
      setFormData({ name: patient.name, age: patient.age, gender: patient.gender, phone: patient.phone });
    } else {
      setCurrentPatient(null);
      setFormData({ name: '', age: '', gender: 'Male', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPatient(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) {
      await deletePatient(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPatient) {
        await updatePatient(currentPatient.id, formData);
      } else {
        await createPatient(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const filtered = (patients || []).filter(p => 
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p?.phone?.includes(searchTerm)
  );

  if (loading) return <div className="p-10 text-center text-slate-400">Loading Patients...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">Patients</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2">
          <Plus size={20} /> Add Patient
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" placeholder="Search by name..." 
            className="w-full outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-6 text-xs font-black text-slate-500 uppercase">Name</th>
              <th className="p-6 text-xs font-black text-slate-500 uppercase">Phone</th>
              <th className="p-6 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="p-6 font-bold text-slate-900">{p.name}</td>
                <td className="p-6 text-slate-600">{p.phone}</td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h3 className="text-xl font-black mb-6">{currentPatient ? 'Edit' : 'Add'} Patient</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 font-bold"
                placeholder="Full Name" required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 font-bold"
                placeholder="Phone" required
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <div className="flex gap-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
