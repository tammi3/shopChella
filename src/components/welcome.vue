<script>
import { RouterLink } from 'vue-router'


export default {
}
</script>

<template>
    <div class="flex p-32 bg-purple w-full items-center gap-10">
        <div class="w-2/4 flex flex-col gap-12">
            <p class="text-6xl font-EdGaramond font-bold ">Your Ultimate Shopping Destination!</p>
            <p class="text-xl uppercase font-Ubuntu font-medium ">shop smart. shop easy, shop at <span
                    class="font-Anton lowercase tracking-wide">shopChella</span>.</p>
            <router-link to="/Shop"
                class="bg-rosePink w-48 h-20 flex justify-center items-center rounded-full text-lg font-semiBold tracking-wider font-Ubuntu ">
                Explore</router-link>

        </div>
        <div class="w-2/4">
            <img class="w-3/4" src="../assets/online-shopping.png" alt="">
        </div>

    </div>
</template>
