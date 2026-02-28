import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const APPOINTMENTS_COLLECTION = 'appointments';

export const subscribeToDoctors = (callback) => {
  // Simplified query to avoid index requirements during hackathon/demo
  const q = query(
    collection(db, USERS_COLLECTION), 
    where('role', '==', 'doctor')
  );

  return onSnapshot(q, (snapshot) => {
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by name or createdAt in JS
    const sortedDoctors = doctors.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    callback(sortedDoctors);
  }, (error) => {
    console.error("Error subscribing to doctors:", error);
  });
};

export const getDoctorById = async (doctorId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, doctorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, doctor: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: "Doctor not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
