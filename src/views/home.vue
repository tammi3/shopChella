<script>
import axios from 'axios'
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
    },
    async created() {
     const response = await axios.get('user',{
        headers:{
            Authorization: 'Bearer' + localStorage.getItem('token')
        }
     });
     console.log(response);
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