<script>
import { onSnapshot, doc, db } from "../db/firebase.js";

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
  <section class="container mx-auto px-4 py-10 md:py-24 h-full font-EdGaramond">
    <h2 class="text-3xl font-bold uppercase mb-4 font-Ubuntu">{{ information.title }}</h2>
    <p class="text-gray-700 text-xl mb-4 line">
      {{ information.intro }}
    </p>
    <ul class="list-disc list-inside text-gray-700 mb-4 text-xl">
      <li class="mb-2" v-for="bulletin in information.bulletins">{{ bulletin }}</li>
    </ul>
    <p class="text-gray-700 text-xl">
      {{ information.note }}
    </p>
  </section>
</template>
