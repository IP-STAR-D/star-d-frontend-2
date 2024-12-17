export const environment = {
  production: true,
  apiUrl: process.env.API_URL || 'http://localhost:8081',
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY || 'default-api-key',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'default-auth-domain',
    projectId: process.env.FIREBASE_PROJECT_ID || 'default-project-id',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'default-storage-bucket',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'default-messaging-sender-id',
    appId: process.env.FIREBASE_APP_ID || 'default-app-id',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'default-measurement-id',
  },
};
