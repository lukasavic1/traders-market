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
  /** True if user has paid/subscription; false if free; undefined while loading from Firestore */
  hasActiveSubscription: boolean | undefined;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasActiveSubscription: undefined,
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
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (!user) {
        setHasActiveSubscription(undefined);
        setAnalyticsUserId(null);
        setLoading(false);
        return;
      }

      setAnalyticsUserId(user.uid);

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const paid = userData.hasPaid === true;
          setHasActiveSubscription(paid);
          setAnalyticsUserProperties({
            subscription_status: paid ? 'premium' : 'free',
            has_paid: paid,
            signup_date: userData.createdAt || new Date().toISOString(),
            email_verified: user.emailVerified,
          });
        } else {
          setHasActiveSubscription(false);
          setAnalyticsUserProperties({
            subscription_status: 'free',
            has_paid: false,
            email_verified: user.emailVerified,
          });
        }
      } catch (error) {
        console.error('Error loading user properties:', error);
        setHasActiveSubscription(false);
        setAnalyticsUserProperties({
          subscription_status: 'free',
          has_paid: false,
          email_verified: user.emailVerified,
        });
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
    hasActiveSubscription,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
