import 'server-only';
import admin from 'firebase-admin';

// Check if app already initialized to avoid "app already exists" error in hot reload
if (!admin.apps.length) {
  try {
    // In production (Cloud Run), it uses ADC (Application Default Credentials)
    // locally, it looks for GOOGLE_APPLICATION_CREDENTIALS env var
    admin.initializeApp();
    console.log('🔥 Firebase Admin Initialized');
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();

export default admin;
