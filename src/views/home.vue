<script>
import welcome from "../components/Welcome.vue";
import AppFooter from "../components/Footer.vue";
import services from "../components/Services.vue";
import reviews from "../components/Reviews.vue";
export default {
  props: ["categories"],
  components: {
    welcome,
    AppFooter,
    services,
    reviews,
  },
};
</script>
<template>
  <div>
    <welcome />
    <services />
    <reviews />
    <AppFooter :categories="categories" />
  </div>
</template>
