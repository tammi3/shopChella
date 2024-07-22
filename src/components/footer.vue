<script>
import {
  db,
  query,
  doc,
  onSnapshot,
  collection,
  Timestamp,
  updateDoc,
  getDocs,
} from "../db/firebase.js";
export default {
  props: ["categories"],
  data() {
    return {
      infoHeaders: [],
    };
  },
  created() {
    const q = query(collection(db, "shopchella_information"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.infoHeaders.push({
          title: doc.data().title,
          id: doc.id,
        });
      });
      console.log(this.infoHeaders);
    });
  },
};
</script>

<template>
  <div class="flex flex-col lg:flex-row w-full p-10 gap-5">
    <!-- About -->
    <div class="flex flex-col lg:w-1/4 gap-3">
      <p class="text-xl uppercase font-Ubuntu font-medium">
        shop smart. shop easy. shop at
        <span class="font-Anton lowercase tracking-wide">shopChella</span>.
      </p>
      <div class="flex gap-3">
        <img class="w-8" src="../assets/card (2).png" alt="" />
        <img class="w-8" src="../assets/card.png" alt="" />
        <img class="w-8" src="../assets/card (1).png" alt="" />
        <img class="w-8" src="../assets/american-express.png" alt="" />
        <img class="w-8" src="../assets/discover.png" alt="" />
      </div>
    </div>

    <!-- Categories -->
    <div class="flex flex-col lg:w-1/4 gap-3">
      <routerLink
        to="/Shop/allcategories"
        class="font-Ubuntu uppercase font-medium text-lg tracking-wider"
        >Categories</routerLink
      >
      <ul class="capitalize font-EdGaramond text-lg tracking-wider flex flex-col gap-2">
        <routerLink
          :to="'/Shop/' + cat"
          class="hover:text-gray-400 cursor-pointer"
          v-for="cat in categories"
        >
          {{ cat }}
        </routerLink>
      </ul>
    </div>

    <!-- Information -->
    <div class="flex flex-col lg:w-1/4 gap-3">
      <routerLink
        to="/Information"
        class="font-Ubuntu uppercase font-medium text-lg tracking-wider"
        >Information</routerLink
      >
      <ul class="capitalize font-EdGaramond tracking-wider text-lg flex flex-col gap-2">
        <router-link
          :to="'/Information/' + info.id"
          v-for="info in infoHeaders"
          class="hover:text-gray-400 cursor-pointer"
          >{{ info.title }}</router-link
        >

        <router-link class="hover:text-gray-400 cursor-pointer" to="/Tracking"
          >Tracking Package</router-link
        >
      </ul>
    </div>

    <!-- Contact -->
    <div class="flex flex-col lg:w-1/4 gap-3">
      <p class="font-Ubuntu uppercase font-medium text-lg tracking-wider">Contact</p>
      <div class="flex gap-2 hover:text-gray-400 cursor-pointer items-center">
        <i class="fa fa-lg fa-envelope" aria-hidden="true"></i>
        <p class="font-EdGaramond text-lg">contactcenter@shopchella.ng.com</p>
      </div>
      <ul class="flex gap-4">
        <i
          class="fa hover:text-gray-400 cursor-pointer fa-lg fa-twitter"
          aria-hidden="true"
        ></i>
        <i
          class="fa hover:text-gray-400 cursor-pointer fa-lg fa-facebook"
          aria-hidden="true"
        ></i>
        <i
          class="fa hover:text-gray-400 cursor-pointer fa-lg fa-instagram"
          aria-hidden="true"
        ></i>
        <i
          class="fa hover:text-gray-400 cursor-pointer fa-lg fa-pinterest"
          aria-hidden="true"
        ></i>
      </ul>
    </div>
  </div>
</template>
