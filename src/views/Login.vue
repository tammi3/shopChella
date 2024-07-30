<script>
import { signInWithEmailAndPassword, auth } from "../db/firebase.js";
import togglePassword from "@/mixins/togglePassword.js";
import Swal from "sweetalert2";
export default {
  mixins: [togglePassword],
  data() {
    return {
      loading: false,
      error: "",
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      const email = this.email;
      const password = this.password;
      this.loading = true;
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully",
          });
          this.$router.replace({ path: "/Shop/allcategories" });
        })
        .catch((err) => {
          if (err.message == "Firebase: Error (auth/invalid-email).") {
            this.error = "Invalid email.";
            this.loading = false;
          } else {
            this.error = "Invalid credentials.";
            this.loading = false;
          }
        });
    },
  },
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="login w-full py-10 flex flex-col justify-start items-center gap-10 font-medium tracking-wide"
  >
    <p v-if="error != ''" class="text-red-600">{{ error }}</p>
    <div class="w-full flex flex-col gap-3">
      <label for="">Email</label>
      <input
        class="font-normal border-b border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
        type="text"
        placeholder="@johndoe"
        name="email"
        v-model="email"
        id="email"
        required
      />
    </div>
    <div class="w-full flex flex-col gap-3 tracking-wide">
      <label for="">Password</label>
      <div class="w-full flex relative">
        <input
          id="password"
          class="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 w-full font-normal border-b border-gray-600"
          type="password"
          placeholder="Password"
          name="password"
          required
          v-model="password"
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
      type="submit"
      class="w-full h-10 uppercase cursor-pointer font-bold rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
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
