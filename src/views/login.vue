<template>
    <div class="w-3/4 flex flex-col gap-3">
        <label for="">Email</label>
        <input class="font-normal border-b border-gray-600" type="text" placeholder="name@address.com" name="" id="">
    </div>
    <div class="w-3/4 flex flex-col gap-3 tracking-wide">
        <label for="">Password</label>
        <input class="font-normal border-b border-gray-600" type="text" placeholder="Password" name="" id="">
    </div>
    <a class="bg-purple w-3/4 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
        href="http://">SIGN IN</a>
    <p class="font-normal tracking-wide">Don't have an account? 
        <router-link to="/User/signup" class="cursor-pointer border-b border-gray-400 hover:border-gray-800">Register here</router-link> </p>
</template>