import { db } from '../firebase';
import { 
  collection, query, where, getCountFromServer, 
  onSnapshot, orderBy, doc, deleteDoc, updateDoc, serverTimestamp 
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const updateUserSubscription = async (userId, plan) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      subscriptionPlan: plan,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToUsers = (role = null, callback) => {
  let q;
  if (role) {
    q = query(collection(db, USERS_COLLECTION), where('role', '==', role), orderBy('name'));
  } else {
    // Note: orderBy might require an index if combined with where, but here we just list all or by role
    q = query(collection(db, USERS_COLLECTION), orderBy('name'));
  }
  
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  }, (error) => {
    console.error('Error in user subscription:', error);
  });
};

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

export const getDoctorsCount = async () => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', 'doctor'));
    const snapshot = await getCountFromServer(q);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error('Error fetching doctors count:', error);
    return { success: false, error: error.message };
  }
};
