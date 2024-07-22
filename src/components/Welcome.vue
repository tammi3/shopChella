<script></script>

<template>
  <div class="bg-purple">
    <div
      class="container mx-auto px-4 py-20 flex flex-col-reverse lg:flex-row items-center justify-center"
    >
      <!-- Text Section -->
      <div
        class="w-full lg:w-1/2 text-center flex flex-col justify-center items-center gap-20"
      >
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

      <!-- Image Section -->
      <div class="w-full lg:w-1/2 flex justify-center">
        <img
          src="../assets/online-shopping.png"
          alt="Shopping Illustration"
          class="w-2/3 lg:w-full"
        />
      </div>
    </div>
  </div>
</template>
