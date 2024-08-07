<script>
import {
  doc,
  db,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
  deleteObject,
  addDoc,
} from "../db/firebase.js";

export default {
  props: ["categories", "action", "product"],
  emits: ["close"],
  data() {
    return {
      products: [],
      loading: false,
    };
  },
  methods: {
    editProduct() {
      const productForm = document.querySelector(".addProduct");
      productForm.name.value = this.product.name;
      productForm.price.value = this.product.price;
      productForm.description.value = this.product.description;
      productForm.category.value = this.product.category;
    },
    updateProduct() {
      this.loading = true;
      const productForm = document.querySelector(".addProduct");
      const title = productForm.name.value;
      const price = productForm.price.value;
      const description = productForm.description.value;
      const category = productForm.category.value;
      const inputFile = document.getElementById("image");
      const uploadImage = inputFile.files[0];

      if (uploadImage) {
        const storageRef = ref(storage, "products/" + uploadImage.name);
        deleteObject(ref(storage, this.product.image)).then(() => {
          uploadBytes(storageRef, uploadImage).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              updateDoc(doc(db, "products", this.product.id), {
                name: title,
                price: price,
                description: description,
                category: category,
                image: url,
              }).then(() => {
                this.closeModal();
              });
            });
          });
        });
      } else {
        updateDoc(doc(db, "products", this.product.id), {
          name: title,
          price: price,
          description: description,
          category: category,
        }).then(() => {
          this.closeModal();
        });
      }
    },
    closeModal() {
      const productForm = document.querySelector(".addProduct");
      productForm.reset();
      this.$emit("close");
      this.loading = false;
    },
    uploadProduct() {
      this.loading = true;
      const productForm = document.querySelector(".addProduct");
      const title = productForm.name.value;
      const price = productForm.price.value;
      const description = productForm.description.value;
      const category = productForm.category.value;
      const image = productForm.image.value;

      const inputFile = document.getElementById("image");

      const uploadImage = inputFile.files[0];
      const storageRef = ref(storage, "products/" + uploadImage.name);

      //uploads uploadImage to database
      uploadBytes(storageRef, uploadImage).then((snapshot) => {
        getDownloadURL(ref(storage, "products/" + uploadImage.name)).then((url) => {
          const docRef = addDoc(collection(db, "products"), {
            name: title,
            price: price,
            description: description,
            category: category,
            image: url,
          });
        });
        this.closeModal();
      });
    },
    submitForm() {
      if (this.action == "add") {
        this.uploadProduct();
      }
      if (this.action == "edit") {
        this.updateProduct();
      }
    },
  },
  mounted() {
    if (this.action == "edit") this.editProduct();
  },
};
</script>
<template>
  <div
    id="addProduct"
    class="w-full inset-0 absolute z-30 justify-center flex items-start backdrop-blur-lg h-full py-16 font-Ubuntu"
  >
    <div class="w-full flex justify-center items-center py-4">
      <section class="flex flex-col shadow-lg rounded-lg bg-white w-96 md:w-2/4">
        <div class="flex justify-end p-4 items-center">
          <svg
            class="cursor-pointer"
            @click="closeModal()"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
          >
            <g fill="#000000" fill-rule="evenodd">
              <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
              <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
            </g>
          </svg>
        </div>
        <div class="max-w-xl px-4 py-8 mx-auto lg:py-16">
          <form class="addProduct" @submit.prevent="submitForm">
            <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div class="sm:col-span-2">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
                  >Product Name</label
                >
                <input
                  required
                  type="text"
                  name="name"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Type product name"
                />
              </div>

              <div class="w-full">
                <label for="price" class="block mb-2 text-sm font-medium text-gray-900"
                  >Price</label
                >
                <input
                  required
                  type="number"
                  name="price"
                  id="price"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="$299"
                />
              </div>
              <div>
                <label for="category" class="block mb-2 text-sm font-medium text-gray-900"
                  >Category</label
                >
                <select
                  required
                  id="category"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                >
                  <option selected disabled>Select category</option>
                  <option v-for="cat in categories">{{ cat }}</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label
                  for="description"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Description</label
                >
                <textarea
                  id="description"
                  rows="8"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Write a product description here..."
                ></textarea>
              </div>
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900" for="image"
                >Upload product image
                <span v-if="action == 'edit'">(optional)</span></label
              >
              <input
                class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
                id="image"
                type="file"
              />
            </div>
            <div class="flex items-center">
              <button
                class="w-48 h-10 font-bold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 uppercase cursor-pointer rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
              >
                <img
                  v-if="loading"
                  class="animate-spin-slow w-6"
                  src="../assets/loading.png"
                  alt=""
                />
                <div v-else>
                  <span v-if="action == 'add'">Add Product</span>
                  <span v-if="action == 'edit'">Update Product</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
