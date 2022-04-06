import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: command === "build" ? "" : "/",
    build: {
      minify: command === "build" && mode !== "dev",
    },
    plugins: [],
    resolve: {
      alias: {},
    },
  };
});
