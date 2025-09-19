import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
   root: resolve(__dirname, 'src/'),
   build: {
      // outDir: resolve(__dirname, 'dist/'),
      outDir: '../dist',
      // empty the dist folder before build
      emptyOutDir: true,
      rollupOptions: {
         input: {
            home: resolve(__dirname, 'src/index.html'),
            // how to declare other pages :
            // about: resolve(__dirname, 'src/about/index.html'),
            // contact: resolve(__dirname, 'src/contact/index.html'),
         },
      },
   }
})