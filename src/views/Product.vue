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
      productQuantity: 1,
      orderLimit: false,
    };
  },
  watch: {
    productQuantity(val) {
      if (val > 20 || val < 1) {
        this.productQuantity = 1;
      }

      if (val == 20) {
        this.orderLimit = true;
      } else {
        this.orderLimit = false;
      }
    },
  },
  methods: {
    async addToCart() {
      const user = auth.currentUser;
      const item = {
        product_id: this.product.id,
        product_image: this.product.image,
        product_name: this.product.name,
        quantity: this.productQuantity,
        price: this.product.price,
        total_price: this.product.price * this.productQuantity,
      };
      console.log(item);
      await updateDoc(doc(db, "carts", user.uid), {
        items: arrayUnion(item),
        updated_at: Timestamp.fromDate(new Date()),
      }).then(() => {
        console.log("added to cart");
      });
    },
    inputCounter(operation) {
      if (operation == "inc" && this.productQuantity < 20) {
        this.productQuantity++;
      }
      if (operation == "dec" && this.productQuantity > 1) {
        this.productQuantity--;
      }
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
        <div class="flex w-3/4 gap-4">
          <p class="flex gap-2 w-2/4 items-center capitalize font-medium text-lg">
            <span class="uppercase font-semibold">Category:</span>
            <routerLink :to="'/Shop/' + product.category">
              {{ product.category }}</routerLink
            >
          </p>
          <div class="flex flex-col gap-2 w-2/4 items-center justify-center">
            <form class="max-w-xs">
              <label
                for="counter-input"
                class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >Choose quantity:</label
              >
              <div class="relative flex items-center">
                <button
                  type="button"
                  @click="inputCounter('dec')"
                  id="decrement-button"
                  data-input-counter-decrement="counter-input"
                  class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    class="w-2.5 h-2.5 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  v-model="productQuantity"
                  id="counter-input"
                  min="1"
                  max="20"
                  data-input-counter
                  class="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                  placeholder=""
                  value="1"
                  required
                />
                <button
                  type="button"
                  @click="inputCounter('inc')"
                  id="increment-button"
                  data-input-counter-increment="counter-input"
                  class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    class="w-2.5 h-2.5 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
            </form>
            <p v-if="orderLimit" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Maximum of 20 pieces per order.
            </p>
          </div>
        </div>
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
<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
