<script>
import {
  db,
  auth,
  getDownloadURL,
  onSnapshot,
  doc,
  ref,
  storage,
} from "../db/firebase.js";
export default {
  data() {
    return {
      userInfo: {},
      search: "",
      cartDisplay: "",
      updatedProfileImage: true,
    };
  },
  methods: {
    toggleCart() {
      this.cartDisplay = document.querySelector("#cartDisplay");

      if (this.cartDisplay.classList.contains("hidden")) {
        this.cartDisplay.classList.remove("hidden");
        this.cartDisplay.classList.add("flex");
      } else {
        this.cartDisplay.classList.add("hidden");
        this.cartDisplay.classList.remove("flex");
      }
    },
  },
  created() {
    const user = auth.currentUser;
    if (user) {
      onSnapshot(doc(db, "users", user.uid), (doc) => {
        this.userInfo = doc.data();
        if (this.userInfo.updatedProfileImage) {
          this.updatedProfileImage = false;
          getDownloadURL(ref(storage, "profile/" + this.userInfo.profile_image))
            .then((url) => {
              // Or inserted into an <img> element
              const img = document.getElementById("profile");
              img.setAttribute("src", url);
            })
            .catch((error) => {});
        }
        if (!this.userInfo.updatedProfileImage) {
          this.updatedProfileImage = true;
        }
      });
    }
  },
};
</script>
<template>
  <div class="sticky top-0 w-full z-50 border-b-black border-solid border">
    <nav
      class="font-Ubuntu flex justify-between bg-white text-lg px-10 py-6 gap-10"
    >
      <RouterLink class="font-Anton w-3/4 text-3xl pr-10" to="/"
        >shopChella</RouterLink
      >

      <ul class="flex w-1/4 justify-center items-center gap-4">
        <div class="flex gap-3 w-2/4 justify-center items-center">
          <RouterLink
            class="font-EdGaramond font-bold text-xl pr-10"
            to="/Shop/category"
            >Shop</RouterLink
          >
        </div>
        <router-link class="hover:opacity-60" to="/Profile">
          <!-- default profile image -->
          <i
            v-if="updatedProfileImage"
            class="fa fa-user-o fa-lg"
            aria-hidden="true"
          ></i>
          <!-- custom profile image -->
          <img
            v-if="userInfo.updatedProfileImage"
            id="profile"
            class="w-10 h-10 rounded-full"
            src=""
            alt=""
          />
        </router-link>
        <svg
          @click="toggleCart"
          id="cart"
          class="opacity-80 hover:opacity-60 cursor-pointer"
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 11V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10.9673M10.4 21H13.6C15.8402 21 16.9603 21 17.816 20.564C18.5686 20.1805 19.1805 19.5686 19.564 18.816C20 17.9603 20 16.8402 20 14.6V12.2C20 11.0799 20 10.5198 19.782 10.092C19.5903 9.71569 19.2843 9.40973 18.908 9.21799C18.4802 9 17.9201 9 16.8 9H7.2C6.0799 9 5.51984 9 5.09202 9.21799C4.71569 9.40973 4.40973 9.71569 4.21799 10.092C4 10.5198 4 11.0799 4 12.2V14.6C4 16.8402 4 17.9603 4.43597 18.816C4.81947 19.5686 5.43139 20.1805 6.18404 20.564C7.03968 21 8.15979 21 10.4 21Z"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </ul>
    </nav>

    <div
      id="cartDisplay"
      class="w-full right-0 h-screen absolute hidden justify-end top-0 backdrop-blur-lg z-50"
    >
      <div class="w-2/4 bg-white z-50 h-screen flex flex-col">
        <div class="w-full p-10 flex justify-end items-center">
          <svg
            class="cursor-pointer"
            @click="toggleCart"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
          >
            <g fill="#e4c1f9" fill-rule="evenodd">
              <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
              <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
            </g>
          </svg>
        </div>
        <!-- <div v-if="cart == ''" -->
        <div
          class="font-EdGaramond text-4xl flex flex-col gap-16 p-10 justify-center items-center"
        >
          <p>Your cart is empty :(</p>
          <img class="w-2/4" src="../assets/bag (1).png" />
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>
