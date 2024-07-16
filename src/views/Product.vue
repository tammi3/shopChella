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
import Swal from "sweetalert2";
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
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Add to cart!",
          showConfirmButton: false,
          timer: 1500,
        });
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
  <div class="container mx-auto p-6 font-ubuntu">
    <div class="p-6 flex flex-col md:flex-row">
      <!-- Product Image -->
      <div class="md:w-1/2">
        <img :src="product.image" alt="Product Image" class="w-96 rounded-lg" />
      </div>
      <!-- Product Details -->
      <div class="md:w-1/2 md:pl-6 mt-6 md:mt-0">
        <h1 class="text-3xl font-bold text-gray-800">{{ product.name }}</h1>
        <p class="text-xl text-gray-600 mt-2">${{ product.price }}</p>
        <p class="text-gray-700 text-xl mt-4 font-EdGaramond">
          {{ product.description }}
        </p>
        <div class="mt-4">
          <label for="quantity" class="block text-sm font-medium text-gray-700"
            >Quantity</label
          >
          <div class="mt-2 relative flex items-center">
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
          <p v-if="orderLimit" class="mt-2 text-sm text-gray-500">
            Maximum of 20 pieces per order.
          </p>
        </div>
        <!-- Product Category -->
        <div class="mt-4">
          <span class="text-gray-500">Category:</span>
          <span class="text-gray-800 font-semibold pl-1">
            <routerLink :to="'/Shop/' + product.category">
              {{ product.category }}</routerLink
            ></span
          >
        </div>
        <button
          @click="addToCart()"
          class="mt-6 w-full text-black font-semibold tracking-wide py-2 px-4 rounded-lg h-10 bg-purple hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out text-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple focus:ring-opacity-50"
        >
          Add to Cart
        </button>
      </div>
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
