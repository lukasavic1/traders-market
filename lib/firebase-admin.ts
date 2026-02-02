import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  const serviceAccountKey = process.env.TRADERS_MARKET_FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.NEXT_PUBLIC_TRADERS_MARKET_FIREBASE_PROJECT_ID || 'traders-market-49355';
  
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: projectId,
      });
    } catch (error) {
      console.error('Failed to parse TRADERS_MARKET_FIREBASE_SERVICE_ACCOUNT_KEY:', error);
      throw new Error('Invalid TRADERS_MARKET_FIREBASE_SERVICE_ACCOUNT_KEY format');
    }
  } else {
    console.warn('TRADERS_MARKET_FIREBASE_SERVICE_ACCOUNT_KEY not set - Firebase Admin operations will fail');
    console.warn('Please add TRADERS_MARKET_FIREBASE_SERVICE_ACCOUNT_KEY to your .env.local file');
    // Initialize with project ID only (will fail on actual operations without credentials)
    try {
      adminApp = initializeApp({
        projectId: projectId,
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      // Create a dummy app to prevent errors, but operations will fail
      adminApp = null;
    }
  }
} else {
  adminApp = getApps()[0];
}

if (!adminApp) {
  throw new Error('Firebase Admin failed to initialize. Please check TRADERS_MARKET_FIREBASE_SERVICE_ACCOUNT_KEY in .env.local');
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export default adminApp;
