import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/landing/LandingPage.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/pages/catalog/CatalogPage.vue')
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/pages/product/ProductPage.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/cart/CartPage.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/checkout/CheckoutPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/profile/ProfilePage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/catalog'
    }
  ]
})

export default router
