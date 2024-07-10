<script>
export default {
  props: ["categories"],
};
</script>

<template>
  <div v-if="categories">
    <div class="flex items-center justify-center py-4 md:py-8 flex-wrap">
      <routerLink
        to="/shop/allcategories"
        type="button"
        class="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
      >
        All categories
      </routerLink>
      <routerLink
        activeClass=" ring-4 outline-none ring-gray-300"
        v-for="cat in categories"
        :to="'/shop/' + cat"
        type="button"
        class="text-gray-900 border border-white hover:border-gray-400 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
      >
        {{ cat }}
      </routerLink>
    </div>
    <RouterView />
  </div>
</template>
