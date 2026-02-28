import { db } from '../firebase';
import { 
  collection, addDoc, getDocs, query, limit, 
  serverTimestamp, where 
} from 'firebase/firestore';

/**
 * PRODUCTION SEED DATA: Realistic Healthcare Content
 */

const DOCTORS_DATA = [
  { name: "Dr. Ahmed Khan", email: "ahmed.khan@carepulse.ai", phone: "+92 300 1234567", specialization: "Cardiologist" },
  { name: "Dr. Sara Ali", email: "sara.ali@carepulse.ai", phone: "+92 301 2345678", specialization: "Dentist" },
  { name: "Dr. Usman Tariq", email: "usman.tariq@carepulse.ai", phone: "+92 302 3456789", specialization: "Neurologist" },
  { name: "Dr. Hina Malik", email: "hina.malik@carepulse.ai", phone: "+92 303 4567890", specialization: "Pediatrician" },
  { name: "Dr. Bilal Ahmed", email: "bilal.ahmed@carepulse.ai", phone: "+92 304 5678901", specialization: "General Physician" },
  { name: "Dr. Fatima Noor", email: "fatima.noor@carepulse.ai", phone: "+92 305 6789012", specialization: "Dermatologist" },
];

const PATIENTS_DATA = [
  { name: "Ali Raza", age: 28, gender: "Male", phone: "+92 321 1112223" },
  { name: "Hassan Ahmed", age: 35, gender: "Male", phone: "+92 321 4445556" },
  { name: "Ayesha Khan", age: 24, gender: "Female", phone: "+92 321 7778889" },
  { name: "Maryam Ali", age: 31, gender: "Female", phone: "+92 321 0001112" },
  { name: "Zain Malik", age: 19, gender: "Male", phone: "+92 321 3334445" },
  { name: "Umar Farooq", age: 42, gender: "Male", phone: "+92 321 6667778" },
  { name: "Sana Javed", age: 27, gender: "Female", phone: "+92 321 9990001" },
  { name: "Bilal Siddiqui", age: 38, gender: "Male", phone: "+92 321 8887776" },
];

export const seedProductionData = async () => {
  console.log("🚀 Starting Data Synchronization...");

  try {
    const checkQuery = query(collection(db, 'users'), where('role', '==', 'doctor'), limit(1));
    const checkSnap = await getDocs(checkQuery);
    
    if (!checkSnap.empty) {
      console.warn("⚠️ Data already exists. Skipping insertion.");
      return { success: false, message: "Records already present." };
    }

    // 1. Sync Doctors
    const seededDoctors = [];
    for (const docData of DOCTORS_DATA) {
      const docRef = await addDoc(collection(db, 'users'), {
        ...docData,
        role: "doctor",
        createdAt: serverTimestamp()
      });
      seededDoctors.push({ id: docRef.id, ...docData });
    }

    // 2. Sync Patients
    const seededPatients = [];
    for (const patData of PATIENTS_DATA) {
      const docRef = await addDoc(collection(db, 'patients'), {
        ...patData,
        createdAt: serverTimestamp()
      });
      seededPatients.push({ id: docRef.id, ...patData });
    }

    // 3. Sync Appointments
    const statuses = ['confirmed', 'pending', 'completed'];
    for (let i = 0; i < 6; i++) {
      const dr = seededDoctors[i];
      const pt = seededPatients[i];
      
      const date = new Date();
      date.setDate(date.getDate() + (i + 2));
      const dateString = date.toISOString().split('T')[0];

      await addDoc(collection(db, 'appointments'), {
        doctorId: dr.id,
        doctorName: dr.name,
        specialization: dr.specialization,
        patientId: pt.id,
        patientName: pt.name,
        patientPhone: pt.phone,
        date: dateString,
        status: statuses[i % 3],
        createdAt: serverTimestamp()
      });
    }

    console.log("✅ System data synchronized successfully!");
    return { success: true };

  } catch (error) {
    console.error("❌ Sync Error:", error);
    return { success: false, error: error.message };
  }
};
