<script>
import { RouterLink } from 'vue-router'


export default {
}
</script>

<template>
    <div class="flex p-32 bg-purple w-full items-center gap-10">
        <div class="w-2/4 flex flex-col gap-20">
           <div class="flex flex-col gap-12">
            <p class="text-6xl font-EdGaramond font-bold ">Your Ultimate Shopping Destination!</p>
            <p class="text-xl uppercase font-Ubuntu font-medium ">shop smart. shop easy, shop at <span
                    class="font-Anton lowercase tracking-wide">shopChella</span>.</p>
           </div>
            <router-link to="/Shop/categories"
                class="bg-rosePink hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-rosePink/75 transform duration-200 ease-in-out w-60 uppercase h-16 flex justify-center items-center rounded-xl text-lg text-gray-700/75 font-bold tracking-wider font-Ubuntu ">
                Explore</router-link>

        </div>
        <div class="w-2/4">
            <img class="w-3/4" src="../assets/online-shopping.png" alt="">
        </div>

    </div>
</template>
