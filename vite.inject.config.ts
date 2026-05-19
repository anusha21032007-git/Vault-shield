import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false, // Don't wipe the dist folder from the main build
    rollupOptions: {
      input: path.resolve(__dirname, "src/content/inject.tsx"),
      output: {
        entryFileNames: "assets/inject.js",
        format: "iife", // Bundle everything into a single immediate function
        name: "VaultShieldInject",
      },
    },
  },
}));
