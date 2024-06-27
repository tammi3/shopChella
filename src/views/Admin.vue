<script></script>
<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="w-full p-4 flex justify-center items-center gap-4 font-semibold">
      <router-link
        class="cursor-pointer w-44 h-16 rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-gray-500/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
        to="/Admin/adminProducts"
        >Products</router-link
      >

      <router-link
        to="/Admin/adminCats"
        class="cursor-pointer w-44 h-16 bg-purple rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
        >Categories</router-link
      >
    </div>
   <router-view></router-view>
  </div>
</template>
