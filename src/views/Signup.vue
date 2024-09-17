<script>
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  db,
  auth,
  doc,
  setDoc,
  collection,
  addDoc,
  Timestamp,
} from "../db/firebase.js";
import Swal from "sweetalert2";
import togglePassword from "@/mixins/togglePassword.js";
export default {
  mixins: [togglePassword],
  data() {
    return {
      firstName: "",
      lastName: "",
      street: "",
      email: "",
      password: "",
      phone: "",
      countries: [],
      selectedCountry: "",
      selectedCountryCode: "",
      selectedCity: "",
      cities: [],
      loading: false,
      error: "",
    };
  },
  methods: {
    handleSubmit() {
      const email = this.email;
      const password = this.password;
      var regularPassword =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

      //validates password
      if (
        this.password !== "" &&
        (this.password.length <= 5 || this.password.length > 20)
      ) {
        this.error = "Password should be 6-20 characters long.";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (!regularPassword.test(this.password)) {
        this.error =
          "Password should contain atleast one number and one special character.";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        this.loading = true;
        createUserWithEmailAndPassword(auth, email, password)
          .then((cred) => {
            const user = auth.currentUser;

            setDoc(doc(db, "users", user.uid), {
              email: this.email,
              password: this.password,
              name: {
                firstname: this.firstName,
                lastname: this.lastName,
              },
              address: {
                country: this.selectedCountry,
                city: this.selectedCity,
                street: this.street,
              },
              phone: this.phone,
              updatedProfileImage: false,
              userId: user.uid,
              isAdmin: false,
              creationTime: user.metadata.creationTime,
            }).then(() => {
              setDoc(doc(db, "carts", user.uid), {
                status: "active",
                created_at: Timestamp.fromDate(new Date()),
                updated_at: Timestamp.fromDate(new Date()),
                items: [],
              });
            });
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
            const previousRoute = this.$router.options.history.state.back;
            this.$router.push({ path: previousRoute });
          })
          .catch((err) => {
            if (
              (err.message = "Firebase: Error (auth/email-already-in-use).")
            ) {
              this.error = "Email already associated with another account.";
              this.loading = false;
            } else {
              this.error = err.message.slice(9);
              this.loading = false;
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
      }
    },
    updateCities() {
      this.cities = this.countries[this.selectedCountryCode].cities;
      this.selectedCity = "";
      this.selectedCountry = this.countries[this.selectedCountryCode].country;
    },
    clearError() {
      this.error = "";
    },
  },

  created() {
    axios.get("https://countriesnow.space/api/v0.1/countries/").then((data) => {
      this.countries = data.data.data;
    });
  },
};
</script>
<template>
  <form
    @submit.prevent="handleSubmit"
    class="signup w-full flex flex-col justify-center items-center gap-10 font-medium tracking-wide font-Ubuntu"
  >
    <!-- Error message -->
    <p v-if="error != ''" class="text-red-600">{{ error }}</p>
    <!-- NAME -->

    <div class="w-full flex flex-col gap-3">
      <label for="">First Name</label>
      <input
        v-model="firstName"
        v-on:keydown="clearError()"
        class="font-normal capitalize focus:outline-none border-b border-gray-600"
        type="text"
        placeholder="First Name"
        name="firstName"
        required
      />
    </div>

    <div class="w-full flex flex-col gap-3">
      <label for="">Last Name</label>
      <input
        v-model="lastName"
        v-on:keydown="clearError()"
        class="font-normal capitalize focus:outline-none border-b border-gray-600"
        type="text"
        placeholder="Last Name"
        name="lastName"
        required
      />
    </div>

    <!-- ADDRESS -->
    <div class="w-full flex flex-col gap-3">
      <label for="country">Country:</label>
      <select
        v-on:change="error = ''"
        v-on:keydown="clearError()"
        id="country"
        class="border-b pb-1 border-gray-600 w-full focus:outline-none"
        v-model="selectedCountryCode"
        @change="updateCities"
        required
      >
        <option value="" disabled selected>Select a country</option>
        <option
          v-for="(country, code) in countries"
          :key="country"
          :value="code"
        >
          {{ country.country }}
        </option>
      </select>
    </div>
    <div class="w-full flex flex-col gap-3" v-if="selectedCountryCode">
      <label for="city">City:</label>
      <select
        v-on:change="error = ''"
        v-on:keydown="clearError()"
        id="city"
        class="border-b pb-1 border-gray-600 w-full focus:outline-none"
        v-model="selectedCity"
        required
      >
        <option value="" disabled selected>Select a city</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>

    <div class="w-full flex flex-col gap-3">
      <div class="flex flex-col">
        <input
          v-model="street"
          v-on:keydown="clearError()"
          class="font-normal focus:outline-none border-b border-gray-600"
          type="text"
          placeholder="Street"
          name="street"
          required
        />
      </div>
    </div>

    <!-- CONTACT -->

    <div class="w-full flex flex-col gap-3">
      <label for="">Email</label>
      <input
        v-model="email"
        v-on:keydown="clearError()"
        class="font-normal focus:outline-none border-b border-gray-600"
        type="text"
        placeholder="name@address.com"
        name="email"
        required
      />
    </div>
    <div class="w-full flex flex-col gap-3">
      <label for="">Phone</label>
      <input
        id="phone"
        v-model="phone"
        v-on:keydown="clearError()"
        class="font-normal focus:outline-none border-b border-gray-600"
        v-mask="['####-###-####', '####-###-####']"
        placeholder="Enter your phone number"
        name="phone"
        required
      />
    </div>

    <!-- PASSWORD -->

    <div class="w-full flex flex-col gap-3 tracking-wide">
      <label for="">Password</label>
      <div class="w-full flex relative">
        <input
          id="password"
          class="focus:outline-none w-full font-normal border-b border-gray-600"
          type="password"
          placeholder="Password"
          name="password"
          v-model="password"
          v-on:keydown="clearError()"
          required
        />
        <i
          class="fa fa-eye fa-lg py-1 pl-2 border-b border-gray-600 cursor-pointer"
          id="iconEye"
          @click="togglePassword"
          aria-hidden="true"
        ></i>
      </div>
    </div>

    <!-- REGISTER BUTTON -->

    <button
      type="submit"
      class="w-full h-10 uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
    >
      <img
        v-if="loading"
        class="animate-spin-slow w-6"
        src="../assets/loading.png"
        alt=""
      />
      <span v-else>REGISTER</span>
    </button>
    <p class="font-normal tracking-wide">
      Already have an account?
      <router-link
        to="/User/login"
        class="cursor-pointer border-b border-gray-400 hover:border-gray-800"
        >Login here</router-link
      >
    </p>
  </form>
</template>
