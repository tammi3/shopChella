<script>
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  db,
  auth,
  doc,
  setDoc,
} from "../db/firebase.js";
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
      const signupForm = document.querySelector(".signup");
      const email = signupForm.email.value;
      const password = signupForm.password.value;
      var regularPassword =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if (this.firstName == "") this.error = "Enter your first name.";
      else if (this.lastName == "") this.error = "Enter your last name.";
      else if (this.selectedCountry == "") this.error = "Enter your country.";
      else if (this.selectedCity == "") this.error = "Enter your city.";
      else if (this.street == "") this.error = "Enter your street.";
      else if (this.email == "") this.error = "Enter your email.";
      else if (this.phone == "") this.error = "Enter your phone number.";
      else if (this.password == "") this.error = "Enter your password.";
      //validates password
      else if (
        this.password !== "" &&
        (this.password.length <= 5 || this.password.length > 20)
      )
        this.error = "Password should be 6-20 characters long.";
      else if (!regularPassword.test(this.password))
        this.error =
          "Password should contain atleast one number and one special character.";
      else {
        this.loading = true;
        createUserWithEmailAndPassword(auth, email, password)
          .then((cred) => {
            const user = auth.currentUser;
            console.log("user created:", cred.user, user);
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
              creationTime: user.metadata.creationTime,
            });

            this.$router.replace({ name: "Shop" });
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
          });
      }
    },
    updateCities() {
      this.cities = this.countries[this.selectedCountryCode].cities;
      this.selectedCity = "";
      this.selectedCountry = this.countries[this.selectedCountryCode].country;
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
    class="signup w-2/4 p-10 flex flex-col justify-center items-center gap-10 font-medium tracking-wide"
  >
    <!-- Error message -->
    <p v-if="error != ''" class="text-red-600">{{ error }}</p>

    <!-- NAME -->

    <div class="w-3/4 flex flex-col gap-3">
      <label for="">First Name</label>
      <input
        v-on:keydown="error = ''"
        v-model="firstName"
        class="font-normal capitalize focus:outline-none border-b border-gray-600"
        type="text"
        placeholder="First Name"
        name="firstName"
      />
    </div>

    <div class="w-3/4 flex flex-col gap-3">
      <label for="">Last Name</label>
      <input
        v-on:keydown="error = ''"
        v-model="lastName"
        class="font-normal capitalize focus:outline-none border-b border-gray-600"
        type="text"
        placeholder="Last Name"
        name="lastName"
      />
    </div>

    <!-- ADDRESS -->

    <div class="w-3/4 flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="flex gap-1 w-2/4">
          <label for="country">Country:</label>
          <select
            v-on:change="error = ''"
            id="country"
            class="border border-gray-600 w-40"
            v-model="selectedCountryCode"
            @change="updateCities"
          >
            <option value="" disabled selected>Select a country</option>
            <option v-for="(country, code) in countries" :value="code">
              {{ country.country }}
            </option>
          </select>
        </div>
        <div class="flex gap-1 w-2/4" v-if="selectedCountryCode">
          <label for="city">City:</label>
          <select
            v-on:change="error = ''"
            id="city"
            class="border border-gray-600 w-40"
            v-model="selectedCity"
          >
            <option value="" disabled selected>Select a city</option>
            <option v-for="city in cities" :value="city">{{ city }}</option>
          </select>
        </div>
      </div>
      <div class="flex flex-col">
        <input
          v-on:keydown="error = ''"
          v-model="street"
          class="font-normal focus:outline-none border-b border-gray-600"
          type="text"
          placeholder="Street"
          name="street"
        />
      </div>
    </div>

    <!-- CONTACT -->

    <div class="w-3/4 flex flex-col gap-3">
      <label for="">Email</label>
      <input
        v-on:keydown="error = ''"
        v-model="email"
        class="font-normal focus:outline-none border-b border-gray-600"
        type="text"
        placeholder="name@address.com"
        name="email"
      />
    </div>
    <div class="w-3/4 flex flex-col gap-3">
      <label for="">Phone</label>
      <input
        v-on:keydown="error = ''"
        id="phone"
        v-model="phone"
        class="font-normal focus:outline-none border-b border-gray-600"
        v-mask="['####-###-####', '####-###-####']"
        placeholder="Enter your phone number"
        name="phone"
      />
    </div>

    <!-- PASSWORD -->

    <div class="w-3/4 flex flex-col gap-3 tracking-wide">
      <label for="">Password</label>
      <div class="w-full flex relative">
        <input
          v-on:keydown="error = ''"
          id="userPassword"
          class="focus:outline-none w-full font-normal border-b border-gray-600"
          type="password"
          placeholder="Password"
          name="password"
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

    <!-- REGISTER BUTTON -->

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
      <span v-if="!loading">REGISTER</span>
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
