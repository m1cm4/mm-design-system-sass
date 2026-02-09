import { resolve } from 'path'
import { defineConfig } from 'vite'

const exampleFolder = process.env.EXAMPLE || 'simple-example';

export default defineConfig({
   root: resolve(__dirname, exampleFolder),
   build: {
      outDir: resolve(__dirname, 'dist', exampleFolder),
      // empty the dist folder before build
      emptyOutDir: true,
      // rollupOptions: {
      //    input: {
      //       home: resolve(__dirname, 'src/index.html'),
      //       // how to declare other pages :
      //       // about: resolve(__dirname, 'src/about/index.html'),
      //       // contact: resolve(__dirname, 'src/contact/index.html'),
      //    },
      // },
   },
   css: {
      preprocessorOptions: {
         scss: {
            loadPaths: [
               resolve(__dirname, exampleFolder, 'scss'),
               resolve(__dirname, 'node_modules/@mm-ds/core/scss')
            ]
         }
      }
   }
})