import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import supabase from './lib/supabase';

import {Session} from '@supabase/supabase-js'

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       supabase.auth.getSession().then(({ data: { session } }) => {
//             setUser(session.user.id)
//      })
//     } catch (err) {
//       console.error('Error fetching user:', err);
//     } finally {
//       setLoading(false);
//     }
//   }

//     useEffect(() => {
//         fetchUser();
//     }, []);

  return (
    <AppContext.Provider value={{ user, setUser, session, setSession , loading}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
