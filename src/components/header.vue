<script>

</script>
<template>
    <div class="sticky top-0 w-full z-50 border-b-black border-solid border">
        <nav class="font-Ubuntu flex justify-between bg-white text-lg px-10 py-6  ">
            <RouterLink class="font-Anton w-3/4 text-3xl pr-10" to="/">shopChella</RouterLink>
      

            <ul class="flex w-1/4 uppercase gap-4 justify-center items-center">
                <router-link  to="/User"> <i class="fa fa-user-o" aria-hidden="true"></i></router-link>     
                <i class="fa fa-shopping-cart text-black" aria-hidden="true"></i>         
            </ul>
        </nav>
    </div>
</template>
