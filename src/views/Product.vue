<script>
import {
  auth,
  doc,
  db,
  setDoc,
  onSnapshot,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "../db/firebase.js";
export default {
  data() {
    return {
      id: this.$route.params.id,
      product: {},
    };
  },
  methods: {
    async addToCart() {
      const user = auth.currentUser;
      const item = {
        product_id: this.product.id,
        product_image: this.product.image,
        product_name: this.product.name,
        quantity: 1,
        price: this.product.price,
        total_price: this.product.price,
      };
      console.log(item);
      await updateDoc(doc(db, "carts", user.uid), {
        items: arrayUnion(item),
        updated_at: Timestamp.fromDate(new Date()),
      }).then(() => {
        console.log("added to cart");
      });
    },
  },
  created() {
    onSnapshot(doc(db, "products", this.id), (doc) => {
      this.product = {
        ...doc.data(),
        id: this.id,
      };
    });
  },
};
</script>
<template>
  <div class="w-full p-24 flex items-center justify-center gap-20 font-ubuntu">
    <img class="w-96" :src="product.image" />
    <div class="w-2/4 flex flex-col pl-20 gap-20">
      <div class="flex flex-col gap-10">
        <p class="text-2xl uppercase font-semibold tracking-wide">
          {{ product.name }}
        </p>
        <p class="font-EdGaramond text-xl tracking-wide w-3/4">
          {{ product.description }}
        </p>
        <p class="flex gap-2 items-center capitalize font-medium text-lg">
          <span class="uppercase font-semibold">Category:</span>
          {{ product.category }}
        </p>
      </div>

      <span
        @click="addToCart()"
        class="text-black p-4 font-semibold tracking-wide w-full h-10 bg-purple hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out rounded-lg text-md flex justify-between items-center cursor-pointer"
      >
        <p class="uppercase flex justify-start">add to cart</p>
        <p class="flex justify-end">${{ product.price }}</p>
      </span>
    </div>
  </div>
</template>
