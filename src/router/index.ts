import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/layout.vue'),
      children: [
        {
          path: '/',
          name: 'building',
          component: () => import('@/views/ElevatorSystem.vue')
        },
      ]
    }
  ]
})

export default router
