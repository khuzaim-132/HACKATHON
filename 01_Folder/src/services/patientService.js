import { db } from '../firebase';
import { 
  collection, addDoc, doc, updateDoc, deleteDoc, getDoc,
  serverTimestamp, query, orderBy, onSnapshot 
} from 'firebase/firestore';

const PATIENTS_COLLECTION = 'patients';
const APPOINTMENTS_COLLECTION = 'appointments';
const USERS_COLLECTION = 'users';

export const createPatient = async (patientData) => {
  try {
    const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
      ...patientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: error.message };
  }
};

export const createPatientWithAppointment = async (patientData, doctorId) => {
  try {
    // 1. Get Doctor Info
    const doctorRef = doc(db, USERS_COLLECTION, doctorId);
    const doctorSnap = await getDoc(doctorRef);
    if (!doctorSnap.exists()) return { success: false, error: 'Doctor not found' };
    const doctorData = doctorSnap.data();

    // 2. Create Patient
    const patientRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
      ...patientData,
      linkedDoctorId: doctorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 3. Create Appointment Automatically
    const appointmentData = {
      patientId: patientRef.id,
      patientName: patientData.name,
      patientPhone: patientData.phone,
      doctorId,
      doctorName: doctorData.name,
      specialization: doctorData.specialization || 'General',
      date: new Date().toISOString().split('T')[0], // Today as default
      status: 'scheduled',
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, APPOINTMENTS_COLLECTION), appointmentData);
    
    return { success: true, patientId: patientRef.id };
  } catch (error) {
    console.error('Error in createPatientWithAppointment:', error);
    return { success: false, error: error.message };
  }
};

export const updatePatient = async (patientId, patientData) => {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    await updateDoc(docRef, {
      ...patientData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: error.message };
  }
};

export const deletePatient = async (patientId) => {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToPatients = (callback) => {
  const q = query(collection(db, PATIENTS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(patients);
  }, (error) => {
    console.error("Error creating patient subscription:", error);
  });
};

export const getPatientsCount = async () => {
  try {
    const coll = collection(db, PATIENTS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error('Error fetching patients count:', error);
    return { success: false, error: error.message };
  }
};

// ... keep existing functions if needed, or remove if fully replaced by subscription
// The prompt implies full replacement or addition. I will keep getPatients for now but subscribeToPatients is the key.
