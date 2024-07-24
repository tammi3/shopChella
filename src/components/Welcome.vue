<script>
import { doc, db, onSnapshot } from "../db/firebase.js";

export default {
  data() {
    return {
      images: {},
    };
  },
  created() {
    const unsub = onSnapshot(doc(db, "page_images", "landing"), (doc) => {
      this.images = doc.data();
      console.log(this.images.welcome);
    });
  },
};
</script>

<template>
  <div class="relative h-dvh">
    <img class="absolute object-cover h-dvh w-full" :src="images.welcome" alt="" />
    <div class="container mx-auto px-4 py-20 flex items-end justify-center">
      <!-- Text Section -->
      <!-- <div class="w-full z-10 flex flex-col justify-center items-center gap-20">
        <div class="flex flex-col gap-12">
          <p class="text-4xl xl:text-6xl font-EdGaramond font-bold">
            Your Ultimate Shopping Destination!
          </p>
          <p class="text-xl uppercase font-Ubuntu font-medium">
            shop smart. shop easy, shop at
            <span class="font-Anton lowercase tracking-wide">shopChella</span>.
          </p>
        </div> -->
      <router-link
        to="/Shop/allcategories"
        class="bg-white hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-white/75 transform duration-200 ease-in-out w-60 uppercase h-16 flex justify-center items-center rounded-xl text-lg text-black font-bold tracking-wider font-Ubuntu"
      >
        Explore</router-link
      >
      <!-- </div> -->

      <!-- Image Section -->
      <!-- <div class="w-full lg:w-1/2 flex justify-center">
        <img
          src="../assets/online-shopping.png"
          alt="Shopping Illustration"
          class="w-2/3 lg:w-full"
        />
      </div> -->
    </div>
  </div>
  <div>
    <div class="flex flex-col lg:flex-row px-10 py-20 gap-10">
      <div class="lg:w-1/3 flex flex-col justify-start items-center gap-6">
        <img class="w-2/4" src="../assets/customer-service.png" alt="" />
        <div class="w-full flex flex-col justify-start text-center items-center">
          <p class="font-Ubuntu font-black text-3xl tracking-wide uppercase">
            24/7 Customer Support
          </p>
          <img src="" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
