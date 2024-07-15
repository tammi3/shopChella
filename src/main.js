import "./input.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'
import VueTheMask from "vue-the-mask";
import { auth } from './db/firebase.js';



const pinia = createPinia()
const app = createApp(App);

app.use(router);
app.use(VueTheMask);
app.use(pinia)


let mounted = false;
auth.onAuthStateChanged((user) => {


  localStorage.setItem('loggedIn', user ? true : false);
  localStorage.setItem('userUID',  user ? user.uid : '' );

  if (!mounted) {
    app.mount("#app");
    mounted = true;
  }
});



