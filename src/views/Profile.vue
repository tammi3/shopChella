<script>
import {auth, signOut, onAuthStateChanged} from '../main.js'

export default {
    methods: {
        
        logOut() {
            signOut(auth)
                .then(() => {
                    console.log('user signed out')
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
         
            } else{
                this.$router.push('User/login');
            }
        });
    }
}
</script>
<template>
    <div>
        <button @click="logOut">LOGOUT</button>
    </div>
</template>