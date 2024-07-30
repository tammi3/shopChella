import "./input.css";

import { onSnapshot, db, doc, } from './db/firebase.js';
import { keys } from "./utilities/env.js";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'
import VueTheMask from "vue-the-mask";
import { auth } from './db/firebase.js';
import Flutterwave from 'vue-flutterwave'
import VueScrollTo from 'vue-scrollto'
 



const pinia = createPinia()
const app = createApp(App);

app.use(router);
app.use(VueTheMask);
app.use(pinia)
app.use(Flutterwave, { publicKey:  keys.flutterwave.publicKey })
app.use(VueScrollTo)


let mounted = false;

auth.onAuthStateChanged((user) => {

 if(user){
  onSnapshot(doc(db, "users", user.uid), (doc) => {
    let admin = doc.data().isAdmin;
    localStorage.setItem('admin',  user ? admin : false );
  })
 }else{
  localStorage.setItem('admin', false );
 }

  localStorage.setItem('loggedIn', user ? true : false);
  
 

  if (!mounted) {
    app.mount("#app");
    mounted = true;
  }
});



