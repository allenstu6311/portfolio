import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import TaiwanSelection from "@/view/TaiwanSelection.vue";

const pathname = process.env.NODE_ENV === "production" ? "portfolio" : "";

const routes = [
  {
    path: `/${pathname}`,
    children: [
      {
        path: "TaiwanSelection",
        component: TaiwanSelection,
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
