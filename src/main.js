import "./input.css";

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
app.use(Flutterwave, { publicKey: 'FLWPUBK_TEST-e17db5250c99e6d06e889d66daee3f21-X' })
app.use(VueScrollTo)


let mounted = false;
auth.onAuthStateChanged((user) => {


  localStorage.setItem('loggedIn', user ? true : false);
  localStorage.setItem('userUID',  user ? user.uid : '' );

  if (!mounted) {
    app.mount("#app");
    mounted = true;
  }
});



