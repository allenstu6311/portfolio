import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import TaiwanSelection from "@/view/TaiwanSelection.vue";
import Test from "@/view/Test.vue";

const pathname = import.meta.env.MODE === "production" ? "portfolio" : "";

const routes = [
  {
    path: `/${pathname}`,
    children: [
      {
        path: "TaiwanSelection",
        component: TaiwanSelection,
      },
      {
        path: "Test",
        component: Test,
      },
    ],
  },
  { path: "/TaiwanSelection", component: TaiwanSelection },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
