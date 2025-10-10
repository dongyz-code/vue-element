import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icon from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

const __dirname = import.meta.dirname;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    Icon({
      compiler: 'vue3',
      customCollections: {
        local: FileSystemIconLoader(path.join(__dirname, 'src/assets/svg-icons'), (svg) => {
          return svg.replace(/^<svg /, '<svg fill="currentColor" ');
        }),
      },
    }),
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: [],
      syncMode: 'append',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    //
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
  },
});
