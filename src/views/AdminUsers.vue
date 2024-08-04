@
<script>
import {
  db,
  query,
  doc,
  onSnapshot,
  collection,
  Timestamp,
  updateDoc,
  getDocs,
  where,
} from "../db/firebase.js";
export default {
  data() {
    return {
      admins: [],
      orderStatus: [],
      updatedAdmin: "",
      loading: false,
      isAdmin: "",
      newAdminEmail: "",
      newAdmin: {},
      loadingUsersTab: true
    };
  },
  methods: {
    toggleSelect(id, email) {
      const status = document.getElementById(id);
      const statusSelect = document.getElementById(id + email);
      if (
        status.classList.contains("flex") &&
        statusSelect.classList.contains("hidden")
      ) {
        status.classList.remove("flex");
        status.classList.add("hidden");
        statusSelect.classList.add("flex");
        statusSelect.classList.remove("hidden");
      } else {
        status.classList.add("flex");
        status.classList.remove("hidden");
        statusSelect.classList.remove("flex");
        statusSelect.classList.add("hidden");
      }
    },
    async updateAdminStatus(admin) {
      this.loading = true;
      if (this.updatedAdmin == "True") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      await updateDoc(doc(db, "users", admin.id), {
        isAdmin: this.isAdmin,
        updated_at: Timestamp.fromDate(new Date()),
      }).then(() => {
        console.log("updated!");
        this.getAdmins();
        this.toggleSelect(admin.id, admin.email);
        this.loading = false;
        this.updatedAdmin = "";
      });
    },
    async addAdmin() {
      this.newAdmin = {};
      const adminsRef = collection(db, "users");
      const q = query(adminsRef, where("email", "==", this.newAdminEmail));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.newAdmin = { id: doc.id };
      });
      if (this.newAdmin != "") {
        await updateDoc(doc(db, "users", this.newAdmin.id), {
          isAdmin: true,
          updated_at: Timestamp.fromDate(new Date()),
        }).then(() => {
          this.newAdmin = "";
          this.getAdmins();
        });
      }
    },
    async getAdmins() {
      this.admins = [];
      const adminsRef = collection(db, "users");
      const q = query(adminsRef, where("isAdmin", "==", true));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.admins.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  async created() {
    this.getAdmins();

    setTimeout(() => {
      this.loadingUsersTab = false;
    }, 2000);
  },
};
</script>
<template>
  <div v-show="!loadingUsersTab" class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="w-full p-4 flex justify-center items-center font-semibold">
      <div class="w-full flex space-x-2 justify-center items-center">
        <input required v-model="newAdminEmail" type="email"
          class="max-w-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="add admin by email" />
        <button @click="addAdmin()"
          class="text-2xl font-bold text-white bg-black rounded-lg h-10 w-10 flex items-center justify-center">
          +
        </button>
      </div>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
      <thead class="text-xs text-gray-700 uppercase bg-gray-100 ">
        <tr>
          <th scope="col" class="py-3 px-6">Name</th>
          <th scope="col" class="py-3 px-6">Email</th>
          <th scope="col" class="py-3 px-6">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" class="bg-white border-b hover:bg-gray-50 ">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {{ admin.name.firstname }} {{ admin.name.lastname }}
          </th>

          <td class="px-6 py-4 whitespace-nowrap">
            {{ admin.email }}
          </td>

          <td :id="admin.id" class="flex items-center px-6 py-4 gap-2 whitespace-nowrap">
            <p>{{ admin.isAdmin }}</p>
            <a @click="toggleSelect(admin.id, admin.email)"
              class="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
          </td>
          <td :id="admin.id + admin.email" class="hidden items-center px-6 py-4 gap-2 whitespace-nowrap">
            <select v-if="!loading" @change="updateAdminStatus(admin)" v-model="updatedAdmin" id="small"
              class="block p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option disabled selected>Update status</option>

              <option>True</option>
              <option>False</option>
            </select>
            <img v-else class="animate-spin-slow w-6" src="../assets/loading.png" alt="" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="loadingUsersTab">
    <div class="w-full h-dvh animate-pulse bg-gray-300"></div>
  </div>
</template>
