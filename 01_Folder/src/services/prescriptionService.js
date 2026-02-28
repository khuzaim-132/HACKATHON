import { db } from '../firebase';
import { 
  collection, addDoc, getDocs, doc, getDoc, 
  serverTimestamp, query, where, orderBy, getCountFromServer
} from 'firebase/firestore';

const PRESCRIPTIONS_COLLECTION = 'prescriptions';
const USERS_COLLECTION = 'users';
const PATIENTS_COLLECTION = 'patients';

export const createPrescription = async (prescriptionData) => {
  try {
    const { patientId, doctorId, medications, instructions } = prescriptionData;

    // Validate patient
    const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, patientId));
    if (!patientDoc.exists()) return { success: false, error: 'Patient not found' };

    // Validate doctor
    const doctorDoc = await getDoc(doc(db, USERS_COLLECTION, doctorId));
    if (!doctorDoc.exists()) return { success: false, error: 'Doctor not found' };

    const prescription = {
      patientId,
      patientName: patientDoc.data().name || 'Unknown Patient',
      doctorId,
      doctorName: doctorDoc.data().name || 'Unknown Doctor',
      medications, // Array of objects [{ name, dosage, frequency }]
      instructions,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, PRESCRIPTIONS_COLLECTION), prescription);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: error.message };
  }
};

export const getDoctorPrescriptionsCount = async (doctorId) => {
  try {
    const q = query(collection(db, PRESCRIPTIONS_COLLECTION), where('doctorId', '==', doctorId));
    const snapshot = await getCountFromServer(q);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error('Error fetching prescriptions count:', error);
    return { success: false, error: error.message };
  }
};

export const getPatientPrescriptions = async (patientId) => {
  try {
    const q = query(
      collection(db, PRESCRIPTIONS_COLLECTION), 
      where('patientId', '==', patientId), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const prescriptions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, prescriptions };
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return { success: false, error: error.message };
  }
};
