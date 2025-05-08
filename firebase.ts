// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-app.firebaseapp.com',
  projectId: 'your-app',
  storageBucket: 'your-app.appspot.com',
  messagingSenderId: 'xxxxxx',
  appId: '1:xxxxxx:web:xxxxxx',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);