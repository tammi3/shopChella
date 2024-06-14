<script>

import Categories from './Categories.vue';
export default {
    props: ['categories'],
    components: { Categories },
    data() {
        return {
            category: 'all'
        }
    },
    methods: {
        setCategory(cat) {

            this.category = cat;
        }
    }
}
</script>

<template>
    <div class="flex  gap-10">
        <div class="flex flex-col w-96 gap-4 fixed right-auto h-screen bg-purple px-8 py-10">

            <p class="font-Ubuntu uppercase font-medium text-2xl tracking-wider">Categories</p>
            <ul class="capitalize font-EdGaramond text-xl tracking-wider flex flex-col gap-3 pl-3">
                <div @click="setCategory('all')" class="hover:text-gray-500 cursor-pointer">All</div>
                <template v-for="cat in categories" :key="cat">
                    <div @click="setCategory(cat)" class="hover:text-gray-500 cursor-pointer">{{ cat }}</div>
                </template>

            </ul>

        </div>

        <Categories :category="category" :key="category" />

    </div>
</template>