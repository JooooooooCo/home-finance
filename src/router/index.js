import { createRouter, createWebHistory } from "vue-router";
import MainLayoutView from "@/views/MainLayoutView.vue";
import { useAuthStore } from "@/store/auth.store";
import { useCostCenterStore } from "@/store/cost_center.store";

const routes = [
  {
    path: "/",
    component: () =>
      import("@/views/LoginView.vue"),
  },
  {
    path: "/cost-center-selection",
    component: () =>
      import("@/views/CostCenterSelectionView.vue"),
  },
  {
    path: "/app",
    component: MainLayoutView,
    children: [
      {
        path: "/dashboard",
        component: () =>
          import("@/views/DashboardView.vue"),
      },
      {
        path: "/cash-flow",
        component: () =>
          import("@/views/CashFlowView.vue"),
      },
      {
        path: "/settings/cost-center",
        component: () =>
          import("@/views/settings/CostCenterView.vue"),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const elemBody = document.getElementById("body");
  elemBody.classList.remove("bg-login");

  if (["/", "/cost-center-selection"].includes(to.path)) {
    elemBody.classList.add("bg-login");
  }

  // Validate auth to page access
  const publicPages = ["/"];
  const authRequired = !publicPages.includes(to.path);

  const costCenterFreePassPages = ["/", "/cost-center-selection"];
  const costCenterRequired = !costCenterFreePassPages.includes(to.path);

  const authStore = useAuthStore();
  const costCenterStore = useCostCenterStore();

  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.path;
    next("/");
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
