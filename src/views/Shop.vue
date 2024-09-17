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
      images: [],
      search: "",
      loading: true,
      loadingShopImages: true,
    };
  },
  watch: {
    $route: {
      async handler(oldValue, newValue) {
        await this.setCategory(oldValue.params.category);
      },
    },
    filteredProducts: {
      handler(val) {
        const productView = document.getElementById("productView");
        const emptySearch = document.getElementById("emptySearch");
        if (val.length == 0) {
          productView.classList.add("hidden");
          productView.classList.remove("grid");
          emptySearch.classList.add("flex");
          emptySearch.classList.remove("hidden");
        } else {
          emptySearch.classList.remove("flex");
          emptySearch.classList.add("hidden");
          productView.classList.remove("hidden");
          productView.classList.add("grid");
        }
      },
      deep: true,
    },
  },
  methods: {
    async setCategory(cat) {
      this.cat = cat;
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
    getImages() {
      const unsub = onSnapshot(doc(db, "pages_content", "shop"), (doc) => {
        this.images = doc.data().images;
      });
      setTimeout(() => {
        this.loadingShopImages = false;
      }, 1000);
    },
    scrollToProduct() {
      const element = document.getElementById("productView");
      element.scrollIntoView({ behavior: "smooth" });
    },
  },
  async created() {
    this.products = [];
    this.getImages();
    await this.setCategory(this.cat);
  },
};
</script>
<template>
  <div class="relative">
    <div class="sticky top-14 px-4 pt-2 w-full z-20 border-solid border-b bg-white">
      <div class="flex justify-center items-center m-4">
        <div class="w-96 h-10 relative bg-gray-400/25 shadow-md rounded-lg">
          <input v-model="search" @click="scrollToProduct"
            class="focus:outline-none absolute bg-transparent uppercase top-0 left-0 h-full w-full pr-2 pl-12"
            type="text" placeholder="Search products" />
          <svg class="absolute top-1 left-3 flex justify-center items-center pr-3" width="30px" height="30px"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 pb-16 font-Ubuntu">
      <div v-show="cat == 'allcategories' && !loadingShopImages" id="carouselExampleInterval"
        class="carousel slide relative" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-bs-interval="10000">
            <img :src="images.active" class="d-block w-100" alt="..." />
          </div>

          <div v-for="image in images.not_active" :key="image" class="carousel-item">
            <img :src="image" class="d-block w-100" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval"
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div v-if="loadingShopImages">
        <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
      </div>
      <div id="productView" class="px-10 pt-4 grid items-end grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-show="!loading" v-for="product in filteredProducts" :key="product"
          class="mx-auto bg-white overflow-hidden">
          <routerLink :to="'/Product/' + product.id" class="flex flex-col space-y-1">
            <div class="w-full flex justify-center items-center overflow-hidden">
              <img class="w-full h-full object-fit" :src="product.image" :alt="product.name + ' image'" />
            </div>
            <div class="p-2 flex flex-col justify-center items-start font-Ubuntu uppercase">
              <h2 class="text-xl font-bold text-left text-gray-800">
                {{ product.name }}
              </h2>
            </div>
          </routerLink>
        </div>

        <div v-for="skeleton in filteredProducts" :key="skeleton" v-if="loading"
          class="max-w-[288px] w-96 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="animate-pulse">
            <!-- Image Placeholder -->
            <div class="bg-gray-300 h-96 w-full"></div>
          </div>
        </div>
      </div>
      <div id="emptySearch" class="hidden items-center justify-center min-h-screen">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-gray-800 mb-4">No product found.</h1>
        </div>
      </div>
    </div>
  </div>
</template>
