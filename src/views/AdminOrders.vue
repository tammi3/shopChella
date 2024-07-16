<script>
import { db, query, doc, onSnapshot, collection, where } from "../db/firebase.js";
export default {
  data() {
    return {
      orders: [],
    };
  },
  created() {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.orders = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().orders.length > 0) {
          this.orders.push({
            ...doc.data().orders,
          });
        }
      });
      console.log(this.orders);
    });
  },
};
</script>
<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="py-2 px-4">Order ID</th>
          <th scope="col" class="py-2 px-4">Date</th>

          <th scope="col" class="py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ order[0].orderID }}
          </th>

          <td class="px-6 py-4">2024-07-01</td>

          <td class="flex items-center px-6 py-4">
            <p>{{ order[0].status }}</p>
            <a
              class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
