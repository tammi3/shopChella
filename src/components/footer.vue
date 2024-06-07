<script>
import { RouterLink } from 'vue-router'

export default {
    props: ['categories']
};
</script>

<template>
    <div class="flex w-full p-32 gap-5">
        <!-- About -->
        <div class="flex flex-col w-1/4 gap-3">
            <p class="text-xl uppercase font-Ubuntu font-medium ">shop smart. shop easy. shop at <span
                    class="font-Anton lowercase tracking-wide">shopChella</span>.</p>
            <div class="flex gap-3">
                <img class="w-8" src="../assets/card (2).png" alt="">
                <img class="w-8" src="../assets/card.png" alt="">
                <img class="w-8" src="../assets/card (1).png" alt="">
                <img class="w-8" src="../assets/american-express.png" alt="">
                <img class="w-8" src="../assets/discover.png" alt="">
            </div>
        </div>
        <!-- Categories -->
        <div class="flex flex-col w-1/4 gap-3">
            <p class="font-Ubuntu uppercase font-medium text-lg tracking-wider">Categories</p>
            <ul class="capitalize font-EdGaramond text-lg tracking-wider flex flex-col gap-2">
                <li class="hover:text-gray-400 cursor-pointer" v-for="category in categories">{{ category }}</li>
            </ul>
        </div>
        <!-- Information -->
        <div class="flex flex-col w-1/4 gap-3">
            <p class="font-Ubuntu uppercase font-medium text-lg tracking-wider">Information</p>
            <ul class="capitalize font-EdGaramond tracking-wider text-lg flex flex-col gap-2">
                <li class="hover:text-gray-400 cursor-pointer">Terms & Conditions</li>
                <li class="hover:text-gray-400 cursor-pointer">Returns & Exchange</li>
                <li class="hover:text-gray-400 cursor-pointer">Shipping & Delivery</li>
            </ul>
        </div>
        <!-- Contact -->
        <div class="flex flex-col w-1/4 gap-3">
            <p class="font-Ubuntu uppercase font-medium text-lg tracking-wider">Contact</p>
            <div class="flex gap-2 hover:text-gray-400 cursor-pointer items-center">
                <i class="fa fa-lg fa-envelope" aria-hidden="true"></i>
                <p class=" font-EdGaramond text-lg">contactcenter@shopchella.ng.com</p>
            </div>
            <ul class="flex gap-4">
                <i class="fa hover:text-gray-400 cursor-pointer fa-lg fa-twitter" aria-hidden="true"></i>
                <i class="fa hover:text-gray-400 cursor-pointer fa-lg fa-facebook" aria-hidden="true"></i>
                <i class="fa hover:text-gray-400 cursor-pointer fa-lg fa-instagram" aria-hidden="true"></i>
                <i class="fa hover:text-gray-400 cursor-pointer fa-lg fa-pinterest" aria-hidden="true"></i>
            </ul>
        </div>

    </div>
</template>