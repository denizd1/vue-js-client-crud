import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
// import store from '@/store/index.js';
Vue.use(Router);

export const router = new Router({
  //mode: "history",
  routes: [
    {
      path: "/tutorials-list",
      alias: "/tutorials-list",
      name: "tutorials-list",
      component: () => import("./components/TutorialsList")
    },
    {
      path: "/tutorials/edit/:id",
      name: "tutorial-edit",
      component: () => import("./components/TutorialEdit")
    },
    {
      path: "/tutorials/:id",
      name: "tutorial",
      component: () => import("./components/Tutorial")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/AddTutorial")
    },
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/profile',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile')
    },
    {
      path: '/turkey-map',
      name: "turkey-map",
      component: () => import('./components/TurkeyMap')
    },
    // {
    //   path: '/admin',
    //   name: 'admin',
    //   // lazy-loaded
    //   component: () => import('./views/BoardAdmin.vue')
    // },
    // {
    //   path: '/mod',
    //   name: 'moderator',
    //   // lazy-loaded
    //   component: () => import('./views/BoardModerator.vue')
    // },
    // {
    //   path: '/user',
    //   name: 'user',
    //   // lazy-loaded
    //   component: () => import('./views/BoardUser.vue')
    // }
  ]
});

// router.beforeResolve((to, from, next) => {
//   if (to.matched.some(record => record.meta.auth)) {
//     if (!store.getters.authToken) {
//       next({ name: 'home' });
//     } else {
//       next();
//     }
//   } else {
//     next(); // Very important to call next() in this case!
//   }
// })