
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'register', component: () => import('pages/Register.vue') },
      { path: 'reserve', component: () => import('pages/Reserve.vue'), meta: { requiresAuth: true } },
      { path: 'visit/:id', component: () => import('pages/Visit.vue'), meta: { requiresAuth: true } },
      { path: 'offer', component: () => import('pages/OfferEdit.vue'), meta: { requiresAuth: true } },
      { path: 'home', component: () => import('pages/Register.vue'), meta: { requiresAuth: true } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
