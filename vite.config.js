import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// console.log(process.env.NODE_ENV);

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/portfolio" : "",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
