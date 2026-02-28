import { db } from '../firebase';
import { 
  collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc,
  serverTimestamp, query, where, orderBy, getCountFromServer, onSnapshot
} from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';
const USERS_COLLECTION = 'users';
const PATIENTS_COLLECTION = 'patients';

export const createAppointment = async (appointmentData) => {
  try {
    const { patientId, doctorId, date, time, reason } = appointmentData;

    // Validate patient exists
    const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, patientId));
    if (!patientDoc.exists()) return { success: false, error: 'Patient not found' };
    const patientData = patientDoc.data();

    // Validate doctor exists and has proper role
    const doctorDoc = await getDoc(doc(db, USERS_COLLECTION, doctorId));
    if (!doctorDoc.exists() || doctorDoc.data().role !== 'doctor') {
      return { success: false, error: 'Doctor not found or invalid' };
    }
    const doctorData = doctorDoc.data();

    // Denormalize for fast reading as per SaaS architecture
    const appointment = {
      patientId,
      patientName: patientData.name || 'Unknown',
      patientPhone: patientData.phone || 'N/A',
      doctorId,
      doctorName: doctorData.name || 'Unknown Doctor',
      specialization: doctorData.specialization || 'General',
      date,
      time: time || 'N/A',
      reason: reason || 'N/A',
      status: 'scheduled', 
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), appointment);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToAppointments = (callback) => {
  const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(appointments);
  }, (error) => {
    console.error('Error in appointment subscription:', error);
  });
};

export const getAppointmentsCount = async () => {
  try {
    const coll = collection(db, APPOINTMENTS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error('Error fetching appointments count:', error);
    return { success: false, error: error.message };
  }
};

export const getTodayAppointments = async (doctorId = null) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let q;
    if (doctorId) {
      q = query(
        collection(db, APPOINTMENTS_COLLECTION), 
        where('date', '==', today),
        where('doctorId', '==', doctorId),
        orderBy('time', 'asc')
      );
    } else {
      q = query(
        collection(db, APPOINTMENTS_COLLECTION), 
        where('date', '==', today),
        orderBy('time', 'asc')
      );
    }
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, appointments };
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    return { success: false, error: error.message };
  }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await updateDoc(docRef, { 
      status, 
      updatedAt: serverTimestamp() 
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: error.message };
  }
};

export const getAppointmentsByRole = async (role, uid) => {
  try {
    let q;
    if (role === 'doctor') {
      q = query(collection(db, APPOINTMENTS_COLLECTION), where('doctorId', '==', uid), orderBy('createdAt', 'desc'));
    } else if (role === 'patient') {
      q = query(collection(db, APPOINTMENTS_COLLECTION), where('patientId', '==', uid), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, appointments };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { success: false, error: error.message };
  }
};
