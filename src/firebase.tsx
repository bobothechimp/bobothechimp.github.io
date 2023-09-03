import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import * as FIREBASE_CONFIG from "./global/firebaseConfig";

const app = initializeApp({
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  projectId: FIREBASE_CONFIG.PROJECT_ID,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID,
  appId: FIREBASE_CONFIG.APP_ID,
});

export const auth = getAuth(app);
export default app;
