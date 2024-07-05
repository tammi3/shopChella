<script>
import { RouterView } from "vue-router";
import { doc, db, onSnapshot, getDocs, collection } from "./db/firebase.js";
import AppHeader from "./components/Header.vue";

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      categories: [],
    };
  },
  methods: {},
  async created() {
    const querySnapshot = await getDocs(collection(db, "categories"));
    querySnapshot.forEach((doc) => {
      this.categories.push(doc.id);
    });
  },
};
</script>

<template>
  <div class="h-screen w-screen overflow-scroll">
    <AppHeader />
    <RouterView :categories="categories" />
  </div>
</template>
