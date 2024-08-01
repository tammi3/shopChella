export default {
  computed: {
    filteredProducts: function () {
      return this.products.filter((product) => {
        return product.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
};
