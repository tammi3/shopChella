<script>
import { onSnapshot, doc, db, collection, query } from "../db/firebase.js";
export default {
  data() {
    return { information: [] };
  },
  methods: {
    getInfo() {
      const q = query(collection(db, "shopchella_information"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.information.push(doc.data());
        });
        console.log("Current data: ", this.information[2]);
      });
    },
  },
  created() {
    this.getInfo();
  },
};
</script>
<template>
  <div class="container mx-auto p-6">
    <div class="p-6 mb-6">
      <h1 class="text-3xl font-bold mb-4">Shopchella Information</h1>

      <!-- Terms & Conditions section -->
      <section v-for="info in information" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ info.title }}</h2>
        <p class="text-gray-700 mb-4">
          {{ info.intro }}
        </p>
        <ul class="list-disc list-inside text-gray-700 mb-4">
          <li v-for="bulletin in info.bulletins">{{ bulletin }}</li>
        </ul>
        <p class="text-gray-700">
          {{ info.note }}
        </p>
      </section>
    </div>
  </div>
</template>
