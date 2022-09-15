import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/store/auth.store";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];

  const authRequired = !publicPages.includes(to.path);

  const authStore = useAuthStore();

  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.path;
    next("/login");
  } else {
    next();
  }
});

export default router;
