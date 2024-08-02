<script>
import {
  doc,
  db,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
  getDocs,
} from "../db/firebase.js";

import searchMixin from "@/mixins/searchMixin";
export default {
  mixins: [searchMixin],
  data() {
    return {
      cat: this.$route.params.category,
      products: [],
      search: "",
      loading: true,
    };
  },
  watch: {
    $route: {
      async handler(oldValue, newValue) {
        await this.setCategory(oldValue.params.category);
      },
    },
  },
  methods: {
    async setCategory(cat) {
      this.loading = true;
      if (cat == "allcategories") {
        this.products = [];
        const q = query(collection(db, "products"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.products.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });
      } else {
        this.products = [];
        const categoriesRef = collection(db, "products");
        const q = query(categoriesRef, where("category", "==", cat));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.products.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },
  async created() {
    this.products = [];
    await this.setCategory(this.cat);
  },
};
</script>
<template>
  <div class="flex flex-col gap-3 py-16">
    <div class="flex justify-center items-center m-4">
      <div class="w-96 h-10 relative bg-gray-400/25 shadow-md rounded-lg">
        <input
          v-model="search"
          class="focus:outline-none absolute bg-transparent top-0 left-0 h-full w-full pr-2 pl-12"
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
      <div
        v-show="!loading"
        v-for="product in filteredProducts"
        class="mx-auto bg-white overflow-hidden"
      >
        <div class="flex flex-col space-y-1">
          <div class="w-full flex justify-center items-center overflow-hidden">
            <img
              class="w-full h-full object-fit"
              :src="product.image"
              :alt="product.name + ' image'"
            />
          </div>
          <routerLink
            :to="'/Product/' + product.id"
            class="p-2 flex flex-col justify-center items-center"
          >
            <h2 class="text-xl font-semibold text-left text-gray-800">
              {{ product.name }}
            </h2>
          </routerLink>
        </div>
      </div>
      <div
        v-for="skeleton in filteredProducts"
        v-if="loading"
        class="max-w-[288px] w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="animate-pulse">
          <!-- Image Placeholder -->
          <div class="bg-gray-300 h-96 w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
