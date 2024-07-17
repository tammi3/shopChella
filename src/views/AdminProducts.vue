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

export default {
  props: ["categories"],
  components: { ManageProduct },
  data() {
    return {
      showModal: false,
      modalAction: "add",
      productToEdit: {},
      products: [],
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
  },
  created() {
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
};
</script>
<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="w-full p-4 flex justify-center items-center font-semibold">
      <button
        @click="toggleAddProduct()"
        class="cursor-pointer uppercase bg-purple w-44 h-10 rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-purple p-4 justify-center items-center flex"
      >
        Add Product
      </button>
    </div>
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Product name</th>

          <th scope="col" class="px-6 py-3">Category</th>
          <th scope="col" class="px-6 py-3">Price</th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ product.name }}
          </th>
          <td class="px-6 py-4">{{ product.category }}</td>
          <td class="px-6 py-4">${{ product.price }}</td>
          <td class="px-6 py-4">
            <img class="w-10 h-10 rounded" :src="product.image" alt="Default avatar" />
          </td>
          <td class="flex items-center px-6 py-4">
            <a
              @click="editProduct(product)"
              class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
            <a
              @click="deleteProduct(product)"
              class="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
              >Remove</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ManageProduct
    v-if="showModal"
    :product="productToEdit"
    :action="modalAction"
    :key="modalAction"
    :categories="categories"
    @close="showModal = false"
  />
</template>
