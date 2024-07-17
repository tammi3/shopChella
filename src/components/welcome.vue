<script>
import { RouterLink } from "vue-router";

export default {};
</script>

<template>
  <div class="bg-purple">
    <div
      class="container mx-auto px-4 py-20 flex flex-col-reverse md:flex-row items-center justify-center"
    >
      <!-- Text Section -->
      <div class="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
        <h1 class="text-4xl md:text-5xl font-EdGaramond font-bold text-gray-800 mb-4">
          Your Ultimate Shopping Destination!
        </h1>
        <p class="text-gray-600 mb-6">
          SHOP SMART. SHOP EASY, SHOP AT <span class="font-bold">shopchella.</span>
        </p>
        <router-link
          to="/Shop/allcategories"
          class="bg-rosePink hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-rosePink/75 transform duration-200 ease-in-out w-60 uppercase h-16 flex justify-center items-center rounded-xl text-lg text-gray-700/75 font-bold tracking-wider font-Ubuntu"
        >
          Explore</router-link
        >
      </div>

      <!-- Image Section -->
      <div class="w-full md:w-1/2 flex justify-center">
        <img
          src="../assets/online-shopping.png"
          alt="Shopping Illustration"
          class="w-2/3 md:w-full"
        />
      </div>
    </div>
    <!-- <div class="w-2/4 flex flex-col gap-20">
      <div class="flex flex-col gap-12">
        <p class="text-4xl xl:text-6xl font-EdGaramond font-bold">
          Your Ultimate Shopping Destination!
        </p>
        <p class="text-xl uppercase font-Ubuntu font-medium">
          shop smart. shop easy, shop at
          <span class="font-Anton lowercase tracking-wide">shopChella</span>.
        </p>
      </div>
      <router-link
        to="/Shop/allcategories"
        class="bg-rosePink hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-rosePink/75 transform duration-200 ease-in-out w-60 uppercase h-16 flex justify-center items-center rounded-xl text-lg text-gray-700/75 font-bold tracking-wider font-Ubuntu"
      >
        Explore</router-link
      >
    </div>
    <div class="w-2/4 flex justify-center items-center">
      <img class="" src="../assets/online-shopping.png" alt="" />
    </div> -->
  </div>
</template>
