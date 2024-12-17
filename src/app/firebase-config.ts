import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC4JfSM0oOpdd3SuZ9U-ZjdbAkm5JJNBd4',
  authDomain: 'star-d-b36f2.firebaseapp.com',
  projectId: 'star-d-b36f2',
  storageBucket: 'star-d-b36f2.appspot.com',
  messagingSenderId: '120310192534',
  appId: '1:120310192534:web:68ff24744c5020f6bc25b7',
  measurementId: 'G-CTXSFHQSCT',
};

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;

export const initializeFirebase = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log('Firebase initialized');
    } else {
      firebaseApp = getApps()[0];
      console.log('Firebase already initialized');
    }

    firebaseAuth = getAuth(firebaseApp);
    resolve();
  });
};

export { firebaseAuth };
