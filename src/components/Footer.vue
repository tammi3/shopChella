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
      loadingfooter: true,
    };
  },
  created() {
    this.infoHeaders = [];
    const q = query(collection(db, "shopchella_information"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.infoHeaders.push({
          title: doc.data().title,
          id: doc.id,
        });
      });
    });
    setTimeout(() => {
      this.loadingfooter = false;
    }, 2000);
  },
};
</script>

<template>
  <div v-if="loadingfooter">
    <div class="w-full h-20 animate-pulse bg-gray-700"></div>
  </div>
  <section v-show="!loadingfooter" class="mx-auto p-10 bg-black text-white w-full">
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
    </div>
  </section>
</template>
