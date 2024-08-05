<script>
import {
  doc,
  db,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
  getDocs,
  auth,
} from "../db/firebase.js";

export default {
  props: ["categories"],
  data() {
    return {
      orders: [],
      isOrders: true,
      loadingOrders: true,
    };
  },
  methods: {
    async getOrders() {
      const user = auth.currentUser;
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userID", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.orders.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      if (this.orders.length === 0) {
        this.isOrders = false;
      }
      setTimeout(() => {
        this.loadingOrders = false;
      }, 2000);
    },
    copyClipboard(index) {
      const elementId = "order-" + index;
      // Get the text field
      const copyText = document.getElementById(elementId);

      // Select the text field
      copyText.select();
      copyText.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText.value);
      this.$router.push({ path: "/Information/Tracking" });
    },
  },
  async created() {
    this.getOrders();
  },
};
</script>
<template>
  <div v-show="!loadingOrders" class="relative">
    <div class="absolute inset-0 -z-10 bg-gray-100 w-full h-full"></div>
    <div v-if="isOrders" class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 uppercase">Order History</h1>

      <!-- Order List -->
      <div
        v-for="(order, index) in orders"
        class="bg-white shadow-lg rounded-lg p-6 mb-6"
      >
        <h2 class="text-2xl font-semibold mb-4">Order #{{ index }}</h2>
        <p class="text-gray-700 mb-2">
          <span class="font-bold">Order Date:</span>
          {{
            order.created_at.toDate().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </p>
        <p class="text-gray-700 mb-2">
          <span class="font-bold">Total Amount:</span> ${{ order.shipping_info.total }}.00
        </p>
        <div class="text-gray-700 mb-4 w-full flex items-center space-x-2">
          <span class="font-bold">Tracking ID:</span>

          <div class="w-full max-w-[11rem] relative bg-gray-200 pr-2 rounded-md">
            <input
              type="text"
              class="p-2 w-[7rem]"
              :id="'order-' + index"
              :value="order.orderID"
            />
            <button
              class="absolute top-1 right-3 cursor-pointer btn"
              @click="copyClipboard(index)"
            >
              <img :id="'copy-order-' + index" class="w-6" src="../assets/copy.png" /><img
                :id="'copied-order-' + index"
                class="w-6 hidden"
                src="../assets/tick.png"
              />
            </button>
          </div>
        </div>

        <!-- Order Details -->
        <h3 class="text-xl font-semibold mb-2">Order Details:</h3>
        <ul class="list-disc list-inside text-gray-700 mb-4">
          <div class="mb-6">
            <div class="space-y-4">
              <div v-for="product in order.cart" class="flex items-center">
                <img
                  :src="product.product_image"
                  alt="Product Image"
                  class="w-16 h-16 object-fit rounded mr-4"
                />
                <div>
                  <h4 class="text-lg font-semibold">
                    {{ product.product_name }}
                  </h4>
                  <p class="text-gray-600">
                    <span class="font-semibold">Quantity:</span> {{ product.quantity }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-semibold">Price:</span> ${{ product.total_price }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
    <div
      v-else
      class="text-2xl lg:text-5xl font-bold flex items-center justify-center container mx-auto h-dvh text-center"
    >
      You have not placed an order yet
    </div>
  </div>
  <div v-if="loadingOrders">
    <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
  </div>
</template>
