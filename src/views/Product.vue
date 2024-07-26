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
import { InputCounter } from "flowbite";
export default {
  data() {
    return {
      id: this.$route.params.id,
      product: {},
      productQuantity: 1,
      orderLimit: false,
      loading: true,
    };
  },
  // watch: {
  //   productQuantity(val) {
  //     if (val > 20 || val < 1) {
  //       this.productQuantity = 1;
  //     }

  //     if (val == 20) {
  //       this.orderLimit = true;
  //     } else {
  //       this.orderLimit = false;
  //     }
  //   },
  // },
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
      // set the target element of the input field
      const $targetEl = document.getElementById("quantity-input");

      // optionally set the increment and decrement elements
      const $incrementEl = document.getElementById("increment-button");

      const $decrementEl = document.getElementById("decrement-button");

      // optional options with default values and callback functions
      const options = {
        minValue: 1,
        maxValue: 20, // infinite
        onIncrement: () => {
          console.log("input field value has been incremented");
        },
        onDecrement: () => {
          console.log("input field value has been decremented");
        },
      };

      const instanceOptions = {
        id: "quantity-input",
        override: true,
      };
      const counterInput = new InputCounter(
        $targetEl,
        $incrementEl,
        $decrementEl,
        options,
        instanceOptions
      );
      if (operation == "inc") {
        counterInput.increment();
      } else {
        // decrement the value of the input field
        counterInput.decrement();
      }
      this.productQuantity = counterInput.getCurrentValue();
    },
    getProduct() {
      onSnapshot(doc(db, "products", this.id), (doc) => {
        this.product = {
          ...doc.data(),
          id: this.id,
        };
      });
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },

  created() {
    this.getProduct();
  },
};
</script>
<template>
  <div v-if="!loading" class="w-full flex justify-center items-center">
    <div class="container mx-auto p-6 font-ubuntu relative">
      <div class="p-6 flex flex-col lg:flex-row justify-center items-center">
        <!-- Product Image -->
        <div class="lg:w-1/2 flex items-center justify-center">
          <img
            :src="product.image"
            alt="Product Image"
            class="w-96 lg:w-[450px] rounded-lg"
          />
        </div>
        <!-- Product Details -->
        <div class="lg:w-1/2 lg:pl-6 mt-6 lg:mt-0">
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
              <div class="relative flex items-center max-w-[8rem]">
                <button
                  type="button"
                  id="decrement-button"
                  @click="inputCounter('dec')"
                  data-input-counter-decrement="quantity-input"
                  class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    class="w-3 h-3 text-gray-900 dark:text-white"
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
                  type="text"
                  id="quantity-input"
                  data-input-counter
                  data-input-counter-min="1"
                  data-input-counter-max="50"
                  aria-describedby="helper-text-explanation"
                  class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="999"
                  value="1"
                  required
                />
                <button
                  type="button"
                  id="increment-button"
                  data-input-counter-increment="quantity-input"
                  class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    class="w-3 h-3 text-gray-900 dark:text-white"
                    @click="inputCounter('inc')"
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
            </div>
            <p
              id="helper-text-explanation"
              class="mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
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
            class="mt-6 w-full text-white font-semibold tracking-wide py-2 px-4 rounded-lg h-10 bg-black hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-black/60 transform duration-200 ease-in-out text-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-dvh animate-pulse bg-gray-300 w-full"></div>
</template>
