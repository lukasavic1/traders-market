import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Initialize Analytics (client-side only)
let analytics: Analytics | null = null;
let performance: ReturnType<typeof getPerformance> | null = null;

if (typeof window !== 'undefined') {
  // Check if Analytics is supported (some browsers block it)
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
  
  // Initialize Performance Monitoring
  performance = getPerformance(app);
}

export { analytics, performance };
export default app;
