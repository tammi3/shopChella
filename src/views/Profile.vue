<script>
import {auth, signOut} from '../db/firebase.js'

export default {
    methods: {
        
        logOut() {
            signOut(auth)
                .then(() => {
                    console.log('user signed out')
                    this.$router.replace({name: 'Login'})
                })
                .catch(err => {
                    console.log(err.message)
                })

        }
    }
}
</script>
<template>
    <div>
        <button @click="logOut">LOGOUT</button>
    </div>
</template>