import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { requiresAuth: false },
      component: Home,
    },
    {
      path: "/Shop/:category?",
      name: "Shop",
      meta: { requiresAuth: true },
      component: () => import("../views/Shop.vue"),
    },
    {
      path: "/Product/:id",
      name: "Product",
      meta: { requiresAuth: true },
      component: () => import("../views/Product.vue"),
    },
    {
      path: "/User",
      name: "User",
      meta: { requiresAuth: false },
      component: () => import("../views/User.vue"),
      children: [
        {
          path: "login",
          name: "Login",
          component: () => import("../views/Login.vue"),
        },
        {
          path: "signup",
          name: "Signup",
          component: () => import("../views/Signup.vue"),
        },
      ],
    },
    {
      path: "/Profile",
      name: "Profile",
      meta: { requiresAuth: true },
      component: () => import("../views/Profile.vue"),
    },
    {
      path: "/Admin",
      name: "Admin",
      meta: { requiresAuth: true },
      component: () => import("../views/Admin.vue"),
      children: [
        {
          path: "adminProducts",
          name: "AdminProducts",
          component: () => import("../views/AdminProducts.vue"),
        },
        {
          path: "adminCats",
          name: "AdminCats",
          component: () => import("../views/AdminCats.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from) => {
  let loggedIn =
    (localStorage.getItem("loggedIn") == "true" ? true : false) || false;

  if (to.path.includes("User") && loggedIn) return { name: "Shop" };
  if (to.meta.requiresAuth && !loggedIn) return { name: "Login" };
  if (to.meta.requiresAuth && loggedIn) return true;
  // if (to.path.includes("Admin") && loggedIn && user.uid=="lvfgmkM6dtfKWye6GUeMdr9ob462") return true;
  if (!to.meta.requiresAuth && !loggedIn) return true;
});

export default router;
