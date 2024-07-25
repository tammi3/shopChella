<template>
  <div class="flex flex-col gap-4 lg:flex-row p-10 font-Ubuntu ">

    <div class="w-full lg:max-w-md flex justify-center items-start gap-4 font-semibold">

      <router-link activeClass="bg-black text-white hover:shadow-black/60 border-black"
        class="w-44 h-16 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border hover:shadow-gray-50060 border-gray-500 p-4 justify-center items-center flex"
        to="/User/signup">Sign up</router-link>

      <router-link to="/User/login" activeClass="bg-black text-white hover:shadow-black/60 border-black"
        class="w-44 h-16 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border hover:shadow-gray-50060 border-gray-500 p-4 justify-center items-center flex">Log
        in</router-link>
    </div>



    <router-view></router-view>
  </div>
</template>
