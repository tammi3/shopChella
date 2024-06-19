import "./input.css";

import { createApp } from "vue";
import { initializeApp } from "firebase/app";
import App from "./App.vue";
import router from "./router";
import VueTheMask from "vue-the-mask";
import {
    getFirestore
} from 'firebase/firestore';
import { 
    getAuth 
} from 'firebase/auth';
const app = createApp(App);
const firebaseConfig = {
  apiKey: "AIzaSyAzpFVYcXSSWycfGwkFR_3oT2LIviY6nYs",
  authDomain: "shopchella-glo.firebaseapp.com",
  projectId: "shopchella-glo",
  storageBucket: "shopchella-glo.appspot.com",
  messagingSenderId: "1020980264023",
  appId: "1:1020980264023:web:2d0970002f9193667f3712"
};

initializeApp(firebaseConfig);
const db = getFirestore;
const auth = getAuth();

app.use(router);
app.use(VueTheMask);

app.mount("#app");
