<script>


export default {
    data() {
        return {


        }
    },
}
</script>
<template>
    <div class="flex px-20 py-10 font-Ubuntu ">
        <div class="w-2/4 flex flex-col gap-10">
            <div class="w-full flex gap-4 font-semibold">
                <router-link
                    class=" cursor-pointer w-44 h-16 rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-gray-500/75 transform duration-200 ease-in-out  border border-gray-500 p-4 justify-center items-center flex"
                    to="/User/signup">Sign up</router-link>

                <router-link to="/User/login"
                    class=" cursor-pointer w-44 h-16 bg-purple rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out  border border-gray-500 p-4 justify-center items-center flex">Log
                    in</router-link>
            </div>
            <img class="w-3/4" src="../assets/woman.png" alt="">

        </div>

        <router-view></router-view>

    </div>
</template>