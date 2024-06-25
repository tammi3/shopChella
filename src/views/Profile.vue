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
} from "../db/firebase.js";

export default {
  data() {
    return {
      userInfo: {},
      // updateProfileImage: true,
    };
  },
  methods: {
    uploadImage() {
      var updateImg = document.getElementById("updateImg");
      var inputFile = document.getElementById("inputFile");
      updateImg.src = URL.createObjectURL(inputFile.files[0]);
      var image = inputFile.files[0];
      const user = auth.currentUser;
      const storageRef = ref(storage, image.name);

      //uploads image to database
      uploadBytes(storageRef, image).then((snapshot) => {
        //updates the user profile picture information
        updateDoc(doc(db, "users", user.uid), {
          profile_image: image.name,
          updatedProfileImage: true,
        });
      });
    },
    logOut() {
      signOut(auth)
        .then(() => {
          this.$router.replace({ name: "Login" });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    deleteUser() {
      const user = auth.currentUser;
      const storageRef = ref(storage, user.profile_image);
      const userRef = doc(db, "users", user.uid);
      deleteUser(user)
        .then(() => {
          deleteDoc(userRef).then(() => {
            deleteObject(storageRef)
              .then(() => {
                // File deleted successfully
              })
              .catch((error) => {
                // Uh-oh, an error occurred!
              });
          });
        })
        .catch((error) => {
          // An error ocurred
          // ...
        });
    },
  },
  created() {
    const user = auth.currentUser;
    onSnapshot(doc(db, "users", user.uid), (doc) => {
      this.userInfo = doc.data();
      if (this.userInfo.updatedProfileImage) {
        getDownloadURL(ref(storage, this.userInfo.profile_image))
          .then((url) => {
            // Or inserted into an <img> element
            const img = document.getElementById("profileImg");
            img.setAttribute("src", url);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    });
  },
};
</script>
<template>
  <div
    v-if="userInfo.name"
    class="flex flex-col px-20 py-10 font-Ubuntu w-full gap-10"
  >
    <h1 class="text-6xl">Hello, {{ userInfo.name.firstname }} !</h1>
    <div class="flex w-full gap-16 justify-center">
      <div class="w-1/4 p-4 flex gap-3 flex-col justify-center items-center">
        <img
          v-if="!userInfo.updatedProfileImage"
          id="updateImg"
          class="h-96 w-96 rounded-full"
          src="../assets/user.png"
          alt=""
        />
        <img
          v-if="userInfo.updatedProfileImage"
          id="profileImg"
          class="h-96 w-96 rounded-full"
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
            class="absolute bg-purple w-56 h-8 text-lg font-medium rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          >
            Update image
          </label>
        </div>
      </div>
      <div class="w-3/4 flex flex-col gap-10 py-4 pl-10">
        <div class="text-4xl font-medium">User Information</div>
        <div class="flex flex-col gap-3">
          <!-- Name -->
          <div class="flex flex-col gap-3 p-2">
            <h1 class="text-2xl font-normal tracking-wide">Name</h1>
            <h2 class="text-lg font-normal">
              {{ userInfo.name.firstname }} {{ userInfo.name.lastname }}
            </h2>
          </div>

          <!-- Address -->
          <div class="flex flex-col gap-3 p-2">
            <h1 class="text-2xl font-normal tracking-wide">Address</h1>
            <div class="flex gap-2">
              <i class="fa fa-home pt-1" aria-hidden="true"></i>
              <div class="flex flex-col gap-2">
                <h2 class="text-lg font-normal">
                  {{ userInfo.address.street }}
                </h2>
                <h2 class="text-lg font-normal">
                  {{ userInfo.address.city }}, {{ userInfo.address.country }}.
                </h2>
              </div>
            </div>
          </div>

          <!-- Contact-->
          <div class="flex flex-col gap-3 p-2">
            <h1 class="text-2xl font-normal tracking-wide">Contact</h1>
            <div class="flex flex-col gap-8">
              <div class="flex gap-2">
                <i
                  class="fa fa-phone flex items-center justify-center"
                  aria-hidden="true"
                ></i>
                <h2 class="text-lg font-normal">{{ userInfo.phone }}</h2>
              </div>
              <div class="flex gap-2">
                <i
                  class="fa fa-envelope flex items-center justify-center"
                  aria-hidden="true"
                ></i>
                <h2 class="text-lg font-normal">{{ userInfo.email }}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-10">
          <button
            class="bg-purple w-96 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
            @click="logOut"
          >
            LOGOUT
          </button>
          <button
            class="bg-purple w-96 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
            @click="logOut"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
