<script>
import { onSnapshot, auth, db, where, query, collection } from "../db/firebase.js";
export default {
  data() {
    return {
      trackedOrder: {},
      trackingID: "",
      statusText: "",
      statusBg: "",
      loading: false,
    };
  },

  methods: {
    trackPackage() {
      this.trackedOrder = {};
      this.statusBg = "";
      this.statusText = "";
      this.loading = true;
      const trackingResult = document.getElementById("tracking-result");
      trackingResult.classList.add("hidden");
      trackingResult.classList.remove("flex");

      const q = query(collection(db, "orders"), where("orderID", "==", this.trackingID));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.trackedOrder = {
            ...doc.data(),
          };
        });
      });

      setTimeout(() => {
        if (this.trackedOrder.status == "In transit") {
          this.statusBg = "bg-yellow-500";
        }
        if (this.trackedOrder.status == "Processing") {
          this.statusBg = "bg-orange-400";
        }
        if (this.trackedOrder.status == "Delivered") {
          this.statusBg = "bg-green-400";
        }

        if (Object.keys(this.trackedOrder).length === 0) {
          this.statusText = "Invalid tracking ID.";
          this.statusBg = "bg-red-200";
        } else {
          this.statusText = this.trackedOrder.status;
        }

        trackingResult.classList.remove("hidden");
        trackingResult.classList.add("flex");

        this.loading = false;
      }, 1000);
    },
  },
  created() {
    const previousRoute = this.$router.options.history.state.back;
    if (previousRoute.startsWith("/Orders")) {
      navigator.clipboard.readText().then((clipText) => (this.trackingID = clipText));
      setTimeout(() => {
        if (this.trackingID != "") this.trackPackage();
      }, 500);
    }
  },
};
</script>
<template>
  <div class="container mx-auto px-4 py-14 h-full flex overflow-visible">
    <div
      class="bg-white p-6 rounded-lg max-w-md mx-auto flex flex-col justify-center items-center"
    >
      <div v-if="!trackingID" class="max-w-xs">
        <img src="../assets/tracking.png" alt="" />
      </div>
      <h1 class="text-3xl font-bold mb-4 text-center">Track Your Package</h1>
      <form @submit.prevent="trackPackage()" id="tracking-form" class="w-full mb-4">
        <label for="tracking-ID" class="block text-sm font-medium text-gray-700 mb-2"
          >Enter your tracking ID:</label
        >
        <input
          type="text"
          id="tracking-ID"
          name="tracking-ID"
          v-model="trackingID"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
          placeholder="Tracking ID"
          required
        />
        <button
          type="sumbit"
          class="mt-4 w-full flex justify-center items-center bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-500/75 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
        >
          <img
            v-if="loading"
            class="animate-spin-slow w-6"
            src="../assets/loading.png"
            alt=""
          />
          <span v-else>TRACK</span>
        </button>
      </form>
      <div
        v-if="trackingID"
        id="tracking-result"
        class="hidden w-full flex-col justify-center items-center"
      >
        <div v-if="trackedOrder.status == 'Processing'" class="max-w-xs">
          <img src="../assets/packing.png" alt="" />
        </div>
        <div v-if="trackedOrder.status == 'In transit'" class="max-w-xs">
          <img src="../assets/cargo-truck.png" alt="" />
        </div>
        <div v-if="trackedOrder.status == 'Delivered'" class="max-w-xs">
          <img src="../assets/courier.png" alt="" />
        </div>
        <div v-if="Object.keys(trackedOrder).length === 0" class="max-w-xs">
          <img src="../assets/open-box.png" alt="" />
        </div>

        <div class="w-full flex flex-col items-center">
          <h2 class="text-xl font-bold mb-2 uppercase">Tracking Status:</h2>
          <!-- <p class="text-gray-700 font-semibold mr-2">Status:</p> -->
          <span
            :class="
              statusBg +
              ' shadow-md text-black font-Ubuntu font-semibold text-md px-3 py-1 rounded-full'
            "
            >{{ statusText }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
