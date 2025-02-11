import { createRouter, createWebHistory } from "vue-router";
import MainLayoutView from "@/views/MainLayoutView.vue";
import { useAuthStore } from "@/store/auth.store";
import { useCostCenterStore } from "@/store/cost_center.store";

const publicRoutes = ["/", "/cost-center-selection"];

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { isPublic: true },
  },
  {
    path: "/cost-center-selection",
    name: "cost-center-selection",
    component: () => import("@/views/CostCenterSelectionView.vue"),
    meta: { isPublic: true },
  },
  {
    path: "/app",
    component: MainLayoutView,
    meta: { requiresAuth: true, requiresCostCenter: true },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "/cash-flow",
        name: "cash-flow",
        component: () => import("@/views/CashFlowView.vue"),
      },
      {
        path: "/settings/cost-center",
        name: "settings-cost-center",
        component: () => import("@/views/settings/CostCenterView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const costCenterStore = useCostCenterStore();
  const isPublicRoute = to.meta.isPublic || publicRoutes.includes(to.path);
  const requiresAuth = to.meta.requiresAuth || !isPublicRoute;
  const requiresCostCenter = to.meta.requiresCostCenter;

  if (isPublicRoute) {
    return next();
  }

  if (requiresAuth && !authStore.isLoggedIn) {
    authStore.returnUrl = to.path;
    return next({ name: "login" });
  }

  if (requiresCostCenter && !costCenterStore.isCostCenterSelected) {
    authStore.returnUrl = to.path;
    return next({ name: "cost-center-selection" });
  }

  next();
});

export default router;