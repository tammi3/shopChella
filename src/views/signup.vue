<script>
import axios from "axios"
export default {
    data() {
        return {
            countries:[]
        }
    },
    created() {
        axios.get('https://countriesnow.space/api/v0.1/countries/').then((data) => {

        this.countries= data.data;

        });
    }

}
</script>
<template>
    <div class="w-3/4 flex flex-col gap-3">
        <label for="">First Name</label>
        <input class="font-normal border-b border-gray-600" type="text" placeholder="First Name" name="" id="">
    </div>
    <div class="w-3/4 flex flex-col gap-3">
        <label for="">Last Name</label>
        <input class="font-normal border-b border-gray-600" type="text" placeholder="Last Name" name="" id="">
    </div>
    <div class="w-3/4 flex  gap-3">
        <div class="flex flex-col">
            <input class="font-normal border-b border-gray-600" type="text" placeholder="Street" name="" id="">
        </div>
        <div class="flex  gap-2">
            <label for="country">Country</label>
            <select class="border
             border-gray-600 w-40" name="country" id="country">
                <!-- <option v-for="country in countries" value="volvo">{{ country.country }}</option> -->
            </select>
        </div>

    </div>

    <div class="w-3/4 flex flex-col gap-3">
        <label for="">Email</label>
        <input class="font-normal border-b border-gray-600" type="text" placeholder="name@address.com" name="" id="">
    </div>
    <div class="w-3/4 flex flex-col gap-3 tracking-wide">
        <label for="">Password</label>
        <input class="font-normal border-b border-gray-600" type="text" placeholder="Password" name="" id="">
    </div>
    <a class="bg-purple w-3/4 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
        href="http://">REGISTER</a>
    <p class="font-normal tracking-wide">Already have an account? 
        <router-link to="/User/login" class="cursor-pointer border-b border-gray-400 hover:border-gray-800">Login here</router-link to="/User/login">
    </p>
</template>