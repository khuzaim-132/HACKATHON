import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, addDoc, query, where, getDocs, serverTimestamp 
} from 'firebase/firestore';
import { subscribeToDoctors } from '../services/doctorService';
import { seedProductionData } from '../utils/seedData';
import { 
  ArrowRight, ShieldCheck, Activity, Users, 
  Clock, Calendar, Phone, User, CheckCircle2, Loader2, Database
} from 'lucide-react';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    doctorId: '',
    date: ''
  });

  useEffect(() => {
    const unsubscribe = subscribeToDoctors((data) => {
      setDoctors(data || []);
    });
    return () => unsubscribe?.();
  }, []);

  const handleSyncData = async () => {
    setSyncLoading(true);
    await seedProductionData();
    setSyncLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Find or Create Patient
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, where('phone', '==', formData.phone));
      const querySnapshot = await getDocs(q);
      
      let patientId;
      if (!querySnapshot.empty) {
        patientId = querySnapshot.docs[0].id;
      } else {
        const newPatient = await addDoc(patientsRef, {
          name: formData.patientName,
          phone: formData.phone,
          createdAt: serverTimestamp()
        });
        patientId = newPatient.id;
      }

      // 2. Get Doctor Info
      const selectedDr = doctors.find(d => d.id === formData.doctorId);

      // 3. Create Appointment
      await addDoc(collection(db, 'appointments'), {
        patientId,
        patientName: formData.patientName,
        patientPhone: formData.phone,
        doctorId: formData.doctorId,
        doctorName: selectedDr?.name || 'Specialist',
        specialization: selectedDr?.specialization || 'General',
        date: formData.date,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setFormData({ patientName: '', phone: '', doctorId: '', date: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-slate-50/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold animate-in fade-in zoom-in duration-700">
                <Activity size={16} />
                <span>Advanced Healthcare OS</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]">
                Intelligence <br />
                <span className="text-blue-600">for Modern</span> <br />
                Care.
              </h1>
              
              <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                CarePulse streamlines operations and elevates patient experiences with Pakistan's most advanced medical management platform.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                  <CheckCircle2 className="text-blue-600" size={20} />
                  <span>Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                  <CheckCircle2 className="text-blue-600" size={20} />
                  <span>Secure Records</span>
                </div>
              </div>
            </div>

            {/* Right Column: Appointment Form */}
            <div className="relative animate-in slide-in-from-right-10 duration-1000">
              <div className="bg-white p-8 md:p-10 rounded-[48px] shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Request Appointment</h2>
                  <p className="text-slate-500 font-medium text-sm">Fill in your details to schedule a consultation.</p>
                </div>

                {success ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Request Sent!</h3>
                    <p className="text-slate-500 font-medium">We will contact you shortly to confirm your date.</p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="text-blue-600 font-bold text-sm hover:underline"
                    >
                      Book another appointment
                    </button>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
                      <Database size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900">System Ready.</h3>
                      <p className="text-slate-500 font-medium text-sm px-4">Synchronize doctors and clinical data to begin.</p>
                    </div>
                    <button 
                      onClick={handleSyncData}
                      disabled={syncLoading}
                      className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-3 mx-auto shadow-xl disabled:opacity-70"
                    >
                      {syncLoading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
                      <span>Synchronize System</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          required
                          type="text" 
                          placeholder="Ali Raza" 
                          className="w-full pl-12 p-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none font-bold text-slate-900"
                          value={formData.patientName}
                          onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          required
                          type="tel" 
                          placeholder="+92 3XX XXXXXXX" 
                          className="w-full pl-12 p-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none font-bold text-slate-900"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Specialist</label>
                        <select 
                          required
                          className="w-full p-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                          value={formData.doctorId}
                          onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(dr => (
                            <option key={dr.id} value={dr.id}>{dr.name} - {dr.specialization}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                          <input 
                            required
                            type="date" 
                            className="w-full pl-12 p-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 rounded-2xl transition-all outline-none font-bold text-slate-900"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <span>Book Consultation</span>}
                      {!loading && <ArrowRight size={20} />}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
            <h3 className="text-2xl font-black text-slate-900">HEALTHCORE</h3>
            <h3 className="text-2xl font-black text-slate-900">MEDI-LAB</h3>
            <h3 className="text-2xl font-black text-slate-900">PULSE-BIO</h3>
            <h3 className="text-2xl font-black text-slate-900">AI-CLINIC</h3>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Optimized for Clinical Excellence.</h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Precision tools designed for high-performance medical teams.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Users className="text-blue-600" size={32} />}
            title="Patient Intelligence"
            description="Integrated records system with AI-driven insights for faster diagnosis."
            color="blue"
          />
          <FeatureCard 
            icon={<Clock className="text-indigo-600" size={32} />}
            title="Smart Triage"
            description="Automated patient prioritization based on severity and specialist availability."
            color="indigo"
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-600" size={32} />}
            title="Secure Data Vault"
            description="Advanced encryption protocols protecting sensitive medical information."
            color="emerald"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="p-10 rounded-[40px] border border-slate-100 bg-white hover:border-blue-200 transition-all duration-500 group">
    <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center bg-${color}-50 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
  </div>
);

export default Home;
