<script>
import axios from "axios"
export default {
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        async handleSubmit() {
            const response = await axios.post('https://fakestoreapi.com/auth/login', {
                username: this.username,
                password: this.password
            });
            console.log(response);
            localStorage.setItem('token', response.data.token);
        }
    },
}
</script>


<template>
    <form @submit.prevent="handleSubmit()" class="w-2/4 p-10 flex flex-col justify-center items-center gap-10 font-medium tracking-wide" >
        <div class="w-3/4 flex flex-col gap-3">
            <label for="">Username</label>
            <input v-model="username" class="font-normal border-b border-gray-600" type="text"
                placeholder="@johndoe" name="" id="">
        </div>
        <div class="w-3/4 flex flex-col gap-3 tracking-wide">
            <label for="">Password</label>
            <input v-model="password" class="font-normal border-b border-gray-600" type="text" placeholder="Password"
                name="" id="">
        </div>
        <button
            class="bg-purple w-3/4 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
            href="http://">SIGN IN</button>
        <p class="font-normal tracking-wide">Don't have an account?
            <router-link to="/User/signup"
                class="cursor-pointer border-b border-gray-400 hover:border-gray-800">Register
                here</router-link>
        </p>
    </form>

</template>