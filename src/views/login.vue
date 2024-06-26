<script>
import { signInWithEmailAndPassword, auth } from "../db/firebase.js";
import togglePassword from "@/mixins/togglePassword.js";
export default {
  mixins: [togglePassword],
  data() {
    return {
      loading: false,
      error: "",
    };
  },
  methods: {
    handleSubmit() {
      const loginForm = document.querySelector(".login");
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      if (email == "") this.error = "Enter your email";
      else if (password == "") this.error = "Enter your password";
      else {
        this.loading = true;
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            this.$router.replace({ name: "Shop" });
          })
          .catch((err) => {
            if ((err.message = "Firebase: Error (auth/invalid-email).")) {
              this.error = "Invalid email.";
              this.loading = false;
            } else {
              this.error = "Invalid credentials.";
               this.loading = false;
            }
          });
      }
    },
  },
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="login w-2/4 p-10 flex flex-col justify-center items-center gap-10 font-medium tracking-wide"
  >
    <p v-if="error != ''" class="text-red-600">{{ error }}</p>
    <div class="w-3/4 flex flex-col gap-3">
      <label for="">Email</label>
      <input
        class="focus:outline-none font-normal border-b border-gray-600"
        type="text"
        placeholder="@johndoe"
        name="email"
        v-on:keydown="error = ''"
        v-on:focus="loading = false"
        id=""
      />
    </div>
    <div class="w-3/4 flex flex-col gap-3 tracking-wide">
      <label for="">Password</label>
      <div class="w-full flex relative">
        <input
          id="userPassword"
          class="focus:outline-none w-full font-normal border-b border-gray-600"
          type="password"
          placeholder="Password"
          name="password"
          v-on:keydown="error = ''"
          v-on:focus="loading = false"
        />
        <i
          class="fa fa-eye fa-lg py-1 pl-2 border-b border-gray-600 cursor-pointer"
          id="iconEye"
          @click="togglePassword"
          aria-hidden="true"
        ></i>
      </div>
    </div>
    <button
      class="bg-purple w-3/4 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
      href="http://"
    >
      <img
        v-if="loading"
        class="animate-spin-slow w-6"
        src="../assets/loading.png"
        alt=""
      />
      <span v-if="!loading">SIGN IN</span>
    </button>
    <p class="font-normal tracking-wide">
      Don't have an account?
      <router-link
        to="/User/signup"
        class="cursor-pointer border-b border-gray-400 hover:border-gray-800"
        >Register here</router-link
      >
    </p>
  </form>
</template>
