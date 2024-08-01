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
} from "../db/firebase.js";
export default {
  data() {
    return {
      orders: [],
      orderStatus: [],
      updatedStatus: "",
      loading: false,
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
        console.log("updated!");
        this.getOrders();
        this.toggleSelect(order.orderID, order.docID);
        this.loading = false;
        this.updatedStatus = "";
      });
    },
    getOrders() {
      const q = query(collection(db, "orders"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        this.orders = [];
        querySnapshot.forEach((doc) => {
          this.orders.push({ ...doc.data(), docID: doc.id });
        });
        console.log(this.orders);
      });
    },
  },
  async created() {
    this.getOrders();
    const querySnapshot = await getDocs(collection(db, "order_status"));
    querySnapshot.forEach((doc) => {
      this.orderStatus.push(doc.id);
    });
  },
};
</script>
<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 ">
      <thead class="text-xs text-gray-700 uppercase bg-gray-100  ">
        <tr>
          <th scope="col" class="px-6 py-3">Order ID</th>
          <th scope="col" class="px-6 py-3">Date</th>
          <th scope="col" class="px-6 py-3">Time</th>

          <th scope="col" class="px-6 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" class="bg-white border-b  hover:bg-gray-50">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ order.orderID }}
          </th>

          <td class="px-6 py-4 whitespace-nowrap">
            {{ order.created_at.toDate().toLocaleDateString("en-US") }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ order.created_at.toDate().toLocaleTimeString("en-US") }}
          </td>

          <td :id="order.orderID" class="flex items-center px-6 py-4 gap-2 whitespace-nowrap">
            <p>{{ order.status }}</p>
            <a @click="toggleSelect(order.orderID, order.docID)"
              class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
          </td>
          <td :id="order.orderID + order.docID" class="hidden items-center px-6 py-4 gap-2 whitespace-nowrap">
            <select v-if="!loading" @change="updateOrderStatus(order)" v-model="updatedStatus" id="small"
              class="block p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option disabled selected>Update status</option>

              <option v-for="status in orderStatus">{{ status }}</option>
            </select>
            <img v-else class="animate-spin-slow w-6" src="../assets/loading.png" alt="" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
