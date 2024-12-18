import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import TaiwanSelection from "@/view/TaiwanSelection.vue";

const routes = [{ path: "/TaiwanSelection", component: TaiwanSelection }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
