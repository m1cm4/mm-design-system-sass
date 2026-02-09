# Migration vers un monorepo

## Scope `@mm-ds` — convention de nommage

Tous les packages du monorepo utilisent le scope **`@mm-ds`** :

| Package             | Rôle                                               | Statut |
| ------------------- | -------------------------------------------------- | ------ |
| `@mm-ds/core`       | SCSS core (tokens, layouts, utilities, components)  | actuel |
| `@mm-ds/examples`   | Collection d'exemples d'utilisation du core         | actuel |
| `@mm-ds/docs`       | Documentation VitePress                             | actuel |
| `@mm-ds/icons`      | Librairie d'icônes                                  | futur  |
| `@mm-ds/components` | Composants web/framework                            | futur  |

Les futurs packages s'ajouteront dans `packages/` (librairies) ou
`apps/` (applications).

---

## Structure cible

```
mm-design-system-sass/
├── packages/
│   └── core/                               # Package @mm-ds/core
│       ├── package.json
│       └── scss/
│           ├── mm-design-system/           ← déplacé depuis src/scss/
│           │   ├── _abstracts.scss         ← MODIFIÉ
│           │   ├── _accessors.scss         ← MODIFIÉ
│           │   ├── _mixins.scss            ← MODIFIÉ
│           │   ├── _utils.functions.scss
│           │   ├── core-base/
│           │   ├── core-components/
│           │   ├── layouts/
│           │   └── utilities/
│           └── mm-design-system-collections/  ← déplacé depuis src/scss/
│               ├── fonts/
│               └── palette-collection/
│
├── apps/
│   ├── examples/                           # @mm-ds/examples
│   │   ├── package.json
│   │   ├── vite.config.js                  # Config dynamique (EXAMPLE=…)
│   │   ├── postcss.config.js
│   │   │
│   │   ├── simple-example/                 # ← migré depuis le projet actuel
│   │   │   ├── index.html
│   │   │   ├── public/
│   │   │   │   └── fonts/
│   │   │   ├── js/
│   │   │   └── scss/
│   │   │       ├── main.scss
│   │   │       ├── project-abstracts/
│   │   │       ├── project-base/
│   │   │       └── project-components/
│   │   │
│   │   ├── blog-example/                   # Futur exemple
│   │   │   ├── index.html
│   │   │   ├── public/
│   │   │   └── scss/
│   │   │       ├── main.scss
│   │   │       ├── project-abstracts/
│   │   │       ├── project-base/
│   │   │       └── project-components/
│   │   │
│   │   └── full-responsive/                # Futur exemple
│   │       └── ...
│   │
│   └── docs/                               # @mm-ds/docs — VitePress
│       ├── package.json
│       ├── .vitepress/
│       │   ├── config.ts
│       │   └── theme/
│       │       ├── index.ts
│       │       └── custom.scss
│       ├── scss/
│       │   └── project-abstracts/          # Tokens pour le site docs
│       │       └── _index.scss
│       ├── index.md
│       └── guide/
│
├── pnpm-workspace.yaml                     ← MODIFIÉ
├── package.json                            ← MODIFIÉ (root)
└── .gitignore                              ← MODIFIÉ
```

Chaque sous-dossier de `apps/examples/` est un mini-projet autonome avec
ses propres tokens (`project-abstracts/`), styles de base et composants.
Un seul `vite.config.js` dynamique sélectionne l'exemple à servir via
la variable d'environnement `EXAMPLE`.

---

## Principe clé : les `loadPaths` SASS

La stratégie repose sur les **`loadPaths`** de SASS. Actuellement, le core fait
`@forward "../project-abstracts"` (chemin relatif). On le change en
`@forward "project-abstracts"` (sans `../`), et chaque app consommatrice fournit
son propre dossier `project-abstracts/` via la config Vite.

SASS résout dans cet ordre :

1. Relatif au fichier importeur (les `@use "../abstracts"` internes au core
   restent valides)
2. Les `loadPaths` → trouve `project-abstracts/` dans l'app consommatrice

---

## Fichiers à écrire / modifier

### 1. `pnpm-workspace.yaml` (racine)

```yaml
packages:
  - 'packages/*'
  - 'apps/*'

onlyBuiltDependencies:
  - esbuild
```

### 2. `package.json` (racine)

```json
{
  "name": "mm-design-system-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @mm-ds/examples dev",
    "dev:blog": "pnpm --filter @mm-ds/examples dev:blog",
    "dev:responsive": "pnpm --filter @mm-ds/examples dev:responsive",
    "dev:docs": "pnpm --filter @mm-ds/docs dev",
    "build:docs": "pnpm --filter @mm-ds/docs build",
    "preview:docs": "pnpm --filter @mm-ds/docs preview"
  }
}
```

### 3. `packages/core/package.json`

```json
{
  "name": "@mm-ds/core",
  "version": "0.1.0",
  "private": true,
  "description": "MM Design System — SCSS core (tokens, components, layouts, utilities)"
}
```

### 4. Modifications dans le core (3 fichiers)

> Tous les autres `@use "../abstracts"` dans les sous-dossiers du core
> n'ont PAS besoin de changer — ces chemins relatifs restent valides au
> sein du package.

**`packages/core/scss/mm-design-system/_abstracts.scss`** — ligne 3

```scss
@forward "mixins";
@forward "accessors";
@forward "project-abstracts";
```

*(suppression du `../`)*

**`packages/core/scss/mm-design-system/_accessors.scss`** — ligne 4

```scss
@use 'project-abstracts' as *;
```

*(était `'../project-abstracts'`)*

**`packages/core/scss/mm-design-system/_mixins.scss`** — ligne 4

```scss
@use "project-abstracts" as *;
```

*(était `"../project-abstracts/"`)*

### 5. `apps/examples/package.json`

```json
{
  "name": "@mm-ds/examples",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "cross-env EXAMPLE=simple-example vite",
    "dev:blog": "cross-env EXAMPLE=blog-example vite",
    "dev:responsive": "cross-env EXAMPLE=full-responsive vite",
    "build": "cross-env EXAMPLE=simple-example vite build",
    "build:blog": "cross-env EXAMPLE=blog-example vite build",
    "build:responsive": "cross-env EXAMPLE=full-responsive vite build"
  },
  "dependencies": {
    "@mm-ds/core": "workspace:*"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "@fullhuman/postcss-purgecss": "^7.0.2",
    "postcss-preset-env": "^10.2.4",
    "sass-embedded": "^1.89.2",
    "vite": "^6.3.5"
  }
}
```

### 6. `apps/examples/vite.config.js`

Config dynamique : la variable `EXAMPLE` détermine quel sous-dossier
est servi. Chaque exemple a ses propres `loadPaths` SASS.

```js
import { resolve } from 'path'
import { defineConfig } from 'vite'

const example = process.env.EXAMPLE || 'simple-example'

export default defineConfig({
   root: resolve(__dirname, example),
   build: {
      outDir: resolve(__dirname, 'dist', example),
      emptyOutDir: true,
   },
   css: {
      preprocessorOptions: {
         scss: {
            loadPaths: [
               resolve(__dirname, example, 'scss'),
               resolve(__dirname, '../../packages/core/scss'),
            ],
         },
      },
   },
})
```

### 7. `apps/examples/postcss.config.js`

Partagé par tous les exemples. Copier depuis l'actuel `postcss.config.js`.

```js
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import postcssPresetEnv from 'postcss-preset-env';

export default {
   plugins: [
      // TODO Réactivate purgeCSS after development
      // purgeCSSPlugin({
      //    content: ['./**/*.html']
      // }),

      postcssPresetEnv({
         stage: 2,
         features: {
            'logical-properties-and-values': false,
            'opacity-percentage': true,
            'text-decoration-shorthand': true
         }
      })
   ]
}
```

### 8. `apps/examples/simple-example/scss/main.scss`

**Inchangé** — fonctionne grâce aux `loadPaths` :

```scss
@use 'mm-design-system/core-base';      // → résolu via loadPath du core
@use 'mm-design-system/layouts';
@use 'mm-design-system/core-components';
@use 'mm-design-system/utilities';
@use 'project-components';               // → résolu via loadPath de l'exemple
@use 'project-base';
```

Chaque futur exemple aura son propre `main.scss` qui peut importer tout
ou partie du core, selon le besoin.

### 9. `apps/docs/package.json`

```json
{
  "name": "@mm-ds/docs",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "dependencies": {
    "@mm-ds/core": "workspace:*"
  },
  "devDependencies": {
    "vitepress": "^1.6.3",
    "sass-embedded": "^1.89.2"
  }
}
```

### 10. `apps/docs/.vitepress/config.ts`

```ts
import { resolve } from 'path'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MM Design System',
  description: 'Documentation du design system MM',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [
            resolve(__dirname, '../scss'),
            resolve(__dirname, '../../../packages/core/scss'),
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
```

### 11. `apps/docs/.vitepress/theme/index.ts`

```ts
import DefaultTheme from 'vitepress/theme'
import './custom.scss'

export default DefaultTheme
```

### 12. `apps/docs/.vitepress/theme/custom.scss`

```scss
// Importe le design system pour la documentation
// Importer tout ou seulement ce dont on a besoin
@use 'mm-design-system/core-base';
@use 'mm-design-system/utilities';
```

### 13. `apps/docs/scss/project-abstracts/_index.scss`

Pour que le core puisse résoudre `project-abstracts`, le site docs a besoin
d'un minimum. Copier depuis `apps/examples/simple-example/scss/project-abstracts/`
comme point de départ, ou créer une version minimale :

```scss
// Version minimale — à adapter pour le thème docs
@forward "breakpoints";
@forward "colors";
@forward "sizes";
@forward "typography";
@forward "contextual-tokens";
```

*(les fichiers correspondants sont à copier depuis simple-example puis adapter)*

### 14. `apps/docs/index.md`

```md
---
layout: home
hero:
  name: MM Design System
  tagline: Système de design SASS token-driven
  actions:
    - theme: brand
      text: Guide
      link: /guide/
---
```

### 15. `.gitignore` (racine) — ajouter ces entrées

```gitignore
# Monorepo
apps/*/dist/
apps/*/node_modules/
packages/*/node_modules/
.vitepress/dist/
.vitepress/cache/
```

---

## Commandes de migration

```bash
# 1. Créer la structure
mkdir -p packages/core/scss
mkdir -p apps/examples/simple-example/scss
mkdir -p apps/docs/.vitepress/theme
mkdir -p apps/docs/scss/project-abstracts
mkdir -p apps/docs/guide

# 2. Déplacer le core
git mv src/scss/mm-design-system packages/core/scss/
git mv src/scss/mm-design-system-collections packages/core/scss/

# 3. Déplacer le projet actuel vers simple-example
git mv src/scss/main.scss apps/examples/simple-example/scss/
git mv src/scss/project-abstracts apps/examples/simple-example/scss/
git mv src/scss/project-base apps/examples/simple-example/scss/
git mv src/scss/project-components apps/examples/simple-example/scss/
git mv src/index.html apps/examples/simple-example/
git mv src/simple-example.html apps/examples/simple-example/
git mv src/js apps/examples/simple-example/
git mv src/public apps/examples/simple-example/

# 4. Supprimer l'ancien vite/postcss config de la racine
git rm vite.config.js
git rm postcss.config.js

# 5. Supprimer le dossier src résiduel (src/doc/ si plus nécessaire)
git rm -r src/

# 6. Supprimer l'ancien package.json
git rm package.json

# 7. Supprimer l'ancien dist
rm -rf dist/

# 8. Créer les nouveaux fichiers listés ci-dessus, puis :
pnpm install
pnpm dev          # lance simple-example
pnpm dev:docs     # lance VitePress
```

---

## Ajouter un nouvel exemple

Pour ajouter un nouvel exemple (ex: `blog-example`) :

1. Créer le dossier `apps/examples/blog-example/`
2. Y placer un `index.html`, un dossier `scss/` avec `main.scss` et
   ses propres `project-abstracts/`, `project-base/`, `project-components/`
3. Ajouter le script dans `apps/examples/package.json` :
   ```json
   "dev:blog": "cross-env EXAMPLE=blog-example vite"
   ```
4. (Optionnel) Ajouter un raccourci dans le `package.json` racine :
   ```json
   "dev:blog": "pnpm --filter @mm-ds/examples dev:blog"
   ```
5. Lancer avec `pnpm dev:blog`

Chaque exemple est indépendant : ses propres tokens, base, composants.
Le core est partagé via les `loadPaths`.

---

## Récapitulatif

| Quoi                                             | Action                                     |
| ------------------------------------------------ | ------------------------------------------ |
| `pnpm-workspace.yaml`                            | Ajouter `packages/*` et `apps/*`           |
| `package.json` (racine)                          | Nouveau — scripts de délégation            |
| `packages/core/`                                 | Nouveau package avec le SCSS core          |
| 3 fichiers `_abstracts`, `_accessors`, `_mixins` | `../project-abstracts` → `project-abstracts` |
| `apps/examples/`                                 | Workspace unique, config Vite dynamique    |
| `apps/docs/`                                     | App VitePress avec custom theme            |
| `main.scss`                                      | **Aucun changement**                       |
| Tous les autres fichiers SCSS du core            | **Aucun changement**                       |
