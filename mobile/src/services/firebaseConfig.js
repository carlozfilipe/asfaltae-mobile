// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhqNqgsoHMgX-6RnPomIpThzDQRQJcKvM",
  authDomain: "pointsapp-23ac2.firebaseapp.com",
  projectId: "pointsapp-23ac2",
  storageBucket: "pointsapp-23ac2.appspot.com",
  messagingSenderId: "250251417586",
  appId: "1:250251417586:web:7808e77de15eebd7b13d6b",
  measurementId: "G-08QFZQ2YNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);