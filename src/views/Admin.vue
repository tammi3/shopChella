<script>
export default {
  props: ["categories"],
};
</script>
<template>
  <div class="relative">
    <div
      class="sticky top-14 w-full z-20 border-solid border-b flex items-center justify-center gap-4 bg-white py-2 font-Ubuntu font-semibold uppercase"
    >
      <router-link
        activeClass="bg-black text-white hover:shadow-black/60 border-black"
        class="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 w-32 h-8 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border hover:shadow-gray-50060 border-gray-500 p-4 justify-center items-center flex"
        to="/Admin/Products"
      >
        Products</router-link
      >
      <router-link
        activeClass="bg-black text-white hover:shadow-black/60 border-black"
        class="focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 w-32 h-8 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-gray-500/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
        to="/Admin/Orders"
      >
        Orders</router-link
      >
    </div>
    <router-view :categories="categories"></router-view>
  </div>
</template>
