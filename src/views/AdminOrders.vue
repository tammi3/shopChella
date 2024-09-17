<script>
import {
  db,
  query,
  doc,
  onSnapshot,
  collection,
  Timestamp,
  updateDoc,
  getDocs,
  where,
} from "../db/firebase.js";
export default {
  data() {
    return {
      orders: [],
      orderStatus: [],
      updatedStatus: "",
      loading: false,
      searchId: "",
      filterStatus: "",
      loadingOrdersTab: true
    };
  },
  methods: {
    toggleSelect(id, orderStatus) {
      const status = document.getElementById(id);
      const statusSelect = document.getElementById(id + orderStatus);
      if (
        status.classList.contains("flex") &&
        statusSelect.classList.contains("hidden")
      ) {
        status.classList.remove("flex");
        status.classList.add("hidden");
        statusSelect.classList.add("flex");
        statusSelect.classList.remove("hidden");
      } else {
        status.classList.add("flex");
        status.classList.remove("hidden");
        statusSelect.classList.remove("flex");
        statusSelect.classList.add("hidden");
      }
    },
    async updateOrderStatus(order) {
      this.loading = true;
      await updateDoc(doc(db, "orders", order.docID), {
        status: this.updatedStatus,
        updated_at: Timestamp.fromDate(new Date()),
      }).then(() => {

        this.getOrders();
        this.toggleSelect(order.orderID, order.docID);
        this.loading = false;
        this.updatedStatus = "";
      });
    },
    async getOrders(filter) {
      if (filter == "All") {
        const q = query(collection(db, "orders"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          this.orders = [];
          querySnapshot.forEach((doc) => {
            this.orders.push({ ...doc.data(), docID: doc.id });
          });

        });
      } else {
        this.orders = [];
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("status", "==", filter));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.orders.push({ ...doc.data(), docID: doc.id });
        });
      }
    },
  },
  computed: {
    filteredOrders: function () {
      return this.orders.filter((order) => {
        return order.orderID.toLowerCase().includes(this.searchId.toLowerCase());
      });
    },
  },
  async created() {
    this.getOrders("All");
    const querySnapshot = await getDocs(collection(db, "order_status"));
    querySnapshot.forEach((doc) => {
      this.orderStatus.push(doc.id);
    });
    setTimeout(() => {
      this.loadingOrdersTab = false;
    }, 2000);
  },
};
</script>
<template>
  <div>
    <div v-show="!loadingOrdersTab" class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div class="w-full space-x-3 p-4 flex justify-center items-center">
        <div class="w-96 h-10 relative bg-gray-400/25 shadow-md rounded-lg">
          <input v-model="searchId"
            class="focus:outline-none absolute bg-transparent top-0 left-0 h-full w-full pr-2 pl-12" type="text"
            placeholder="Search orders by id" />
          <svg class="absolute top-1 left-3 flex justify-center items-center pr-3" width="30px" height="30px"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="relative">
          <label for="selectFilter" id="filterButton"
            class="bg-gray-600 absolute inset-0 font-semibold text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300">
            Filter by status
          </label>

          <select v-if="!loading" id="selectFilter" @change="getOrders(filterStatus)" v-model="filterStatus"
            class="block opacity-0 p-2 w-44 cursor-pointer text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500">
            <option>All</option>
            <option v-for="status in orderStatus" :key="status">{{ status }}</option>
          </select>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">Customer Name</th>
            <th scope="col" class="px-6 py-3">Order ID</th>
            <th scope="col" class="px-6 py-3">Date</th>
            <th scope="col" class="px-6 py-3">Time</th>
            <th scope="col" class="px-6 py-3">Phone</th>
            <th scope="col" class="px-6 py-3">Address</th>
            <th scope="col" class="px-6 py-3">Cart</th>
            <th scope="col" class="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order" class="bg-white border-b hover:bg-gray-50">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ order.shipping_info.customer_name }}
            </th>
            <td scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
              {{ order.orderID }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              {{
                order.created_at.toDate().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ order.created_at.toDate().toLocaleTimeString("en-US") }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ order.shipping_info.phone }}
            </td>
            <!-- Address -->
            <td class="px-6 py-4 whitespace-nowrap">
              <table>
                <thead class="text-xs text-gray-700 uppercase border-2 border-gray-100">
                  <tr>
                    <th scope="col" class="px-6 py-3 border-gray-100 border-r-2">
                      Country
                    </th>
                    <th scope="col" class="px-6 py-3 border-gray-100 border-r-2">City</th>
                    <th scope="col" class="px-6 py-3 border-gray-100 border-r-2">Street</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white border-2 border-gray-100 hover:bg-gray-50">
                    <td scope="row"
                      class="px-6 py-4 border-gray-100 border-r-2 font-medium text-gray-900 whitespace-nowrap">
                      {{ order.shipping_info.country }}
                    </td>
                    <td scope="row"
                      class="px-6 py-4 border-gray-100 border-r-2 font-medium text-gray-900 whitespace-nowrap">
                      {{ order.shipping_info.city }}
                    </td>
                    <td scope="row"
                      class="px-6 py-4 border-gray-100 border-r-2 font-medium text-gray-900 whitespace-nowrap">
                      {{ order.shipping_info.address }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <ul class="list-disc list-inside text-gray-700 mb-4">
                <div class="mb-6">
                  <div class="space-y-4">
                    <div v-for="product in order.cart" :key="product" class="flex items-center">
                      <img :src="product.product_image" alt="Product Image" class="w-16 h-16 object-fit rounded mr-4" />
                      <div>
                        <h4 class="text-lg font-semibold">
                          {{ product.product_name }}
                        </h4>
                        <p class="text-gray-600">
                          <span class="font-semibold">Quantity:</span>
                          {{ product.quantity }}
                        </p>
                        <p class="text-gray-600">
                          <span class="font-semibold">Price:</span> ${{
                            product.total_price
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="text-md flex space-x-2">
                      <span class="font-semibold uppercase">Total:</span><span> ${{ order.shipping_info.total }}</span>
                      <span> (shipping included +$50)</span>
                    </div>
                  </div>
                </div>
              </ul>
            </td>
            <td :id="order.orderID" class="flex items-center px-6 py-4 gap-2 whitespace-nowrap">
              <p>{{ order.status }}</p>
              <a @click="toggleSelect(order.orderID, order.docID)"
                class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
            </td>
            <td :id="order.orderID + order.docID" class="hidden items-center px-6 py-4 gap-2 whitespace-nowrap">
              <select v-if="!loading" @change="updateOrderStatus(order)" v-model="updatedStatus" id="small"
                class="block p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500">
                <option disabled selected>Update status</option>

                <option v-for="status in orderStatus" :key="status">{{ status }}</option>
              </select>
              <img v-else class="animate-spin-slow w-6" src="../assets/loading.png" alt="" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="loadingOrdersTab">
      <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
    </div>
  </div>

</template>
