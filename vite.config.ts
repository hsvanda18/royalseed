import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The audience reads this on Angolan mobile connections. Keep the
    // shipped bundle inspectable and small enough to notice regressions.
    target: "es2020",
    cssMinify: "lightningcss",
    reportCompressedSize: true,
  },
});
