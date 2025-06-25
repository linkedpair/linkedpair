import React, { useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const UserContext = createContext({
    user: null,
    userData: null,
    userDataReady: false,
    loading: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDataReady, setUserDataReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = () => {};
  
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);

      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);

        unsubscribeUserDoc = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data())
              setUserDataReady(true);
            } else {
              setUserData(null)
              setUserDataReady(false);
            }
            setLoading(false)
          },
          (error) => {
            console.error("Error listening to user doc:", error);
            setUserDataReady(false);
            setUserData(null);
            setLoading(false);
          }
        );
      } else {
        setUserDataReady(false);
        setUserData(null);
        setLoading(false);
      }
    });
  
    return () => {
      unsubscribeAuth();
      unsubscribeUserDoc();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, userDataReady, loading }}>
      {children}
    </UserContext.Provider>
  )
}