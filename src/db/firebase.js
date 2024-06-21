import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};

// // signing users up
// const signupForm = document.querySelector('.signup')
// signupForm.addEventListener('submit', (e) => {
//   e.preventDefault()

//   const email = signupForm.email.value
//   const password = signupForm.password.value

//   createUserWithEmailAndPassword(auth, email, password)
//     .then(cred => {
//       console.log('user created:', cred.user)
//       signupForm.reset()
//     })
//     .catch(err => {
//       console.log(err.message)
//     })
// })
