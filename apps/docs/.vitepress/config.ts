import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vitepress'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// __dirname = .vitepress/
// scss est dans .vitepress/theme/scss/
// Résolution via node_modules pour portabilité

export default defineConfig({
  title: 'MM Design System',
  description: 'Documentation du design system MM',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          loadPaths: [
            resolve(__dirname, 'theme/scss'),
            resolve(__dirname, '../node_modules/@mm-ds/core/scss'),
          ],
        },
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Tokens', link: '/guide/tokens' },
          { text: 'Components', link: '/guide/components' },
        ],
      },
    ],
  },
})