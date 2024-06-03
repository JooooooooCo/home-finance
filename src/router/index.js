import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import { useAuthStore } from "@/store/auth.store";
import { useCostCenterStore } from "@/store/cost_center.store";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/cost-center-selection",
    name: "cost-center-selection",
    component: () =>
      import(
        /* webpackChunkName: "cost-center-selection" */ "../views/CostCenterSelectionView.vue"
      ),
  },
  {
    path: "/cash-flow",
    name: "cash-flow",
    component: () =>
      import(/* webpackChunkName: "cash-flow" */ "../views/CashFlowView.vue"),
  },
  {
    path: "/settings/cost-center",
    name: "settings-cost-center",
    component: () =>
      import(
        /* webpackChunkName: "settings-cost-center" */ "../views/settings/CostCenterView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const elemBody = document.getElementById("body");
  elemBody.classList.remove("bg-login");

  if (["/login", "/cost-center-selection"].includes(to.path)) {
    elemBody.classList.add("bg-login");
  }

  // Validate auth to page access
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);

  const costCenterFreePassPages = ["/login", "/cost-center-selection"];
  const costCenterRequired = !costCenterFreePassPages.includes(to.path);

  const authStore = useAuthStore();
  const costCenterStore = useCostCenterStore();

  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.path;
    next("/login");
  } else if (
    costCenterRequired &&
    authStore.isLoggedIn &&
    !costCenterStore.isCostCenterSelected
  ) {
    authStore.returnUrl = to.path;
    next("/cost-center-selection");
  } else {
    next();
  }
});

export default router;
