import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import SignUp from "../views/Signup.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/Shop/:category?",
      name: "Shop",
      component: () => import("../views/Shop.vue"),
      // redirect: '/shop/categories',
      // children: [
      //   {

      //     path: ':category',
      //     component: () => import('../views/Category.vue')
      //   },

      // ]
    },
    {
      path: "/Product/:id",
      name: "Product",
      component: () => import("../views/Product.vue"),
    },
    {
      path: "/User",
      name: "User",
      component: () => import("../views/User.vue"),
      children: [
        {
          path: "login",
          component: () => import("../views/Login.vue"),
        },
        {
          path: "signup",
          component: SignUp,
        },
      ],
    },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
  }
  ],
});

export default router;
