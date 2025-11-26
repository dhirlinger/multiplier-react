import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../wordpress/wp-content/plugins/multiplier2",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: `multiplier.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "multiplier.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
});
