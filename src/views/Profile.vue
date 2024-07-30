<script>
import {
  auth,
  signOut,
  onSnapshot,
  doc,
  db,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  deleteUser,
  deleteDoc,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "../db/firebase.js";
import togglePassword from "@/mixins/togglePassword.js";
import AppFooter from "../components/Footer.vue";

export default {
  mixins: [togglePassword],
  components: {
    AppFooter,
  },
  props: ["categories"],
  data() {
    return {
      userInfo: {},
      loadingDeleteAcc: false,
      loadingUpdateImg: false,
      loadingDeleteImg: false,
      error: "",
      password: "",
      loadingProfile: true,
    };
  },

  methods: {
    uploadImage() {
      this.loadingUpdateImg = true;
      var updateImg = document.getElementById("updateImg");
      var inputFile = document.getElementById("inputFile");
      updateImg.src = URL.createObjectURL(inputFile.files[0]);
      var image = inputFile.files[0];
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + image.name);

      //uploads image to database
      uploadBytes(storageRef, image).then((snapshot) => {
        //updates the user profile picture information
        updateDoc(doc(db, "users", user.uid), {
          profile_image: image.name,
          updatedProfileImage: true,
        });
        this.loadingUpdateImg = false;
      });
    },
    deleteImage() {
      this.loadingDeleteImg = true;
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + this.userInfo.profile_image);
      deleteObject(storageRef).then(() => {
        updateDoc(doc(db, "users", user.uid), {
          updatedProfileImage: false,
        });
        this.loadingDeleteImg = false;
      });
    },

    deleteUserCred() {
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + this.userInfo.profile_image);
      const userRef = doc(db, "users", this.userInfo.userId);

      if (this.userInfo.updatedProfileImage) {
        this.loadingDeleteAcc = true;
        const credential = EmailAuthProvider.credential(user.email, this.password);
        reauthenticateWithCredential(user, credential)
          .then(() => {
            deleteUser(user)
              .then(() => {
                console.log("user deleted");
                deleteObject(storageRef)
                  .then(() => {
                    console.log("image deleted");
                    deleteDoc(userRef).then(() => {
                      this.$router.replace({ name: "Signup" });
                    });
                  })
                  .catch((error) => {});
              })
              .catch((error) => {});
          })
          .catch((error) => {
            // An error ocurred
            this.error = "Incorrect password";
            if (this.error !== "") this.loadingDeleteAcc = false;
          });
      } else {
        this.loadingDeleteAcc = true;
        const credential = EmailAuthProvider.credential(user.email, this.password);
        reauthenticateWithCredential(user, credential)
          .then(() => {
            deleteUser(user)
              .then(() => {
                console.log("user deleted");

                deleteDoc(userRef).then(() => {
                  this.$router.replace({ name: "Signup" });
                });
              })
              .catch((error) => {});
          })
          .catch((error) => {
            this.error = "Incorrect password";
            this.loading = false;
          });
      }
    },
    toggleReauthUser() {
      this.reauthUser = document.querySelector("#reauthUser");

      if (this.reauthUser.classList.contains("hidden")) {
        this.reauthUser.classList.remove("hidden");
        this.reauthUser.classList.add("flex");
      } else {
        this.reauthUser.classList.add("hidden");
        this.reauthUser.classList.remove("flex");
      }
    },
  },
  created() {
    const user = auth.currentUser;
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      this.userInfo = doc.data();

      if (this.userInfo.updatedProfileImage) {
        getDownloadURL(ref(storage, "profile/" + this.userInfo.profile_image))
          .then((url) => {
            // Or inserted into an <img> element

            const img = document.getElementById("profileImg");
            img.setAttribute("src", url);
          })
          .catch((error) => {});
      }

      setTimeout(() => {
        if (this.userInfo.name) {
          this.loadingProfile = false;
        }
      }, 2000);
    });
  },
};
</script>
<template>
  <div v-if="userInfo.name">
    <div v-show="!loadingProfile" class="bg-gray-100">
      <div class="container mx-auto p-4">
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          <!-- Profile Picture -->

          <div class="w-full flex gap-3 flex-col justify-center items-center mb-4">
            <!-- default profile image -->
            <img
              v-if="!userInfo.updatedProfileImage"
              id="updateImg"
              class="w-32 h-32 rounded-full object-cover"
              src="../assets/default-profile-picture.png"
              alt=""
            />
            <!-- custom profile image -->
            <img
              v-show="userInfo.updatedProfileImage"
              id="profileImg"
              class="w-32 h-32 rounded-full object-cover"
              src=""
              alt=""
            />
            <div class="flex py-4 relative items-center justify-center">
              <!--default html file upload button-->
              <input
                v-if="!userInfo.updatedProfileImage"
                class="opacity-0"
                type="file"
                accept="image/png, image/jpeg"
                id="inputFile"
                v-on:change="uploadImage"
              />

              <!--custom html file upload button-->
              <label
                v-if="!userInfo.updatedProfileImage"
                for="inputFile"
                class="absolute w-56 h-8 uppercase cursor-pointer font-bold rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
              >
                <img
                  v-if="loadingUpdateImg"
                  class="animate-spin-slow w-6"
                  src="../assets/loading.png"
                  alt=""
                />
                <span v-if="!loadingUpdateImg"> Update image</span>
              </label>

              <!-- delete image -->
              <button
                @click="deleteImage"
                v-if="userInfo.updatedProfileImage"
                class="w-56 h-8 uppercase cursor-pointer font-bold rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
              >
                <img
                  v-if="loadingDeleteImg"
                  class="animate-spin-slow w-6"
                  src="../assets/loading.png"
                  alt=""
                />
                <span v-if="!loadingDeleteImg">Delete image</span>
              </button>
            </div>
          </div>

          <!-- User Name -->
          <div class="text-center mb-4">
            <h1 class="text-2xl font-bold">
              {{ userInfo.name.firstname }} {{ userInfo.name.lastname }}
            </h1>
          </div>

          <!-- User Info -->
          <div class="w-full sm:w-1/2 mb-4">
            <!-- Email -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold">Email:</label>
              <p class="text-gray-600">{{ userInfo.email }}</p>
            </div>

            <!-- Phone -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold">Phone:</label>
              <p class="text-gray-600">{{ userInfo.phone }}</p>
            </div>

            <!-- Street -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold">Street:</label>
              <p class="text-gray-600">{{ userInfo.address.street }}</p>
            </div>

            <!-- City -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold">City:</label>
              <p class="text-gray-600">{{ userInfo.address.city }}</p>
            </div>

            <!-- Country -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold">Country:</label>
              <p class="text-gray-600">{{ userInfo.address.country }}</p>
            </div>
          </div>

          <div class="flex w-full justify-center items-center">
            <button
              class="w-56 h-10 uppercase cursor-pointer font-bold rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
              @click="toggleReauthUser"
            >
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- skeleton -->
    <div v-if="loadingProfile">
      <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
    </div>
    <div
      id="reauthUser"
      class="w-full right-0 h-screen absolute hidden justify-center items-center top-0 backdrop-blur-lg z-50"
    >
      <form
        @sumbit.prevent="toggleReauthUser"
        class="w-2/4 h-2/4 items-center justify-start bg-white z-50 flex flex-col gap-4 shadow-lg border-gray-400"
      >
        <div class="w-full px-10 py-4 flex justify-end items-center">
          <svg
            class="cursor-pointer"
            @click="toggleReauthUser"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
          >
            <g fill="#e4c1f9" fill-rule="evenodd">
              <path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z" />
              <path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z" />
            </g>
          </svg>
        </div>
        <p v-if="error != ''" class="text-red-600">{{ error }}</p>
        <div
          class="font-Ubuntu flex flex-col gap-16 p-10 tracking-wide justify-center items-center"
        >
          <label for="">Enter your password to delete your account.</label>
          <div class="w-full flex relative">
            <input
              id="userPassword"
              class="focus:outline-none w-full font-normal border-b border-gray-600"
              type="password"
              placeholder="Password"
              required
              name="password"
              v-model="password"
              v-on:keydown="error = ''"
            />
            <i
              class="fa fa-eye fa-lg py-1 pl-2 border-b border-gray-600 cursor-pointer"
              id="iconEye"
              @click="togglePassword"
              aria-hidden="true"
            ></i>
          </div>
        </div>
        <button
          class="w-56 h-8 uppercase cursor-pointer font-bold rounded-xl hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 border bg-black text-white hover:shadow-black/60 border-black p-4 justify-center items-center flex"
          type="sumbit"
        >
          <img
            v-if="loadingDeleteAcc"
            class="animate-spin-slow w-6"
            src="../assets/loading.png"
            alt=""
          />
          <span v-if="!loadingDeleteAcc">DELETE ACCOUNT</span>
        </button>
      </form>
    </div>
  </div>
</template>
