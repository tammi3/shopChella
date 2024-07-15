<script>
import axios from "axios";
import {
  doc,
  db,
  auth,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
  getAggregateFromServer,
  sum,
} from "../../../shopChella - Copy/src/db/firebase.js";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      address: "",
      userInfo: {},
      countries: [],
      selectedCountry: "",
      selectedCountryCode: "",
      selectedCity: "",
      subtotal: 0,
      loading: false,
      cities: [],
      cart: {},
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      phone: "",
      isValid: null,
      errorMessage: "",
      total: 0,
    };
  },
  methods: {
    getCart() {
      const user = auth.currentUser;
      if (user) {
        onSnapshot(doc(db, "carts", user.uid), (doc) => {
          if (doc.data().items.length == 0) {
            this.cart = "";
          } else {
            this.cart = {
              ...doc.data().items,
            };
            let items = doc.data().items;
            this.subtotal = items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );
            this.total = this.subtotal + 24.0;

            console.log(this.cart);
          }
        });
      } else {
        this.cart = "";
      }
    },
    toggleModal() {
      const modal = document.getElementById("modal");
      if (modal.classList.contains("hidden")) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      } else {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    },
    updateCities() {
      this.cities = this.countries[this.selectedCountryCode].cities;
      this.selectedCity = "";
      this.selectedCountry = this.countries[this.selectedCountryCode].country;
    },
    validateCard() {
      this.errorMessage = "";
      this.isValid = this.luhnCheck(this.cardNumber);
      if (!this.isValid) {
        this.errorMessage = "Invalid card number";
      }
    },
    luhnCheck(cardNumber) {
      let sum = 0;
      let shouldDouble = false;
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    },
    async payCart() {
      this.validateCard();
      if (this.isValid) {
        const user = auth.currentUser;
        const order = {
          cart: this.cart,
          shipping_info: {
            country: this.selectedCountry,
            city: this.selectedCity,
            address: this.address,
            phone: this.phone,
            subtotal: this.subtotal,
            total: this.total,
            shipping_fee: 24.0,
          },
          created_at: Timestamp.fromDate(new Date()),
        };
        console.log(order);
        await updateDoc(doc(db, "orders", user.uid), {
          orders: arrayUnion(order),
          updated_at: Timestamp.fromDate(new Date()),
        }).then(() => {
          updateDoc(doc(db, "carts", user.uid), {
            items: [],
            updated_at: Timestamp.fromDate(new Date()),
          });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Order success!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.$router.replace({ path: "/Shop/allcategories" });
          });
        });
      }
    },
  },

  created() {
    this.getCart();
    const user = auth.currentUser;
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      this.userInfo = doc.data();
      console.log(this.userInfo);
    });
    axios.get("https://countriesnow.space/api/v0.1/countries/").then((data) => {
      this.countries = data.data.data;
    });
  },
};
</script>
<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="container mx-auto max-w-4xl">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-6">Checkout</h2>

        <!-- Cart Items -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-4">Cart Items</h3>
          <div class="space-y-4">
            <div v-for="product in cart" class="flex items-center">
              <img
                :src="product.product_image"
                alt="Product Image"
                class="w-16 h-16 object-fit rounded mr-4"
              />
              <div>
                <h4 class="text-lg font-semibold">
                  {{ product.product_name }}
                </h4>
                <p class="text-gray-600">Quantity: {{ product.quantity }}</p>
                <p class="text-gray-600">Price: ${{ product.total_price }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="mb-6">
          <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
          <div class="text-gray-600">
            <div class="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${{ subtotal }}.00</span>
            </div>
            <div class="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$24.00</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span>Total</span>
              <span>${{ total }}.00</span>
            </div>
          </div>
        </div>

        <!-- Shipping Information -->
        <div>
          <h3 class="text-xl font-semibold mb-4">Shipping Information</h3>
          <form @submit.prevent="toggleModal()">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="address">Address</label>
              <input
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="address"
                v-model="address"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="country">Country</label>
              <select
                v-on:change="error = ''"
                id="country"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="selectedCountryCode"
                @change="updateCities"
                required
              >
                <option value="" disabled selected>Select a country</option>
                <option v-for="(country, code) in countries" :value="code">
                  {{ country.country }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="city">City</label>
              <select
                v-on:change="error = ''"
                id="city"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="selectedCity"
                required
              >
                <option value="" disabled selected>Select a city</option>
                <option v-for="city in cities" :value="city">{{ city }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="phone">Phone Number</label>
              <input
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                v-model="phone"
                id="phone"
                required
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--Payment  Modal -->
    <div
      id="modal"
      class="hidden fixed inset-0 w-full bg-black bg-opacity-50 z-50 items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Enter Card Details</h2>
        <form @submit.prevent="payCart()">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="cardName">Name on Card</label>
            <input
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="cardName"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="cardNumber">Card Number</label>
            <input
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="cardNumber"
              v-model="cardNumber"
              required
            />
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
              {{ errorMessage }}
            </p>
          </div>
          <div class="flex mb-4">
            <div class="w-1/2 mr-2">
              <label class="block text-gray-700 mb-2" for="expiryDate">Expiry Date</label>
              <input
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="expiryDate"
                required
              />
            </div>
            <div class="w-1/2 ml-2">
              <label class="block text-gray-700 mb-2" for="cvv">CVV</label>
              <input
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="cvv"
                required
              />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="toggleModal()"
              class="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              <img
                v-if="loading"
                class="animate-spin-slow w-6"
                src="../assets/loading.png"
                alt=""
              />
              <span v-if="!loading">Pay Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
