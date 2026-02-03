"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  setAnalyticsUserId, 
  setAnalyticsUserProperties,
  logAuthEvent 
} from '@/lib/analytics';
import { trackAuthError } from '@/lib/errorTracking';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Analytics: Set user ID and properties
      if (user) {
        setAnalyticsUserId(user.uid);
        
        try {
          // Get user data from Firestore to set additional properties
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAnalyticsUserProperties({
              subscription_status: userData.hasPaid ? 'premium' : 'free',
              has_paid: userData.hasPaid || false,
              signup_date: userData.createdAt || new Date().toISOString(),
              email_verified: user.emailVerified,
            });
          } else {
            setAnalyticsUserProperties({
              subscription_status: 'free',
              has_paid: false,
              email_verified: user.emailVerified,
            });
          }
        } catch (error) {
          console.error('Error loading user properties:', error);
          // Still set basic properties even if Firestore fetch fails
          setAnalyticsUserProperties({
            subscription_status: 'free',
            has_paid: false,
            email_verified: user.emailVerified,
          });
        }
      } else {
        // Clear user ID when signed out
        setAnalyticsUserId(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Log the logout event
      logAuthEvent('logout');
    } catch (error) {
      console.error('Error signing out:', error);
      trackAuthError(
        error instanceof Error ? error.message : 'Unknown error during sign out',
        'SIGNOUT_ERROR'
      );
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
