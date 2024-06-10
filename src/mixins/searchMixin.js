export default {
    computed: {
        filteredProducts: function(){
            return this.products.filter((product) => {
                return product.title.match(this.search);
            });
        }
    }
};