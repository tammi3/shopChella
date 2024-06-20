<script>
//import { auth, onAuthStateChanged } from '../main.js'
import welcome from '../components/welcome.vue'
import AppFooter from '../components/footer.vue'
import services from '../components/services.vue'
import reviews from '../components/reviews.vue'
export default {
    props: ['categories'],
    components: {
        welcome,
        AppFooter,
        services,
        reviews
    },
    // created() {
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             // User is signed in, see docs for a list of available properties
    //             // https://firebase.google.com/docs/reference/js/auth.user
    //             const uid = user.uid;
    //             console.log(uid);
    //             // ...
    //         } else {
    //             this.$router.push('/User/login');
    //         }
    //     });
    // }
}
</script>
<template>
    <div>
        <welcome />
        <services />
        <reviews />
        <AppFooter :categories="categories" />
    </div>
</template>