import React, { useState, useEffect, createContext } from 'react';
import { auth } from '../firebase/firebase';

export const UserContext = createContext({ user: null });

const UserProvider = (props) => {
  const [user, setUser] = useState({ displayName: '', email: '' });
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      try {
        const { displayName, email } = user;
        setUser({
          displayName,
          email,
        });
      } catch {
        setUser({
          displayName: '',
          email: '',
        });
      }
    });
  }, []);
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};

export default UserProvider;
