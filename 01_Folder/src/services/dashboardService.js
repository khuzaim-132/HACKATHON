import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const PATIENTS_COLLECTION = 'patients';
const USERS_COLLECTION = 'users';
const APPOINTMENTS_COLLECTION = 'appointments';

export const subscribeToDashboardStats = (callback) => {
  const unsubscribers = [];
  const stats = {
    patients: 0,
    doctors: 0,
    appointments: 0
  };

  // Subscribe to Patients Count
  const patientsQuery = query(collection(db, PATIENTS_COLLECTION));
  unsubscribers.push(onSnapshot(patientsQuery, (snapshot) => {
    stats.patients = snapshot.size;
    callback({ ...stats });
  }));

  // Subscribe to Doctors Count
  const doctorsQuery = query(collection(db, USERS_COLLECTION), where('role', '==', 'doctor'));
  unsubscribers.push(onSnapshot(doctorsQuery, (snapshot) => {
    stats.doctors = snapshot.size;
    callback({ ...stats });
  }));

  // Subscribe to Appointments Count
  const appointmentsQuery = query(collection(db, APPOINTMENTS_COLLECTION));
  unsubscribers.push(onSnapshot(appointmentsQuery, (snapshot) => {
    stats.appointments = snapshot.size;
    callback({ ...stats });
  }));

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};
