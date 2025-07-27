/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configurações de servidor de desenvolvimento
  server: {
    port: 5173,
    host: true, // Permite acesso externo
    open: true, // Abre o navegador automaticamente
    cors: true, // Habilita CORS
  },

  // Configurações de build
  build: {
    outDir: "dist",
    sourcemap: true, // Gera source maps para debug
    minify: "terser", // Minificação otimizada
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa vendor chunks para melhor cache
          vendor: ["react", "react-dom"],
          firebase: [
            "firebase/app",
            "firebase/firestore",
            "firebase/auth",
            "firebase/storage",
          ],
          ui: ["framer-motion", "lucide-react", "react-icons"],
        },
      },
    },
    // Otimizações de tamanho
    chunkSizeWarningLimit: 1000,
  },

  // Aliases para importações mais limpas
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/Pages"),
      "@assets": resolve(__dirname, "src/assets"),
      "@services": resolve(__dirname, "src/services"),
      "@contexts": resolve(__dirname, "src/contexts"),
    },
  },

  // Configurações de preview
  preview: {
    port: 4173,
    host: true,
  },

  // Otimizações de CSS
  css: {
    devSourcemap: true,
  },

  // Configurações de assets
  assetsInclude: ["**/*.woff2", "**/*.woff", "**/*.ttf", "**/*.eot"],

  // Configurações de define para variáveis globais
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Configurações de esbuild
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
