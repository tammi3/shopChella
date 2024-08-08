<script>
import { onSnapshot, doc, db } from "../db/firebase.js";
import AppFooter from "../components/Footer.vue";
export default {
  data() {
    return {
      content: "",
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
  },
};
</script>
<template>
  <div
    class="flex w-full gap-4 lg:flex-row justify-center items-center lg:items-start font-Ubuntu"
  >
    <div class="hidden lg:block w-2/4 gap-4 p-10 font-semibold relative">
      <div class="w-full h-dvh left-0 top-0 absolute">
        <img class="w-full h-full object-cover" :src="content.image" alt="" />
      </div>
    </div>
    <div
      class="flex flex-col justify-center items-center space-y-10 p-10 w-full lg:w-2/4"
    >
      <div
        class="w-full lg:max-w-xl flex justify-center items-center gap-4 font-semibold"
      >
        <!-- <router-link
          activeClass="bg-black text-white hover:shadow-black/60 border-black"
          class="w-1/2 h-16 rounded-xl hover:translate-x-0 hover:-translate-y-2 z-10 hover:shadow-lg transform duration-200 ease-in-out border-2 hover:shadow-gray-500 border-gray-900 p-4 justify-center items-center flex"
          to="/User/signup"
          >Sign up</router-link
        >

        <router-link
          to="/User/login"
          activeClass="bg-black text-white hover:shadow-black/60 border-black"
          class="w-1/2 h-16 rounded-xl hover:translate-x-0 hover:-translate-y-2 z-10 hover:shadow-lg transform duration-200 ease-in-out border-2 hover:shadow-gray-500 border-gray-900 p-4 justify-center items-center flex"
          >Log in</router-link
        > -->
      </div>
      <router-view class="max-w-xl z-10"></router-view>
    </div>
  </div>
</template>
