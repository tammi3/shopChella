<script>
import AppFooter from "../components/Footer.vue";
export default {
  components: {
    AppFooter,
  },
};
</script>
<template>
  <div class="h-dvh flex flex-col space-y-10">
    <router-view></router-view>
    <AppFooter class="w-full" />
  </div>
</template>
