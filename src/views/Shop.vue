<script>
import axios from "axios"
import searchMixin from "@/mixins/searchMixin"
export default {
    mixins: [searchMixin],
    props: ['categories'],
    data() {
        return {
            products: [],
            search: '',
        }
    },
    methods: {
      
    },
    created() {

        axios.get('https://fakestoreapi.com/products').then((data) => {
            this.products = data.data;
            console.log(this.products);

        });
    },

}
</script>

<template>
    <div class="flex  gap-10">
        <div class="flex flex-col w-96 gap-4 fixed right-auto h-screen bg-purple px-8 py-10">

            <p class="font-Ubuntu uppercase font-medium text-2xl tracking-wider">Categories</p>
            <ul class="capitalize font-EdGaramond text-xl tracking-wider flex flex-col gap-3 pl-3">
                <li class="hover:text-gray-500 cursor-pointer" v-for="category in categories">{{ category }}</li>
            </ul>

        </div>
        <div class="pl-410 pr-10 py-20 flex flex-col gap-10">
            <div class="w-96 h-10 relative bg-purple/50 rounded-lg">
                <input
                   v-model="search"  class="absolute bg-transparent top-0 left-0 h-full w-full pr-2 pl-12  text-black" type="text"
                    placeholder="Search products" />
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
                    <img class="w-56 object-fit py-4" :src="product.image" alt="">
                    <div class="p-4 w-full border-t border-gray-400">
                        <router-link :to="'/Product/' + product.id" class="font-bold">{{ product.title }}</router-link>
                        <span class=" text-gray-500 text-sm flex justify-end">${{ product.price }}</span>
                        <svg width="15" height="16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.383 10.388a2.397 2.397 0 0 0-1.518-2.222l1.494-5.593a.8.8 0 0 0-.144-.695.8.8 0 0 0-.631-.28H2.637L2.373.591A.8.8 0 0 0 1.598 0H0v1.598h.983l1.982 7.4a.8.8 0 0 0 .799.59h8.222a.8.8 0 0 1 0 1.599H1.598a.8.8 0 1 0 0 1.598h.943a2.397 2.397 0 1 0 4.507 0h1.885a2.397 2.397 0 1 0 4.331-.376 2.397 2.397 0 0 0 1.12-2.021ZM11.26 7.99H4.395L3.068 3.196h9.477L11.26 7.991Zm-6.465 6.392a.8.8 0 1 1 0-1.598.8.8 0 0 1 0 1.598Zm6.393 0a.8.8 0 1 1 0-1.598.8.8 0 0 1 0 1.598Z"
                                fill="#FFF" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>