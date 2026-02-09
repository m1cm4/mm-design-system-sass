# mm-design-system-sass

Architecture de design system SASS modulaire en monorepo pnpm.

## Architecture

```
mm-design-system-sass/
├── packages/
│   └── core/          # @mm-ds/core - Librairie SCSS partagée
└── apps/
    ├── docs/          # @mm-ds/docs - Documentation VitePress
    └── examples/      # @mm-ds/examples - Exemples d'utilisation
```

### Workspace Structure

Monorepo pnpm avec protocole `workspace:*`. Trois packages :

- **`@mm-ds/core`** : Librairie SCSS (tokens, composants, layouts, utilities)
- **`@mm-ds/docs`** : Documentation technique (VitePress + SASS)
- **`@mm-ds/examples`** : Templates d'intégration portables

## Resolution Strategy

### SASS loadPaths

Les packages utilisent `node_modules/@mm-ds/core/scss` pour la résolution, éliminant les chemins relatifs et rendant les exemples portables hors monorepo.

```js
// vite.config.js
css: {
  preprocessorOptions: {
    scss: {
      loadPaths: [
        resolve(__dirname, 'scss'),
        resolve(__dirname, 'node_modules/@mm-ds/core/scss')
      ]
    }
  }
}
```

Les imports SCSS utilisent la syntaxe module :

```scss
@use "mm-design-system/abstracts" as *;
@use "project-abstracts" as *;
```

### VitePress Configuration

VitePress requiert `api: 'modern-compiler'` pour l'application correcte des `loadPaths` :

```ts
// .vitepress/config.ts
css: {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
      loadPaths: [...]
    }
  }
}
```

## Token System

Architecture en couches séparant core système et tokens projet :

- **`packages/core/scss/mm-design-system/`** : Système réutilisable (composants, layouts, utilities)
- **`project-abstracts/`** : Tokens spécifiques par projet (couleurs, tailles, typographie)

Les tokens privés utilisent le préfixe `$-` (ex: `$-clr-blue-500`). Les tokens contextuels exposent des custom properties CSS. Les couleurs utilisent OKLCH pour meilleure cohérence perceptuelle.

## Commands

### Development

```bash
# Root
pnpm install

# Docs
pnpm --filter @mm-ds/docs dev

# Examples
pnpm --filter @mm-ds/examples dev              # simple-example
pnpm --filter @mm-ds/examples dev:blog         # blog-example
pnpm --filter @mm-ds/examples dev:responsive   # full-responsive
```

### Build

```bash
pnpm --filter @mm-ds/docs build
pnpm --filter @mm-ds/examples build
```

## Tech Stack

- **Package manager** : pnpm workspaces
- **Preprocessor** : sass-embedded
- **Build tool** : Vite 6
- **Documentation** : VitePress 1.6
- **PostCSS** : postcss-preset-env (stage 2), PurgeCSS

## Dependencies

### Core
Aucune dépendance runtime. Package SCSS pur.

### Examples
- `@mm-ds/core` (workspace)
- `vite`, `sass-embedded`, `cross-env`
- PostCSS : `@fullhuman/postcss-purgecss`, `postcss-preset-env`

### Docs
- `@mm-ds/core` (workspace)
- `vitepress`, `sass-embedded`, `@types/node`

## Notes Techniques

- **Breakpoints** : 30em, 45em, 65em
- **Échelle de tailles** : 0–15 (incréments 4px en rem)
- **Typographie responsive** : map bidimensionnel small/large
- **Modificateurs** : préfixe tiret `.button.-primary` ou data-attributes
- **Utilities spacing** : propriétés logiques (mbs, mbe, pis, pie)
- **Custom properties** : génération automatique depuis maps SASS

---

**Version** : 0.1.0-beta
**License** : Private
