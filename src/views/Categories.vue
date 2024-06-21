<script>
import axios from "axios"
import searchMixin from "@/mixins/searchMixin"
export default {
    mixins: [searchMixin],
    props: ['category'],
    data() {
        return {
            products: [],
            search:''
        }
    },
    methods: {

    },
    created() {

    
        if (this.category == 'all') {
            axios.get('https://fakestoreapi.com/products').then((data) => {
                this.products = data.data;

            });
        } else {
            axios.get('https://fakestoreapi.com/products/category/' + this.category).then((data) => {
                this.products = data.data;

            });
        }
    },
}
</script>
<template>
    <div class="pl-410 pr-10 py-20 flex flex-col gap-10">
        <div class="w-96 h-10 relative bg-purple/50 rounded-lg">
            <input v-model="search" class="focus:outline-none absolute bg-transparent top-0 left-0 h-full w-full pr-2 pl-12  text-black"
                type="text" placeholder="Search products" />
            <svg class="absolute top-1 left-3 flex justify-center items-center pr-3" width="30px" height="30px"
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                    stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

        </div>
        <div class=" w-full justify-center grid grid-cols-4 gap-10">

            <div class="flex flex-col justify-end items-center border border-gray-400 border-solid shadow-md"
                v-for="product in filteredProducts">
                <router-link class="  flex items-center" :to="'/Product/' + product.id"><img
                        class="w-56 object-fit py-4" :src="product.image" alt=""></router-link>

                <div class="p-4 flex flex-col gap-3 w-full border-t border-gray-400">
                    <router-link :to="'/Product/' + product.id" class="font-semibold text-md uppercase font-Ubuntu">{{
                        product.title }}</router-link>
                    <div class="flex justify-end w-full"> <span
                            class=" text-gray-700 w-32 h-10 bg-purple hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out rounded-lg text-sm flex justify-center items-center cursor-pointer">${{
                                product.price }}</span></div>
                </div>
            </div>
        </div>
    </div>

</template>