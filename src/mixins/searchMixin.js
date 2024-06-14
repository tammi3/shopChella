export default {
    computed: {
        filteredProducts: function(){
            return this.products.filter((product) => {
               
                return product.title.toLowerCase().includes(this.search.toLowerCase());
            });
        }
    }
};