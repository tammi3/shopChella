<script>
import axios from "axios"
export default {

    data() {
        return {
            firstName: "",
            lastName: "",
            street: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            countries: [],
            selectedCountry: "",
            selectedCountryCode: '',
            selectedCity: '',
            cities: []
        }
    },
    methods: {
        handleSubmit() {
            const data = {
                email: this.email,
                username: this.username,
                password: this.password,
                confirm_password: this.confirmPassword,
                name: {
                    firstname: this.firstName,
                    lastname: this.lastName
                },
                address: {
                    country: this.selectedCountry,
                    city: this.selectedCity,
                    street: this.street
                },
                phone: this.phone
            };
            console.log("Submitted");
        },
        updateCities() {
            this.cities = this.countries[this.selectedCountryCode].cities;
            this.selectedCity = '';
            this.selectedCountry = this.countries[this.selectedCountryCode].country;
        },
    },
    created() {
        axios.get('https://countriesnow.space/api/v0.1/countries/').then((data) => {

            this.countries = data.data.data;

        });
    }

}
</script>
<template>
    <form @submit.prevent="handleSubmit"
        class="w-2/4 p-10 flex flex-col justify-center items-center gap-10 font-medium tracking-wide ">
        <div class="w-3/4 flex flex-col gap-3">
            <label for="">First Name</label>
            <input v-model="firstName" class="font-normal border-b border-gray-600" type="text" placeholder="First Name"
                name="" id="">
        </div>
        <div class="w-3/4 flex flex-col gap-3">
            <label for="">Last Name</label>
            <input v-model="lastName" class="font-normal border-b border-gray-600" type="text" placeholder="Last Name"
                name="" id="">
        </div>
        <div class="w-3/4 flex flex-col gap-4">
            <div class="flex gap-4">
                <div class="flex gap-1 w-2/4">
                    <label for="country">Country:</label>
                    <select id="country" class="border
      border-gray-600 w-40" v-model="selectedCountryCode" @change="updateCities">
                        <option value="" disabled selected>Select a country</option>
                        <option v-for="(country, code) in countries" :value="code">{{ country.country }}</option>
                    </select>

                </div>
                <div class="flex gap-1 w-2/4" v-if="selectedCountryCode">
                    <label for="city">City:</label>
                    <select id="city" class="border
                border-gray-600 w-40" v-model="selectedCity">
                        <option value="" disabled selected>Select a city</option>
                        <option v-for="city in cities" :value="city">{{ city }}</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col">
                <input v-model="street" class="font-normal border-b border-gray-600" type="text" placeholder="Street"
                    name="" id="">
            </div>


        </div>

        <div class="w-3/4 flex flex-col gap-3">
            <label for="">Email</label>
            <input v-model="email" class="font-normal border-b border-gray-600" type="text"
                placeholder="name@address.com" name="" id="">
        </div>
        <div class="w-3/4 flex flex-col gap-3">
            <label for="">Phone</label>
            <input id="phone" v-model="phoneNumber" v-mask="['(###) ###-####', '+1 (###) ###-####']"
                placeholder="Enter your phone number">
        </div>
        <div class="w-3/4 flex flex-col gap-3 tracking-wide">
            <label for="">Password</label>
            <input v-model="password" class="font-normal border-b border-gray-600" type="text" placeholder="Password"
                name="" id="">
        </div>
        <div v-if="password != ''" class="w-3/4 flex flex-col gap-3 tracking-wide">
            <label for="">Confirm Password</label>
            <input v-model="confirmPassword" class="font-normal border-b border-gray-600" type="text"
                placeholder="Confirm Password" name="" id="">
        </div>
        <button
            class="bg-purple w-3/4 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
            href="http://">REGISTER</button>
        <p class="font-normal tracking-wide">Already have an account?
            <router-link to="/User/login" class="cursor-pointer border-b border-gray-400 hover:border-gray-800">Login
                here</router-link to="/User/login">
        </p>
    </form>

</template>