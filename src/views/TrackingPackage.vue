<script>
export default {
  methods: {
    trackPackage() {
      const trackingNumber = document.getElementById("tracking-number").value;
      const statusText = document.getElementById("status-text");
      const trackingResult = document.getElementById("tracking-result");

      if (trackingNumber === "") {
        alert("Please enter a tracking number");
        return;
      }

      // Simulate an API call to get the package status
      setTimeout(() => {
        const statuses = [
          "In Transit",
          "Delivered",
          "Out for Delivery",
          "Pending",
          "Exception",
        ];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        statusText.textContent = `The status of your package (${trackingNumber}) is: ${randomStatus}`;
        trackingResult.classList.remove("hidden");
      }, 1000);
    },
  },
};
</script>
<template>
  <div class="container mx-auto p-4">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-center">Track Your Package</h1>
      <form id="tracking-form" class="mb-4">
        <label for="tracking-number" class="block text-sm font-medium text-gray-700 mb-2"
          >Enter your tracking number:</label
        >
        <input
          type="text"
          id="tracking-number"
          name="tracking-number"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tracking Number"
        />
        <button
          type="button"
          @click="trackPackage()"
          class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Track
        </button>
      </form>
      <div id="tracking-result" class="hidden">
        <h2 class="text-xl font-bold mb-2">Tracking Status:</h2>
        <p id="status-text" class="text-gray-700"></p>
      </div>
    </div>
  </div>
</template>
