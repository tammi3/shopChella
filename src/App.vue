<script>
import { RouterView } from 'vue-router'
import AppHeader from './components/header.vue'
import axios from "axios"

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      categories: [],

    }
  },
  methods: {

  },
  created() {

    axios.get('https://fakestoreapi.com/products/categories').then((data) => {

      this.categories = data.data;

    });
  },
}

</script>

<template>
  <div class="h-screen w-sreen overflow-scroll">
    <AppHeader />
    <RouterView :categories="categories" /> 
  </div>
</template>
