<script>
import { signInWithEmailAndPassword, auth, onAuthStateChanged} from '../main.js'
import togglePassword from '@/mixins/togglePassword.js';
export default {
    mixins: [togglePassword],
    data() {
        return {

        }
    },
    methods: {
        handleSubmit() {

            const loginForm = document.querySelector('.login')


            const email = loginForm.email.value
            const password = loginForm.password.value
            signInWithEmailAndPassword(auth, email, password)
                .then(cred => {
                    console.log('user logged in:', cred.user)
                    loginForm.reset()
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    },
    created() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                console.log(uid);
                this.$router.push('/shop');
              
            }
        });
    }
}

</script>


<template>
    <form @submit.prevent="handleSubmit"
        class="login w-2/4 p-10 flex flex-col justify-center items-center gap-10 font-medium tracking-wide">
        <div class="w-3/4 flex flex-col gap-3">
            <label for="">Email</label>
            <input class="font-normal border-b border-gray-600" type="text" placeholder="@johndoe" name="email" id="">
        </div>
        <div class="w-3/4 flex flex-col gap-3 tracking-wide">
            <label for="">Password</label>
            <div class="w-full flex relative">
                <input id="userPassword"
                    class="w-full font-normal border-b border-gray-600" type="password" placeholder="Password"
                    name="password">
                <i class="fa fa-eye fa-lg py-1 pl-2 border-b border-gray-600 cursor-pointer" id="iconEye"
                    @click="togglePassword" aria-hidden="true"></i>
            </div>
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