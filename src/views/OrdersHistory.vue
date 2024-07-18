<script>
export default {};
</script>
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Order History</h1>

    <!-- Order List -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">Order #12345</h2>
      <p class="text-gray-700 mb-2">
        <span class="font-bold">Order Date:</span> June 20, 2024
      </p>
      <p class="text-gray-700 mb-2">
        <span class="font-bold">Total Amount:</span> $150.00
      </p>
      <p class="text-gray-700 mb-4">
        <span class="font-bold">Tracking ID:</span> ABCDE12345
      </p>

      <!-- Order Details -->
      <h3 class="text-xl font-semibold mb-2">Order Details:</h3>
      <ul class="list-disc list-inside text-gray-700 mb-4">
        <li>Product 1 - $50.00</li>
        <li>Product 2 - $70.00</li>
        <li>Product 3 - $30.00</li>
      </ul>

      <!-- Order Status -->
      <div class="flex items-center">
        <p class="text-gray-700 font-semibold mr-2">Status:</p>
        <span class="bg-green-500 text-white px-3 py-1 rounded-full">Shipped</span>
      </div>
    </div>

    <!-- Another Order -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">Order #67890</h2>
      <p class="text-gray-700 mb-2">
        <span class="font-bold">Order Date:</span> May 15, 2024
      </p>
      <p class="text-gray-700 mb-2">
        <span class="font-bold">Total Amount:</span> $200.00
      </p>
      <p class="text-gray-700 mb-4">
        <span class="font-bold">Tracking ID:</span> FGHIJ67890
      </p>

      <!-- Order Details -->
      <h3 class="text-xl font-semibold mb-2">Order Details:</h3>
      <ul class="list-disc list-inside text-gray-700 mb-4">
        <li>Product A - $100.00</li>
        <li>Product B - $100.00</li>
      </ul>

      <!-- Order Status -->
      <div class="flex items-center">
        <p class="text-gray-700 font-semibold mr-2">Status:</p>
        <span class="bg-yellow-500 text-white px-3 py-1 rounded-full">Processing</span>
      </div>
    </div>
  </div>
</template>
