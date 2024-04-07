import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ForbiddenView from '@/views/ForbiddenView.vue'
import ProfileListView from '@/views/profile/ProfileListView.vue'
import ProfileCreateView from '@/views/profile/ProfileCreateView.vue'
import ProfileDetailUpdateDeleteView from '@/views/profile/ProfileDetailUpdateDeleteView.vue'
import ChatGPTView from '@/views/ChatGPTView.vue'
import ChatView from '@/views/ChatView.vue'
import TestListView from '@/views/test/TestListView.vue'
import TestEditView from '@/views/test/TestEditView.vue'
import TestSolveView from '@/views/test/TestSolveView.vue'
import TestForbiddenView from '@/views/test/TestForbiddenView.vue'
import TestResultsView from '@/views/test/TestResultsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'forbidden',
      component: ForbiddenView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile-list',
      name: 'profile-list',
      component: ProfileListView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile-create',
      name: 'profile-create',
      component: ProfileCreateView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      }
    },
    {
      path: '/profile/:id',
      name: 'profile-detail',
      component: ProfileDetailUpdateDeleteView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chatgpt',
      name: 'chatgpt',
      component: ChatGPTView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/test',
      name: 'test',
      component: TestListView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/test/:id/solve',
      name: 'test-solve',
      component: TestSolveView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/test/:id/result',
      name: 'test-result',
      component: TestResultsView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/test/:id/edit',
      name: 'test-edit',
      component: TestEditView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'test-forbidden',
      component: TestForbiddenView,
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.user.isAuthenticated) {
    next({ name: 'auth' })
  } else if (to.name === 'auth' && userStore.user.isAuthenticated) {
    next({ name: 'forbidden' })
  } else if ((to.matched.some(record => record.meta.requiresAdmin) && !userStore.user.profile.permissions.filter(el => el.name === 'adm').length)) {
    next({ name: 'forbidden' })
  } else {
    next()
  }

  if (userStore.user.isAuthenticated) {
    userStore.getMe()
  }
})

export default router
