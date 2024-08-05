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
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getAggregateFromServer,
  sum,
} from "../db/firebase.js";
import Paystack from "@paystack/inline-js";
import { keys } from "../utilities/env.js";

import { v4 as uuidv4 } from "uuid";
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

      phone: "",
      isValid: null,
      errorMessage: "",
      total: 0,
      orders: [],
      defaultAddress: false,
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

    async createOrder() {
      const uuid = uuidv4();
      const user = auth.currentUser;
      const docRef = await addDoc(collection(db, "orders"), {
        cart: this.cart,
        shipping_info: {
          country: this.selectedCountry,
          city: this.selectedCity,
          customer_name: this.userInfo.name.firstname + " " + this.userInfo.name.lastname,
          address: this.address,
          phone: this.phone,
          subtotal: this.subtotal,
          total: this.total,
          shipping_fee: 24.0,
        },
        orderID: uuid,
        userID: user.uid,
        status: "Processing",
        created_at: Timestamp.fromDate(new Date()),
      }).then(() => {
        updateDoc(doc(db, "carts", user.uid), {
          items: [],
          updated_at: Timestamp.fromDate(new Date()),
        }).then(() => {
          this.$router.replace({ path: "/Shop/allcategories" });
        });
      });
    },
    async paystack() {
      try {
        const popup = new Paystack();
        popup.newTransaction({
          key: keys.paystack.publicKey,
          email: this.userInfo.email,
          amount: this.total * 100 * 1700,
          currency: "NGN",
          firstName: this.userInfo.name.firstname,
          lastName: this.userInfo.name.lastname,
          phone: this.phone,
          channels: [
            "card",
            "bank",
            "ussd",
            "qr",
            "eft",
            "mobile_money",
            "bank_transfer",
            "apple_pay",
          ],

          onSuccess: (transaction) => {
            console.log(transaction);

            axios
              .get(
                `https://api.paystack.co/transaction/verify/${transaction.reference}`,
                {
                  headers: {
                    Authorization: `Bearer ${keys.paystack.secretKey}`,
                  },
                }
              )
              .then((response) => {
                const res = response.data;
                //console.log(res);
                if (
                  res.status &&
                  res.data.status == "success" &&
                  res.data.amount >= (this.total * 1700) / 100
                ) {
                  this.createOrder();
                }
              });
          },
          onLoad: (response) => {
            //console.log("onLoad: ", response);
          },
          onCancel: () => {
            //console.log("onCancel");
          },
          onError: (error) => {
            //console.log("Error: ", error.message);
            this.flutterwave();
          },
        });
      } catch (error) {
        //console.error(error);
      }
    },
    async flutterwave() {
      try {
        const uuid = uuidv4();
        const modal = FlutterwaveCheckout({
          public_key: keys.flutterwave.publicKey,
          tx_ref: "shopChella-" + uuid,
          amount: this.total,
          currency: "NGN",
          payment_options: "card, mobilemoneyghana, ussd",
          redirect_url: this.$router.replace({ path: "/checkout" }),

          meta: {
            consumer_id: 23,
            consumer_mac: "92a3-912ba-1192a",
          },
          customer: {
            email: this.userInfo.email,
            phone_number: this.userInfo.phone,
            name: this.userInfo.name.firstname + " " + this.userInfo.name.lastname,
          },
          customizations: {
            title: "shopChella",
            description: "Payment for cart",
            logo:
              "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
          },
          callback: function (data) {
            //console.log("payment callback:", data);
          },
          onclose: function () {
            console.log("Payment cancelled!");
          },
        });
        // console.log(modal);
      } catch (error) {
        //console.error(error);
      }
    },
    changeAddress() {
      this.defaultAddress = !this.defaultAddress;
      if (this.defaultAddress) {
        this.selectedCountry = this.userInfo.address.country;
        this.selectedCity = this.userInfo.address.city;
        this.address = this.userInfo.address.street;
        this.phone = this.userInfo.phone;
      } else {
        this.selectedCountry = "";
        this.selectedCity = "";
        this.address = "";
        this.phone = "";
        this.selectedCountryCode = "";
      }
    },
  },

  created() {
    this.getCart();
    const user = auth.currentUser;
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      this.userInfo = doc.data();
    });
    axios.get("https://countriesnow.space/api/v0.1/countries/").then((data) => {
      this.countries = data.data.data;
    });
  },
};
</script>
<template>
  <div
    v-if="cart == ''"
    class="w-full h-dvh font-Ubuntu text-4xl font-semibold flex flex-col p-10 justify-center items-center"
  >
    <p>Your cart is empty :(</p>
  </div>
  <div
    v-else
    class="min-h-screen bg-gray-200 flex items-center justify-center p-6 font-Ubuntu"
  >
    <div v-if="userInfo" class="container mx-auto max-w-4xl">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="font-semibold text-3xl uppercase mb-6">Checkout</h2>

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
                <h4 class="text-xl font-semibold">
                  {{ product.product_name }}
                </h4>
                <p class="text-gray-600 text-md font-medium">
                  Quantity: {{ product.quantity }}
                </p>
                <p class="text-gray-600 text-md font-medium">
                  Price: ${{ product.total_price }}
                </p>
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
          <!-- Default Address Checkbox -->

          <form @submit.prevent="paystack()">
            <div class="mb-6">
              <label class="inline-flex items-center">
                <input
                  @click="changeAddress()"
                  type="checkbox"
                  class="form-checkbox text-gray-600 cursor-pointer"
                  id="useDefaultAddress"
                />
                <span class="ml-2 text-gray-700">Use default address</span>
              </label>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="address">Address</label>
              <input
                v-if="!defaultAddress"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="text"
                id="address"
                v-model="address"
                required
              />
              <div v-else class="w-full px-3 py-2 border rounded-lg">
                {{ userInfo.address.street }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="country">Country</label>
              <select
                v-if="!defaultAddress"
                id="country"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                v-model="selectedCountryCode"
                @change="updateCities"
                required
              >
                <option value="" disabled selected>Select a country</option>
                <option v-for="(country, code) in countries" :value="code">
                  {{ country.country }}
                </option>
              </select>
              <div v-else class="w-full px-3 py-2 border rounded-lg">
                {{ userInfo.address.country }}
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="city">City</label>
              <select
                v-if="!defaultAddress"
                id="city"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                v-model="selectedCity"
                required
              >
                <option value="" disabled selected>Select a city</option>
                <option v-for="city in cities" :value="city">{{ city }}</option>
              </select>
              <div v-else class="w-full px-3 py-2 border rounded-lg">
                {{ userInfo.address.city }}
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2" for="phone">Phone Number</label>
              <input
                v-if="!defaultAddress"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="text"
                v-mask="['####-###-####', '####-###-####']"
                v-model="phone"
                id="phone"
                required
              />
              <div v-else class="w-full px-3 py-2 border rounded-lg">
                {{ userInfo.phone }}
              </div>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-2 uppercase cursor-pointer font-bold rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
