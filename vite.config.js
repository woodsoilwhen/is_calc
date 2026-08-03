import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base 使用相对路径，方便部署在任意子路径下
export default defineConfig({
  base: './',
  plugins: [react()],
});
