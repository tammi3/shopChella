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

export default {
  mixins: [togglePassword],
  data() {
    return {
      userInfo: {},
      loading: false,
      error: "",
      password: "",
      admin: false,
    };
  },

  methods: {
    uploadImage() {
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
      });
    },
    deleteImage() {
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + this.userInfo.profile_image);
      deleteObject(storageRef).then(() => {
        updateDoc(doc(db, "users", user.uid), {
          updatedProfileImage: false,
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
    deleteUserCred() {
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + this.userInfo.profile_image);
      const userRef = doc(db, "users", this.userInfo.userId);

      if (this.password == "") this.error = "Enter your password.";
      else if (this.userInfo.updatedProfileImage) {
        this.loading = true;
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
            if (this.error !== "") this.loading = false;
          });
      } else {
        this.loading = true;
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
      if (this.userInfo.userId == "lvfgmkM6dtfKWye6GUeMdr9ob462") {
        this.admin = true;
      }
      if (this.userInfo.updatedProfileImage) {
        getDownloadURL(ref(storage, "profile/" + this.userInfo.profile_image))
          .then((url) => {
            // Or inserted into an <img> element

            const img = document.getElementById("profileImg");
            img.setAttribute("src", url);
          })
          .catch((error) => {});
      }
    });
  },
};
</script>
<template>
  <div v-if="userInfo.name" class="flex flex-col px-20 py-8 font-Ubuntu w-full gap-10">
    <div class="flex w-full gap-10 py-3">
      <h1 class="text-6xl w-2/4">Hello, {{ userInfo.name.firstname }} !</h1>
      <div class="w-2/4 px-3 flex justify-end items-center">
        <RouterLink
          v-if="admin"
          class="bg-purple w-56 h-8 text-lg font-medium rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          to="/Admin"
          >Admin</RouterLink
        >
      </div>
    </div>

    <div class="flex w-full gap-16 justify-center">
      <div class="w-1/4 p-4 flex gap-3 flex-col justify-center items-center">
        <!-- default profile image -->
        <img
          v-if="!userInfo.updatedProfileImage"
          id="updateImg"
          class="h-96 w-96 rounded-full"
          src="../assets/user.png"
          alt=""
        />
        <!-- custom profile image -->
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

          <!-- delete image -->
          <button
            @click="deleteImage"
            v-if="userInfo.updatedProfileImage"
            class="bg-purple w-56 h-8 text-lg font-medium rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          >
            Delete image
          </button>
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
            @click="toggleReauthUser"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
    <div
      id="reauthUser"
      class="w-full right-0 h-screen absolute hidden justify-center items-center top-0 backdrop-blur-lg z-50"
    >
      <div
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
          class="bg-purple w-96 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          @click="deleteUserCred"
        >
          <img
            v-if="loading"
            class="animate-spin-slow w-6"
            src="../assets/loading.png"
            alt=""
          />
          <span v-if="!loading">DELETE ACCOUNT</span>
        </button>
      </div>
    </div>
  </div>
</template>
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

export default {
  mixins: [togglePassword],
  data() {
    return {
      userInfo: {},
      loading: false,
      error: "",
      password: "",
      admin: false,
    };
  },

  methods: {
    uploadImage() {
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
      });
    },
    deleteImage() {
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + this.userInfo.profile_image);
      deleteObject(storageRef).then(() => {
        updateDoc(doc(db, "users", user.uid), {
          updatedProfileImage: false,
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
    deleteUserCred() {
      const user = auth.currentUser;
      const storageRef = ref(storage, "profile/" + this.userInfo.profile_image);
      const userRef = doc(db, "users", this.userInfo.userId);

      if (this.password == "") this.error = "Enter your password.";
      else if (this.userInfo.updatedProfileImage) {
        this.loading = true;
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
            if (this.error !== "") this.loading = false;
          });
      } else {
        this.loading = true;
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
      if (this.userInfo.userId == "lvfgmkM6dtfKWye6GUeMdr9ob462") {
        this.admin = true;
      }
      if (this.userInfo.updatedProfileImage) {
        getDownloadURL(ref(storage, "profile/" + this.userInfo.profile_image))
          .then((url) => {
            // Or inserted into an <img> element

            const img = document.getElementById("profileImg");
            img.setAttribute("src", url);
          })
          .catch((error) => {});
      }
    });
  },
};
</script>
<template>
  <div v-if="userInfo.name" class="flex flex-col px-20 py-8 font-Ubuntu w-full gap-10">
    <div class="flex w-full gap-10 py-3">
      <h1 class="text-6xl w-2/4">Hello, {{ userInfo.name.firstname }} !</h1>
      <div class="w-2/4 px-3 flex justify-end items-center">
        <RouterLink
          v-if="admin"
          class="bg-purple w-56 h-8 text-lg font-medium rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          to="/Admin"
          >Admin</RouterLink
        >
      </div>
    </div>

    <div class="flex w-full gap-16 justify-center">
      <div class="w-1/4 p-4 flex gap-3 flex-col justify-center items-center">
        <!-- default profile image -->
        <img
          v-if="!userInfo.updatedProfileImage"
          id="updateImg"
          class="h-96 w-96 rounded-full"
          src="../assets/user.png"
          alt=""
        />
        <!-- custom profile image -->
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

          <!-- delete image -->
          <button
            @click="deleteImage"
            v-if="userInfo.updatedProfileImage"
            class="bg-purple w-56 h-8 text-lg font-medium rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          >
            Delete image
          </button>
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
            @click="toggleReauthUser"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
    <div
      id="reauthUser"
      class="w-full right-0 h-screen absolute hidden justify-center items-center top-0 backdrop-blur-lg z-50"
    >
      <div
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
          class="bg-purple w-96 h-16 font-bold rounded-lg hover:translate-x-0 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple/75 transform duration-200 ease-in-out border border-gray-500 p-4 justify-center items-center flex"
          @click="deleteUserCred"
        >
          <img
            v-if="loading"
            class="animate-spin-slow w-6"
            src="../assets/loading.png"
            alt=""
          />
          <span v-if="!loading">DELETE ACCOUNT</span>
        </button>
      </div>
    </div>
  </div>
</template>
