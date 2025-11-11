import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@noble/post-quantum")) {
            return "noble-post-quantum";
          } else if (id.includes("@noble/ciphers")) {
            return "noble-ciphers";
          } else if (id.includes("@noble/hashes")) {
            return "noble-hashes";
          } else if (id.includes("buffer")) {
            return "buffer";
          }
        },
      },
    },
  },
});
