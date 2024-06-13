import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import SignUp from '../views/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/Shop',
      name: 'Shop',
      component: () => import('../views/Shop.vue')
    },
    {
      path: '/Product/:id',
      name: 'Product',
      component: () => import('../views/Product.vue')
    },
    {
      path: '/User',
      name: 'User',
      component: () => import('../views/User.vue'),
      children: [
        {
         
          path: 'login',
          component: () => import('../views/Login.vue')
        },
        {
          path: 'signup',
          component: SignUp
        }
      ]
    },
 
  ]
})

export default router
