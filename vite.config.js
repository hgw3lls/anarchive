import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Root deployment ("/") for a user/org site repo or custom domain.
  // If you later host at /anarchive/ instead, change this to "/anarchive/".
  base: "/",
});
