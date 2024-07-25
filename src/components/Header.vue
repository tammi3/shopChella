<script>
import {
  db,
  auth,
  getDownloadURL,
  onSnapshot,
  doc,
  ref,
  storage,
  getDocs,
  query,
  collection,
  updateDoc,
  arrayRemove,
  Timestamp,
} from "../db/firebase.js";
import { Drawer } from "flowbite";

export default {
  data() {
    return {
      userInfo: {},
      cart: {},
      search: "",
      cartDisplay: "",
      updatedProfileImage: true,
    };
  },
  props: ["categories"],
  methods: {
    toggleCart() {
      this.cartDisplay = document.querySelector("#cartDisplay");

      if (this.cartDisplay.classList.contains("hidden")) {
        this.cartDisplay.classList.remove("hidden");
        this.cartDisplay.classList.add("flex");
        this.getCart();
      } else {
        this.cartDisplay.classList.add("hidden");
        this.cartDisplay.classList.remove("flex");
      }
    },
    getCart() {
      const user = auth.currentUser;
      if (user) {
        onSnapshot(doc(db, "carts", user.uid), (doc) => {
          if (doc.data().items.length == 0) {
            this.cart = "";
          } else {
            this.cart = {
              ...doc.data().items,
            };
          }
        });
      } else {
        this.cart = "";
      }
    },
    async deleteFromCart(index) {
      const user = auth.currentUser;
      const item = this.cart[index];
      await updateDoc(doc(db, "carts", user.uid), {
        items: arrayRemove(item),
        updated_at: Timestamp.fromDate(new Date()),
      }).then(() => {
        console.log("deleted to cart");
      });
    },
    getProfileImg() {
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
    },
    menuToggle() {
      // set the drawer menu element
      const $targetEl = document.getElementById("drawer-navigation");

      // options with default values
      const options = {
        placement: "right",
        backdrop: true,
        bodyScrolling: false,
        edge: false,
        edgeOffset: "",
        backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
        onHide: () => {
          console.log("drawer is hidden");
        },
        onShow: () => {
          console.log("drawer is shown");
        },
        onToggle: () => {
          console.log("drawer has been toggled");
        },
      };

      // instance options object
      const instanceOptions = {
        id: "drawer-js-example",
        override: true,
      };
      const drawer = new Drawer($targetEl, options, instanceOptions);
      drawer.toggle();
    },
  },
  created() {
    const user = auth.currentUser;
    if (user) {
      this.getCart();
      onSnapshot(doc(db, "users", user.uid), (doc) => {
        this.userInfo = doc.data();
        this.getProfileImg();
      });
    }
  },
};
</script>
<template>
  <div class="sticky top-0 w-full z-50 border-solid border-b">
    <nav class="font-Ubuntu bg-white">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <!-- Brand Name -->

        <RouterLink class="font-Anton text-2xl font-bold text-gray-800" to="/"
          >shopChella</RouterLink
        >

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-6 uppercase text-sm">
          <routerLink
            activeClass=""
            v-for="cat in categories"
            :to="'/shop/' + cat"
            class="text-gray-700 font-bold hover:text-gray-900"
          >
            {{ cat }}
          </routerLink>
        </div>

        <!-- Icons and Dropdown -->
        <div class="flex items-center space-x-4">
          <!-- Cart Icon -->
          <div @click="toggleCart" class="relative cursor-pointer">
            <svg
              id="cart"
              class="opacity-80 hover:opacity-60"
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
            <span
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
              >{{ Object.keys(cart).length }}</span
            >
          </div>

          <!-- Profile Dropdown -->
          <router-link to="/Profile" class="relative dropdown">
            <button class="flex items-center focus:outline-none">
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
            </button>
          </router-link>
        </div>
      </div>
    </nav>

    <div
      id="cartDisplay"
      class="w-full right-0 font-Ubuntu h-screen absolute hidden justify-end top-0 backdrop-blur-lg z-50"
    >
      <div class="w-full lg:w-2/4 bg-white z-50 h-screen flex flex-col">
        <div class="w-full p-10 flex justify-end items-center">
          <svg
            class="cursor-pointer"
            @click="toggleCart"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
          >
            <g fill="#000000" fill-rule="evenodd">
              <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
              <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
            </g>
          </svg>
        </div>

        <div
          v-if="cart == ''"
          class="w-full text-4xl flex flex-col gap-16 p-10 justify-center items-center"
        >
          <p>Your cart is empty :(</p>
          <img class="w-2/4" src="../assets/bag (1).png" />
        </div>
        <div v-else>
          <div class="w-full mx-auto h-dvh bg-white">
            <div class="px-4 py-2">
              <h1 class="text-black text-3xl font-semibold">Cart</h1>
            </div>
            <div class="max-h-[400px] sm:max-h-[500px] overflow-y-auto">
              <div
                v-for="(product, index) in cart"
                :key="index"
                class="p-4 flex items-center border-b"
              >
                <img
                  class="w-16 h-16 object-fit rounded"
                  :src="product.product_image"
                  alt="Product Image"
                />
                <div class="ml-4 flex-1">
                  <h3 class="text-gray-800 text-xl">
                    {{ product.product_name }}
                  </h3>
                  <p class="text-gray-600">${{ product.price }}</p>
                  <p class="text-gray-600">Quantity: {{ product.quantity }}</p>
                  <p class="text-gray-600">Total: ${{ product.total_price }}</p>
                </div>
                <i
                  @click="deleteFromCart(index)"
                  class="p-2 fa fa-trash-o fa-lg cursor-pointer hover:text-gray-400"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
            <div class="px-4 py-2">
              <RouterLink
                to="/Checkout"
                @click="toggleCart"
                class="w-full uppercase font-bold bg-black flex items-center justify-center hover:bg-black/60 text-white px-4 py-2 rounded"
              >
                <span> Checkout</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>
<style>
/* Additional styles for dropdown functionality */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
