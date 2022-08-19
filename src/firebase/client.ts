import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyADiUhMB-HfGVjVf0MTbi4vrWyRs-xee9o',
  authDomain: 'rangers-37359.firebaseapp.com',
  databaseURL: 'https://rangers-37359.firebaseio.com',
  projectId: 'rangers-37359',
  storageBucket: 'rangers-37359.appspot.com',
  messagingSenderId: '785718717495',
  appId: '1:785718717495:web:43ce53febe28acd857e3b2',
  measurementId: 'G-D6JR3SSG7B',
};

const app = initializeApp(firebaseConfig);
export const db_client = getFirestore(app);
export const auth_client = getAuth(app);
