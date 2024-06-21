import "./input.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueTheMask from "vue-the-mask";
import { auth } from './db/firebase.js';



const app = createApp(App);

app.use(router);
app.use(VueTheMask);


let mounted = false;
auth.onAuthStateChanged((user) => {


  localStorage.setItem('loggedIn', user ? true : false);

  if (!mounted) {
    app.mount("#app");
    mounted = true;
  }
});



