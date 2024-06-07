<script>
import welcome from '../components/welcome.vue'
import AppFooter from '../components/footer.vue'
import services from '../components/services.vue'
import reviews from '../components/reviews.vue'
export default {
    components: {
        welcome,
        AppFooter,
        services,
        reviews
    }
}
</script>
<template>
    <div>
        <welcome />
        <services />
        <reviews />
        <AppFooter />
    </div>
</template>