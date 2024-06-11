<script>
export default{
    data() {
        return {
            cart:"",
            cartDisplay:""
        }
    },
    methods:{
        toggleCart(){
            this.cart = document.querySelector("#cart");
            this.cartDisplay = document.querySelector("#cartDisplay");

      if (this.cartDisplay.classList.contains("hidden")) {
        this.cartDisplay.classList.remove("hidden");
        this.cartDisplay.classList.add("flex");
      } else {
        this.cartDisplay.classList.add("hidden");
        this.cartDisplay.classList.remove("flex");
      }
        }
    }
}
</script>
<template>
    <div class="sticky top-0 w-full z-50 border-b-black border-solid border">
        <nav class="font-Ubuntu flex justify-between bg-white text-lg px-10 py-6  ">
            <RouterLink class="font-Anton w-3/4 text-3xl pr-10" to="/">shopChella</RouterLink>
      

            <ul class="flex w-1/4 uppercase gap-4 justify-center items-center">
                <router-link class="hover:opacity-60" to="/User/signup"> <i class="fa fa-user-o fa-lg" aria-hidden="true"></i></router-link>     
                <img @click="toggleCart" id="cart" class="w-7 hover:opacity-60 cursor-pointer" src="../assets/bag.png">       
            </ul>
        </nav>
       
        <div id="cartDisplay" class="w-full right-0 h-screen absolute hidden justify-end top-0 backdrop-blur-lg z-50">
          <div class="w-2/4 bg-white z-50 h-screen flex flex-col">
           <div class="w-full p-10 flex justify-end items-center">
            <svg class="cursor-pointer" @click="toggleCart" xmlns="http://www.w3.org/2000/svg" width="20" height="21"><g fill="#e4c1f9" fill-rule="evenodd"><path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z"/><path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z"/></g></svg>
           </div>
            Your cart is empty
          </div>
        </div>
    
    </div>
</template>
