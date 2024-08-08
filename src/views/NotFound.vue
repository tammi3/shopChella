<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="text-center">
      <!-- 404 Error Code -->
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>

      <!-- Error Message -->
      <p class="text-xl text-gray-600 mb-8">
        Oops! The page you are looking for does not exist.
      </p>

      <!-- Button to Redirect to Main Page -->
      <router-link
        to="/"
        class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
      >
        Go to Homepage
      </router-link>
    </div>
  </div>
</template>
