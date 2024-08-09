<script>
import { onSnapshot, doc, db } from "../db/firebase.js";
import AppFooter from "../components/Footer.vue";
export default {
  data() {
    return {
      content: "",
      loadingImage: true,
    };
  },
  components: {
    AppFooter,
  },
  methods: {
    async getContent() {
      const unsub = onSnapshot(doc(db, "pages_content", "user"), (doc) => {
        this.content = doc.data();
      });
    },
  },
  created() {
    this.getContent();
    setTimeout(() => {
      this.loadingImage = false;
    }, 2000);
  },
};
</script>
<template>
  <div
    class="flex w-full gap-4 lg:flex-row justify-center items-center lg:items-start font-Ubuntu"
  >
    <div class="hidden lg:block w-2/4 gap-4 p-10 font-semibold relative">
      <div class="w-full h-dvh left-0 top-0 absolute">
        <img
          v-show="!loadingImage"
          class="w-full h-full object-cover"
          :src="content.image"
          alt=""
        />

        <div v-if="loadingImage" class="w-full h-full animate-pulse bg-gray-300"></div>
      </div>
    </div>
    <div
      class="flex flex-col justify-center items-center space-y-10 p-10 w-full lg:w-2/4"
    >
      <router-view class="max-w-xl z-10"></router-view>
    </div>
  </div>
</template>
