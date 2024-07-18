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
      path: "/Shop",
      name: "Shop",
      meta: { requiresAuth: true },
      component: () => import("../views/Shop.vue"),
      children: [
        {
          path: ":category",
          name: "Category",
          component: () => import("../views/ShopCategories.vue"),
        },
      ],
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
      children:[
        {
          path: "Products",
          name: "AdminProducts",
          component: () => import("../views/AdminProducts.vue"),
        },
        {
          path: "Orders",
          name: "AdminOrders",
          component: () => import("../views/AdminOrders.vue"),
        },
      ]
    },
    {
      path: "/Checkout",
      name: "Checkout",
      meta: { requiresAuth: true },
      component: () => import("../views/Checkout.vue"),
    },
    {
      path: "/Information",
      name: "Information",
      meta: { requiresAuth: true },
      component: () => import("../views/Information.vue"),
    },
    {
      path: "/Tracking",
      name: "Tracking",
      meta: { requiresAuth: true },
      component: () => import("../views/TrackingPackage.vue"),
    }
  ],
});

router.beforeEach(async (to, from) => {
  let loggedIn =
    (localStorage.getItem("loggedIn") == "true" ? true : false) || false;
  let userUID = localStorage.getItem("userUID");
  if (to.path.includes("User") && loggedIn)
    return { path: "/Shop/allcategories" };
  if (
    to.path.includes("Admin") &&
    loggedIn &&
    userUID !== "lvfgmkM6dtfKWye6GUeMdr9ob462"
  )
    return { path: "/" };
  if (to.path == "/User" || to.path == "/User/") return { name: "Login" };
  if (to.meta.requiresAuth && !loggedIn) return { name: "Login" };
  if (to.meta.requiresAuth && loggedIn) return true;

  if (!to.meta.requiresAuth && !loggedIn) return true;
});

export default router;
