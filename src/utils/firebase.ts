import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCoeXKDsjwGpxhCafd9-0nisiGoy89F5Q",
  authDomain: "valentine-chocolate.firebaseapp.com",
  projectId: "valentine-chocolate",
  storageBucket: "valentine-chocolate.appspot.com",
  messagingSenderId: "1013708898931",
  appId: "1:1013708898931:web:2b91b4c40a1159ca4d6006",
  measurementId: "G-VPYNJH2YC2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider };
