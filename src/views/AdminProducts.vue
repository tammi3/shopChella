<script>
import {
  onSnapshot,
  doc,
  db,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  query,
  deleteObject,
  getDownloadURL,
  deleteDoc,
  collection,
  addDoc,
} from "../db/firebase.js";

import ManageProduct from "../components/ManageProduct.vue";
import Swal from "sweetalert2";
import searchMixin from "@/mixins/searchMixin";


export default {
  props: ["categories"],
  mixins: [searchMixin],
  components: { ManageProduct },
  data() {
    return {
      showModal: false,
      modalAction: "add",
      productToEdit: {},
      products: [],
      search: "",
      loadingProductsTab: true,
    };
  },
  methods: {
    toggleAddProduct() {
      this.modalAction = "add";
      this.showModal = true;
    },
    editProduct(product) {
      this.modalAction = "edit";
      this.productToEdit = product;
      this.showModal = true;
    },
    deleteProduct(product) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const productImageRef = ref(storage, product.image);

          // Delete the file
          deleteObject(productImageRef)
            .then(() => {
              deleteDoc(doc(db, "products", product.id));
              this.products = [];
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            })
            .catch((error) => {
              // Uh-oh, an error occurred!
            });
        }
      });
    },
    getProducts() {
      const q = query(collection(db, "products"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.products.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
    },
  },
  created() {
    this.getProducts();
    setTimeout(() => {
      this.loadingProductsTab = false;
    }, 2000);
  },
};
</script>
<template>
  <div v-show="!loadingProductsTab" class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="w-full p-4 flex justify-center items-start space-x-3 font-semibold">
      <button @click="toggleAddProduct()"
        class="w-44 h-10 uppercase cursor-pointer rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex">
        Add Product
      </button>
      <div class="w-96 h-10 relative bg-gray-400/25 shadow-md rounded-lg">
        <input v-model="search" class="focus:outline-none absolute bg-transparent top-0 left-0 h-full w-full pr-2 pl-12"
          type="text" placeholder="Search products" />
        <svg class="absolute top-1 left-3 flex justify-center items-center pr-3" width="30px" height="30px"
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
      <thead class="text-xs text-gray-700 uppercase bg-gray-100  ">
        <tr>
          <th scope="col" class="px-6 py-3">Product name</th>

          <th scope="col" class="px-6 py-3">Category</th>
          <th scope="col" class="px-6 py-3">Price</th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" class="bg-white border-b  hover:bg-gray-50 ">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {{ product.name }}
          </th>
          <td class="px-6 py-4">{{ product.category }}</td>
          <td class="px-6 py-4">${{ product.price }}</td>
          <td class="px-6 py-4">
            <img class="w-10 h-10 rounded" :src="product.image" alt="Default avatar" />
          </td>
          <td class="flex items-center px-6 py-4">
            <a @click="editProduct(product)"
              class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
            <a @click="deleteProduct(product)"
              class="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="loadingProductsTab">
    <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
  </div>
  <ManageProduct v-if="showModal" :product="productToEdit" :action="modalAction" :key="modalAction"
    :categories="categories" @close="showModal = false" />
</template>
