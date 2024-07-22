<script>
import Welcome from "../components/Welcome.vue";
import AppFooter from "../components/Footer.vue";
import Services from "../components/Services.vue";
import Reviews from "../components/Reviews.vue";
export default {
  props: ["categories"],
  components: {
    Welcome,
    AppFooter,
    Services,
    Reviews,
  },
};
</script>
<template>
  <div>
    <Welcome />
    <Services />
    <Reviews />
    <AppFooter :categories="categories" />
  </div>
</template>
