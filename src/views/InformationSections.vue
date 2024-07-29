<script>
import { onSnapshot, doc, db, collection, query } from "../db/firebase.js";

export default {
  data() {
    return { information: [], info: this.$route.params.info };
  },

  watch: {
    $route: {
      async handler(oldValue, newValue) {
        await this.getInfo(oldValue.params.info);
      },
    },
  },
  methods: {
    async getInfo(info) {
      const unsub = onSnapshot(doc(db, "shopchella_information", info), (doc) => {
        this.information = doc.data();
      });
    },
  },
  async created() {
    await this.getInfo(this.info);
  },
};
</script>
<template>
  <section class="container mx-auto px-4 py-10 md:py-24 h-full">
    <h2 class="text-2xl font-bold uppercase mb-4">{{ information.title }}</h2>
    <p class="text-gray-700 text-lg mb-4">
      {{ information.intro }}
    </p>
    <ul class="list-disc list-inside text-gray-700 mb-4 text-lg">
      <li class="mb-2" v-for="bulletin in information.bulletins">{{ bulletin }}</li>
    </ul>
    <p class="text-gray-700 text-lg">
      {{ information.note }}
    </p>
  </section>
</template>
