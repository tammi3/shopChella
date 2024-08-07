<script>
import AppFooter from "../components/Footer.vue";
export default {
  components: {
    AppFooter,
  },
};
</script>
<template>
  <div
    class="flex w-full gap-4 lg:flex-row justify-center items-center lg:items-start font-Ubuntu"
  >
    <div class="hidden lg:block w-2/4 gap-4 p-10 font-semibold relative">
      <div class="h-dvh left-0 top-0 absolute">
        <img
          class="w-full h-full object-cover"
          src="../assets/cq5dam.web.hE7E3DA.1000.1000.avif"
          alt=""
        />
      </div>
      <div
        class="top-10 z-20 text-black left-0 absolute text-3xl font-bold w-2/4 h-full p-10"
      >
        <p class="max-w-sm break-normal break-words uppercase">MIU MIU</p>
      </div>
    </div>
    <div
      class="flex flex-col justify-center items-center space-y-10 p-10 w-full lg:w-2/4"
    >
      <div class="w-full flex justify-center items-center gap-4 font-semibold">
        <router-link
          activeClass="bg-black text-white hover:shadow-black/60 border-black"
          class="w-44 h-16 rounded-xl hover:translate-x-0 hover:-translate-y-2 z-10 hover:shadow-lg transform duration-200 ease-in-out border-2 hover:shadow-gray-500 border-gray-900 p-4 justify-center items-center flex"
          to="/User/signup"
          >Sign up</router-link
        >

        <router-link
          to="/User/login"
          activeClass="bg-black text-white hover:shadow-black/60 border-black"
          class="w-44 h-16 rounded-xl hover:translate-x-0 hover:-translate-y-2 z-10 hover:shadow-lg transform duration-200 ease-in-out border-2 hover:shadow-gray-500 border-gray-900 p-4 justify-center items-center flex"
          >Log in</router-link
        >
      </div>
      <router-view class="max-w-xl z-10"></router-view>
    </div>
  </div>
</template>
