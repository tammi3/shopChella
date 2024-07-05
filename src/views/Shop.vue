<script>
import {
  doc,
  db,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
} from "../db/firebase.js";
import searchMixin from "@/mixins/searchMixin";
export default {
  mixins: [searchMixin],
  props: ["categories"],
  data() {
    return {
      products: [],
      search: "",
      category: "all",
    };
  },
  methods: {
    setCategory(cat) {
      this.category = cat;
    },
  },
  created() {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.products.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    });

    console.log(this.products);
  },
};
</script>

<template>
  <div v-if="categories">
    <div class="flex items-center justify-center py-4 md:py-8 flex-wrap">
      <button
        type="button"
        class="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
      >
        All categories
      </button>
      <button
        v-for="cat in categories"
        @click="setCategory(cat)"
        type="button"
        class="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
      >
        {{ cat }}
      </button>
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex justify-center items-center m-4">
        <div class="w-96 h-10 relative bg-purple/50 rounded-lg">
          <input
            v-model="search"
            class="focus:outline-none absolute bg-transparent top-0 left-0 h-full w-full pr-2 pl-12 text-black"
            type="text"
            placeholder="Search products"
          />
          <svg
            class="absolute top-1 left-3 flex justify-center items-center pr-3"
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#000000"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="px-10 grid items-end grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="product in filteredProducts" class="mx-auto bg-white overflow-hidden">
          <div class="w-full flex justify-center overflow-hidden">
            <img
              class="w-72 object-fit"
              :src="product.image"
              :alt="product.name + ' image'"
            />
          </div>
          <routerLink
            :to="'/Product/' + product.id"
            class="p-2 flex flex-col justify-center items-center space-y-1"
          >
            <h2 class="text-xl font-semibold text-center text-gray-800">
              {{ product.name }}
            </h2>
            <p class="text-lg font-bold text-black">${{ product.price }}</p>
          </routerLink>
        </div>
      </div>
    </div>
  </div>
</template>
