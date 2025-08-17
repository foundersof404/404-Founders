import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

console.log('Firebase config: Initializing Firebase');

const firebaseConfig = {
    apiKey: "AIzaSyAFboEkUavDgKPrTB13zpo5Fkm4ZtXGVh8",
    authDomain: "traveler-agency-795f4.firebaseapp.com",
    projectId: "traveler-agency-795f4",
    storageBucket: "traveler-agency-795f4.firebasestorage.app",
    messagingSenderId: "169452632839",
    appId: "1:169452632839:web:989c7d7c2fcf71875663a2",
    measurementId: "G-6L14RW53Y9"
  };

// Initialize Firebase only if no apps exist
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase config: App initialized', { appName: app.name });

export const auth: Auth = getAuth(app);
console.log('Firebase config: Auth initialized');

export const db: Firestore = getFirestore(app);
console.log('Firebase config: Firestore initialized');

export const googleProvider = new GoogleAuthProvider();
console.log('Firebase config: Google provider initialized'); 