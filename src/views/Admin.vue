<template>
  <div class="relative">
    <div
      class="sticky top-20 w-full z-50 border-solid border-b flex items-center justify-center gap-4 backdrop-blur-lg py-4 font-Ubuntu font-semibold uppercase"
    >
      <router-link
        activeClass="bg-purple hover:shadow-purple/75 border-purple"
        class="w-40 h-10 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border hover:shadow-gray-500/75 border-gray-500 p-4 justify-center items-center flex"
        to="/Admin/Products"
      >
        Products</router-link
      >
      <router-link
        activeClass="bg-purple hover:shadow-purple/75 border-purple"
        class="cursor-pointer w-40 h-10 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-gray-500/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
        to="/Admin/Orders"
      >
        Orders</router-link
      >
    </div>
    <router-view></router-view>
  </div>
</template>
