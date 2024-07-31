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
    });
  },
};
</script>

<template>
  <section class="mx-auto p-10 bg-black text-white">
    <div class="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      <!-- Categories -->
      <div v-for="info in infoHeaders">
        <routerLink
          activeClass="text-gray-500"
          :to="'/information/' + info.id"
          class="font-Ubuntu uppercase font-medium text-md tracking-wider hover:text-gray-400"
          >{{ info.title }}
        </routerLink>
      </div>
      <div>
        <router-link
          activeClass="text-gray-500"
          class="font-Ubuntu uppercase font-medium text-md tracking-wider hover:text-gray-400"
          to="/Information/Tracking"
          >Tracking Package</router-link
        >
      </div>
      <ul class="flex gap-4">
        <i
          class="fa hover:text-gray-400 cursor-pointer fa-lg fa-envelope"
          aria-hidden="true"
        ></i>
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

      <!-- Information -->
      <!-- <div class="flex flex-col gap-3">
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
      </div> -->

      <!-- Contact -->
      <!-- <div class="flex flex-col gap-3">
        <p class="font-Ubuntu uppercase font-medium text-lg tracking-wider">Contact</p>
        <div class="flex gap-2 hover:text-gray-400 cursor-pointer items-center">
         
          <p class="font-EdGaramond text-lg">contactcenter@shopchella.ng.com</p>
        </div>
        <ul class="flex gap-4">
          <i class="fa hover:text-gray-400 cursor-pointer fa-lg fa-envelope" aria-hidden="true"></i>
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
      </div> -->
    </div>
  </section>
</template>
