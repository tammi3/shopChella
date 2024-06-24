import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getStorage, ref,  uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzpFVYcXSSWycfGwkFR_3oT2LIviY6nYs",
  authDomain: "shopchella-glo.firebaseapp.com",
  projectId: "shopchella-glo",
  storageBucket: "shopchella-glo.appspot.com",
  messagingSenderId: "1020980264023",
  appId: "1:1020980264023:web:2d0970002f9193667f3712",
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export {
  auth,
  db,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  storage, 
  uploadBytes,
  ref,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
