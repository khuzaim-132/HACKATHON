import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      console.log("AuthContext: Auth state changed. currentUser:", currentUser ? currentUser.email : "null");

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          console.log("AuthContext: Firestore document exists check:", userDoc.exists());

          if (userDoc.exists()) {
            const fetchedRole = userDoc.data().role;
            console.log("AuthContext: Fetched role from Firestore:", fetchedRole);
            setRole(fetchedRole);
          } else {
            console.log("AuthContext: Document does not exist. Creating new user record...");
            const newUserData = {
              name: currentUser.displayName || "User",
              email: currentUser.email,
              role: "admin", // Default role
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, newUserData);
            console.log("AuthContext: New user document created with role: admin");
            setRole("admin");
          }
          setUser(currentUser);
        } catch (error) {
          console.error("AuthContext: Error in role fetching/creation logic:", error);
          setRole(null);
          setUser(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      
      console.log("AuthContext: Setting loading to false. Role is now:", role || (currentUser ? "Fetching..." : "null"));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
