export default{
    methods:{
        togglePassword() {
            var userPassword = document.querySelector('#password');
            var iconEye = document.querySelector('#iconEye');
            if (userPassword.type === "password") {
               userPassword.type = "text";
                iconEye.classList.remove("fa-eye");
                iconEye.classList.add("fa-eye-slash");
            } else {
               userPassword.type = "password";
                iconEye.classList.add("fa-eye");
                iconEye.classList.remove("fa-eye-slash");
            }
        }
    }
}