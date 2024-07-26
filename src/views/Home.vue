<script>
import { doc, db, onSnapshot } from "../db/firebase.js";
import AppFooter from "../components/Footer.vue";

export default {
  data() {
    return {
      landingContent: {},
      loading: true,
      articles: {},
    };
  },
  components: {
    AppFooter,
  },
  methods: {
    getLandingContent() {
      const unsub = onSnapshot(doc(db, "pages_content", "landing"), (doc) => {
        this.landingContent = doc.data();
      });
    },
    getArticles() {
      const unsub = onSnapshot(doc(db, "pages_content", "articles"), (doc) => {
        this.articles = doc.data();
      });
    },
  },
  created() {
    this.getLandingContent();
    this.getArticles();

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
};
</script>
<template>
  <div v-if="!loading">
    <div class="relative h-dvh">
      <img
        class="absolute object-cover inset-0 h-dvh w-full"
        :src="landingContent.welcome"
        alt=""
      />
      <div class="bg-black h-dvh w-full inset-0 opacity-30 absolute"></div>
      <div class="container mx-auto px-4 py-20 flex items-end justify-center">
        <router-link
          to="/Shop/allcategories"
          class="bg-black border border-white hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-white/50 transform duration-200 ease-in-out w-60 uppercase h-16 flex justify-center items-center rounded-xl text-lg text-white font-bold tracking-wider font-Ubuntu"
        >
          Explore</router-link
        >
      </div>
    </div>

    <!-- categories section -->
    <section class="container mx-auto px-4 py-20">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-gray-800">Explore Fashion Categories</h2>
        <p class="text-gray-600 mt-2">
          Discover a variety of categories to suit your style
        </p>
      </div>
      <div class="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <router-link
          :to="'/Shop/' + cat.category"
          v-for="cat in landingContent.categories"
          class="flex flex-col justify-start items-center gap-6"
        >
          <div class="w-full flex justify-center">
            <img
              class="w-96 h-96 object-cover hover:shadow-lg rounded-md shadow-gray-300"
              :src="cat.image"
            />
          </div>

          <div class="w-full flex flex-col justify-start items-center">
            <p class="font-Ubuntu font-black text-3xl tracking-wide uppercase">
              {{ cat.category }}
            </p>
            <img src="" alt="" />
          </div>
        </router-link>
      </div>
    </section>

    <!-- articles section -->
    <section class="container mx-auto px-4 py-20">
      <!-- Section Title -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-gray-800">Latest Fashion Articles</h2>
        <p class="text-gray-600 mt-2">
          Discover the latest trends and styles in our collection
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Article  -->
        <div
          v-for="article in articles"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            :src="article.image"
            alt="Article Image"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <div class="text-xl font-bold mb-2 cursor-pointer">
              <a :href="article.url">{{ article.title }}</a>
            </div>

            <p class="text-gray-600">
              {{ article.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <AppFooter />
  </div>
  <div v-else>
    <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
  </div>
</template>
