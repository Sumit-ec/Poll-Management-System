import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyC4PJ_St_b8KJqMBJDR6DEVAq4MWvUnd2s",
  authDomain: "poll-management-system-cf500.firebaseapp.com",
  projectId: "poll-management-system-cf500",
  storageBucket: "poll-management-system-cf500.firebasestorage.app",
  messagingSenderId: "342992337510",
  appId: "1:342992337510:web:41705d73a567dc75ac8ba7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);