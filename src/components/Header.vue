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
  signOut,
} from "../db/firebase.js";

export default {
  data() {
    return {
      userInfo: {},
      cart: {},
      search: "",
      cartDisplay: "",
      loadingHeader: true,
      updatedProfileImage: true,
      isBurgerMenuVisible: false,
      isProfileMenuVisible: false,
    };
  },
  props: ["categories"],
  watch: {
    $route: {
      handler(to, from) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (this.isBurgerMenuVisible) {
          this.toggleMenu();
        }
        if (this.isProfiileMenuVisible) {
          this.toggleProfileMenu();
        }
        if (from.path.startsWith("/User")) {
          this.getUserInfo();
          this.getCart();
        }
        if (to.path.startsWith("/User")) {
          this.updatedProfileImage = true;
          this.getUserInfo();
          this.getCart();
        }
      },
    },
  },
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
    toggleProfileMenu() {
      const profileMenu = document.getElementById("profile-menu");
      const profileMenuBg = document.getElementById("profile-menu-bg");
      if (profileMenu.classList.contains("hidden")) {
        profileMenu.classList.remove("hidden");
        profileMenu.classList.add("flex");
        profileMenuBg.classList.remove("hidden");
        this.isProfiileMenuVisible = true;
      } else {
        profileMenu.classList.add("hidden");
        profileMenuBg.classList.add("hidden");

        profileMenu.classList.remove("flex");
        this.isProfiileMenuVisible = false;
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
      });
    },
    getProfileImg() {
      const user = auth.currentUser;
      if (user && this.userInfo.updatedProfileImage) {
        this.updatedProfileImage = false;
        getDownloadURL(ref(storage, "profile/" + this.userInfo.profile_image))
          .then((url) => {
            // Or inserted into an <img> element
            const img = document.getElementById("profile");
            img.setAttribute("src", url);
          })
          .catch((error) => { });
      } else {
        this.updatedProfileImage = true;
      }
    },
    getUserInfo() {
      const user = auth.currentUser;

      if (user) {
        this.getCart();
        onSnapshot(doc(db, "users", user.uid), (doc) => {
          this.userInfo = doc.data();
          this.getProfileImg();
        });
      } else {
        this.userInfo = "";
      }
    },
    logOut() {
      signOut(auth)
        .then(() => {
          this.$router.replace({ name: "Login" });
        })
        .catch((err) => {
          // console.log(err.message);
        });
    },
    toggleMenu() {
      const navLinks = document.getElementById("nav-links");
      const navLinksBg = document.getElementById("nav-links-bg");
      if (navLinks.classList.contains("hidden")) {
        navLinks.classList.remove("hidden");
        navLinks.classList.add("absolute");
        navLinksBg.classList.remove("hidden");
        navLinks.classList.add("flex");
        this.isBurgerMenuVisible = true;
      } else {
        navLinks.classList.add("hidden");
        navLinksBg.classList.add("hidden");
        navLinks.classList.remove("flex");
        navLinks.classList.remove("absolute");
        this.isBurgerMenuVisible = false;
      }
    },
  },
  created() {
    this.getUserInfo();
    this.getCart();
    setTimeout(() => {
      this.loadingHeader = false;
    }, 1000);
  },
};
</script>
<template>
  <div class="sticky top-0 w-full z-50 border-solid border-b">
    <div v-if="loadingHeader">
      <div class="w-full h-12 animate-pulse bg-gray-300"></div>
    </div>
    <nav v-show="!loadingHeader" class="font-Ubuntu bg-white">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <!-- Brand Name -->

        <RouterLink class="font-Anton text-2xl font-bold text-gray-800" to="/">shopChella</RouterLink>

        <!-- Navigation Links -->
        <div id="nav-links"
          class="hidden lg:flex flex-col space-y-10 lg:space-y-0 z-10 h-dvh lg:h-0 bg-white lg:bg-inherit top-0 py-10 px-4 lg:p-0 w-3/4 right-0 text-lg justify-start items-start lg:justify-center lg:items-center lg:flex-row lg:space-x-6 uppercase lg:text-sm">
          <div class="w-full flex lg:hidden justify-end items-center">
            <svg class="cursor-pointer" @click="toggleMenu" xmlns="http://www.w3.org/2000/svg" width="20" height="21">
              <g fill="#000000" fill-rule="evenodd">
                <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
                <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
              </g>
            </svg>
          </div>

          <routerLink activeClass="border-2 shadow-md shadow-gray-300 border-gray-400 rounded-md  p-2"
            v-for="cat in categories" :key="cat" :to="'/shop/' + cat"
            class="text-gray-700 font-bold hover:text-gray-900">
            {{ cat }}
          </routerLink>
        </div>
        <div id="nav-links-bg" @click="toggleMenu" class="absolute hidden inset-0 h-dvh backdrop-blur-sm"></div>

        <!-- Icons and Dropdown -->
        <div class="flex items-center space-x-4">
          <!-- Cart Icon -->
          <div @click="toggleCart" class="relative cursor-pointer">
            <svg id="cart" class="opacity-80 hover:opacity-60" width="30px" height="30px" viewBox="0 0 24 24"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 11V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10.9673M10.4 21H13.6C15.8402 21 16.9603 21 17.816 20.564C18.5686 20.1805 19.1805 19.5686 19.564 18.816C20 17.9603 20 16.8402 20 14.6V12.2C20 11.0799 20 10.5198 19.782 10.092C19.5903 9.71569 19.2843 9.40973 18.908 9.21799C18.4802 9 17.9201 9 16.8 9H7.2C6.0799 9 5.51984 9 5.09202 9.21799C4.71569 9.40973 4.40973 9.71569 4.21799 10.092C4 10.5198 4 11.0799 4 12.2V14.6C4 16.8402 4 17.9603 4.43597 18.816C4.81947 19.5686 5.43139 20.1805 6.18404 20.564C7.03968 21 8.15979 21 10.4 21Z"
                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{{
                Object.keys(cart).length }}</span>
          </div>

          <!-- Profile Dropdown -->
          <div class="relative lg:pr-4">
            <button @click="toggleProfileMenu" class="flex items-center focus:outline-none">
              <i v-if="updatedProfileImage" class="fa fa-user-o fa-2x" aria-hidden="true"></i>
              <!-- custom profile image -->
              <img v-show="!updatedProfileImage" id="profile" class="w-10 h-10 rounded-full" src="" alt="" />
            </button>
            <div id="profile-menu"
              class="absolute top-[50px] right-0 z-10 bg-white p-4 rounded-sm shadow-gray-400 shadow-md hidden flex-col space-y-3 uppercase">
              <div v-if="userInfo == ''" class="w-full flex flex-col space-y-2">
                <router-link to="/User/login"
                  activeClass="border-2 shadow-md shadow-gray-300 border-gray-400 rounded-md  p-2 "
                  class="text-gray-700 font-bold hover:border-2 hover:rounded-md hover:border-gray-300 p-2 w-20">Log in
                </router-link>
                <router-link to="/User/signup"
                  activeClass="border-2 shadow-md shadow-gray-300 border-gray-400 rounded-md  p-2 "
                  class="text-gray-700 font-bold hover:border-2 hover:rounded-md hover:border-gray-300 p-2 w-24">sign up
                </router-link>
              </div>

              <div v-if="userInfo != ''" class="w-full flex flex-col space-y-2">
                <router-link to="/Profile"
                  activeClass="border-2 shadow-md shadow-gray-300 border-gray-400 rounded-md  p-2 "
                  class="text-gray-700 font-bold hover:border-2 hover:rounded-md hover:border-gray-300 p-2">Profile
                </router-link>
                <routerLink v-if="userInfo.isAdmin"
                  activeClass="border-2 shadow-md shadow-gray-300 border-gray-400 rounded-md  p-2 "
                  class="text-gray-700 font-bold hover:border-2 hover:rounded-md hover:border-gray-300 p-2"
                  to="/Admin/Products">
                  Admin
                </routerLink>
                <router-link to="/OrdersHistory"
                  activeClass="border-2 shadow-md shadow-gray-300 border-gray-400 rounded-md  p-2 "
                  class="text-gray-700 font-bold hover:border-2 hover:rounded-md hover:border-gray-300 p-2">Orders
                </router-link>
                <div
                  class="text-gray-700 cursor-pointer font-bold hover:border-2 hover:rounded-md hover:border-gray-300 p-2"
                  @click="logOut">
                  Logout
                </div>
              </div>
            </div>
          </div>
          <div id="profile-menu-bg" @click="toggleProfileMenu"
            class="absolute hidden inset-0 h-dvh bg-grey-100 opacity-5"></div>

          <div @click="toggleMenu" class="block lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21">
              <g fill="#000000" fill-rule="evenodd">
                <path d="M0 0h24v3H0zM0 9h24v3H0zM0 18h24v3H0z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </nav>

    <div id="cartDisplay"
      class="w-full right-0 font-Ubuntu h-screen absolute hidden justify-end top-0 backdrop-blur-lg z-50">
      <div class="w-full lg:w-2/4 bg-white z-50 h-screen flex flex-col">
        <div class="w-full p-10 flex justify-end items-center">
          <svg class="cursor-pointer" @click="toggleCart" xmlns="http://www.w3.org/2000/svg" width="20" height="21">
            <g fill="#000000" fill-rule="evenodd">
              <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
              <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
            </g>
          </svg>
        </div>

        <div v-if="cart == ''" class="w-full text-4xl flex flex-col font-semibold p-10 justify-center items-center">
          <p>Your cart is empty :(</p>
        </div>
        <div v-else>
          <div class="w-full mx-auto h-dvh bg-white">
            <div class="px-4 py-2">
              <h1 class="text-black text-3xl font-semibold uppercase">Cart</h1>
            </div>
            <div class="max-h-[400px] overflow-y-auto">
              <div v-for="(product, index) in cart" :key="index" class="p-4 flex items-center border-b">
                <img class="w-16 h-16 object-fit rounded" :src="product.product_image" alt="Product Image" />
                <div class="ml-4 flex-1 font-medium">
                  <h3 class="text-gray-800 text-xl font-semibold">
                    {{ product.product_name }}
                  </h3>
                  <p class="text-gray-600 text-md">${{ product.price }}</p>
                  <p class="text-gray-600 text-md">Quantity: {{ product.quantity }}</p>
                  <p class="text-gray-600 text-md">Total: ${{ product.total_price }}</p>
                </div>
                <i @click="deleteFromCart(index)" class="p-2 fa fa-trash-o fa-lg cursor-pointer hover:text-gray-400"
                  aria-hidden="true"></i>
              </div>
            </div>
            <div class="px-4 py-2">
              <RouterLink to="/Checkout" @click="toggleCart"
                class="w-full uppercase font-bold bg-black flex focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 items-center justify-center hover:bg-black/60 text-white px-4 py-2 rounded">
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
