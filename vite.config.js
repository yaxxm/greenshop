import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, 'src'),
    },
  },
  server:{
    proxy:{
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  plugins: [vue(), WindiCSS()],
})
