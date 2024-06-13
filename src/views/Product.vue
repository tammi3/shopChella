<script>
import axios from 'axios'
export default {
    data () {
        return {
            id: this.$route.params.id,
            product: {}
        }
    },
    created() {
        axios.get('https://fakestoreapi.com/products/'+ this.id).then((data) => {
            this.product = data.data;
            console.log(this.product);

        });
    },

}
</script>
<template>
    <div class="font-bold">
        {{ product.title}}
    </div>
</template>