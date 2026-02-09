# TypeScript Bridge — MM Design System

## Concept

Le pont TypeScript permet aux projets qui consomment le design system d'accéder aux **valeurs des tokens SCSS** directement depuis TypeScript, avec **auto-complétion** et **sécurité de type**.

Le mécanisme repose sur deux piliers :
1. **`:export` (CSS Modules)** — Un bloc spécial dans un fichier `.module.scss` qui rend les valeurs SCSS disponibles comme un objet JavaScript.
2. **Interfaces TypeScript (core)** — Des types définis dans `@mm-ds/core/ts` qui décrivent la forme attendue des tokens.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  @mm-ds/core (package)                                  │
│                                                         │
│  scss/mm-design-system/   ← Structure SCSS (mixins,     │
│                             fonctions, composants)      │
│                                                         │
│  ts/types.ts              ← Interfaces TypeScript       │
│  ts/index.ts              ← Point d'entrée TS           │
│  ts/scss-modules.d.ts     ← Déclaration *.module.scss   │
└──────────────────────────────┬──────────────────────────┘
                               │
                    @use / import type
                               │
┌──────────────────────────────▼──────────────────────────┐
│  Projet utilisateur                                     │
│                                                         │
│  scss/                                                  │
│    project-abstracts/       ← Tokens SCSS (valeurs)     │
│      _colors.scss                                       │
│      _sizes.scss                                        │
│      _breakpoints.scss                                  │
│      _typography.scss                                   │
│                                                         │
│    ts-bridge/               ← Dossier dédié, isolé      │
│      _tokens.module.scss    ← UN seul fichier d'export  │
│                                                         │
│  ts/                                                    │
│    tokens-usage.example.ts  ← Exemple d'utilisation     │
└─────────────────────────────────────────────────────────┘
```

### Principes d'organisation

- Les fichiers `.module.scss` sont **séparés** des fichiers SCSS de style dans un dossier `ts-bridge/` dédié.
- Un **seul fichier** `_tokens.module.scss` exporte tous les tokens du projet.
- Les tokens définis dans des **maps SCSS** (`$default-palette`, `$sizes`, `$breakpoints`, `$font-sizes`) sont exportés automatiquement via des boucles `@each`.
- Les tokens définis comme **variables individuelles** (font weights, font families, letter spacing) sont listés manuellement.
- **Quand l'utilisateur ajoute un token à une map existante**, l'export se met à jour automatiquement — aucun changement dans `_tokens.module.scss`.
- **Quand l'utilisateur ajoute une nouvelle variable individuelle**, il doit ajouter une ligne dans la section manuelle.

---

## Comment ça fonctionne

### Étape 1 : Les fichiers SCSS définissent les tokens (inchangés)

```scss
// project-abstracts/_colors.scss
$default-palette: (
  "primary": (
    "100": oklch(...),
    "200": oklch(...),
  ),
);
```

### Étape 2 : Le fichier bridge les exporte

```scss
// ts-bridge/_tokens.module.scss
@use '../project-abstracts/colors' as *;
@use '../project-abstracts/sizes' as *;
@use '../project-abstracts/breakpoints' as *;
@use '../project-abstracts/typography' as *;
@use 'sass:map';

:export {
  // Auto — boucle sur les maps
  @each $color, $shade-map in $default-palette {
    @each $shade, $value in $shade-map {
      clr-#{$color}-#{$shade}: #{$value};
    }
  }

  @each $step, $value in $sizes {
    size-#{$step}: #{$value};
  }

  @each $name, $value in $breakpoints {
    bp-#{$name}: #{$value};
  }

  @each $name, $value in map.get($font-sizes, "small") {
    fs-#{$name}: #{$value};
  }

  // Manuel — variables individuelles
  fw-regular: #{$font-weight-regular};
  fw-bold: #{$font-weight-bold};
  ff-base: #{$font-family-base};
  ff-accent: #{$font-family-accent};
}
```

Le compilateur SCSS transforme les boucles en un bloc `:export` plat :

```css
:export {
  clr-primary-100: oklch(70.277% 0.16087 251.238);
  clr-primary-200: oklch(55.857% 0.1908 256.019);
  size-0: 0;
  size-1: 0.25rem;
  bp-small: 30em;
  fs-400: 1rem;
  fw-bold: 700;
  ff-base: Inter, system-ui, ...;
  /* ... */
}
```

Vite reconnaît le pseudo-sélecteur `:export` et le transforme en objet JavaScript.

### Étape 3 : TypeScript importe l'objet

```typescript
import type { ColorToken } from '@mm-ds/core/ts';
import tokens from './scss/ts-bridge/_tokens.module.scss';

// tokens est un objet plat avec toutes les valeurs
tokens['clr-primary-400']  // => "oklch(...)"
tokens['bp-medium']        // => "45em"
tokens['size-4']           // => "1rem"
tokens['fs-800']           // => "2.25rem"
tokens['fw-bold']          // => "700"
tokens['ff-base']          // => "Inter, system-ui, ..."
```

---

## Convention de nommage des clés exportées

Toutes les clés sont préfixées pour éviter les collisions et identifier la catégorie :

| Préfixe | Catégorie | Source | Exemple |
|---------|-----------|--------|---------|
| `clr-` | Couleurs | `$default-palette` (auto) | `clr-primary-400` |
| `size-` | Tailles | `$sizes` (auto) | `size-8` |
| `bp-` | Breakpoints | `$breakpoints` (auto) | `bp-medium` |
| `fs-` | Font sizes | `$font-sizes` (auto) | `fs-700` |
| `fw-` | Font weights | Variables individuelles (manuel) | `fw-bold` |
| `ff-` | Font families | Variables individuelles (manuel) | `ff-base` |
| `ls-` | Letter spacing | Variables individuelles (manuel) | `ls-wide` |

---

## Fichiers du core

| Fichier | Rôle |
|---------|------|
| `ts/types.ts` | Interfaces : `ColorPalette`, `BreakpointMap`, `SizeScale`, `FontSizeMap`, `FontWeightMap`, `DesignTokens` |
| `ts/index.ts` | Re-export de tous les types |
| `ts/scss-modules.d.ts` | Déclaration TypeScript pour `import x from '*.module.scss'` |

### Importer les types

```typescript
import type { ColorPalette, BreakpointMap, SizeScale } from '@mm-ds/core/ts';
```

### Déclaration SCSS Modules

Pour que TypeScript comprenne les imports `.module.scss`, ajoutez dans votre `tsconfig.json` :

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  },
  "include": [
    "node_modules/@mm-ds/core/ts/scss-modules.d.ts",
    "src"
  ]
}
```

Ou copiez `scss-modules.d.ts` dans votre dossier `src/`.

---

## Ce qui est auto vs manuel

### Auto (boucles `@each` sur les maps)

Ajoutez un token à une map existante → l'export se met à jour **sans toucher** `_tokens.module.scss`.

- Couleurs dans `$default-palette`
- Tailles dans `$sizes`
- Breakpoints dans `$breakpoints`
- Font sizes dans `$font-sizes`

### Manuel (variables individuelles)

Ajoutez une variable → ajoutez une ligne dans `_tokens.module.scss`.

- Font weights (`$font-weight-*`)
- Font families (`$font-family-*`)
- Letter spacing (`$letter-spacing-*`)
- Fluid sizes (`$size-fluid-*`)

> **Note :** Le script générateur (voir TODO.md) résoudra cette limitation en parsant directement les fichiers SCSS pour exporter toutes les variables, y compris individuelles.

---

## Prérequis

- **Bundler compatible CSS Modules** : Vite (inclus dans ce projet) ou webpack
- **sass-embedded** : Déjà installé comme dépendance
- Le fichier `_tokens.module.scss` n'est **PAS** importé par `main.scss` — il est importé uniquement par TypeScript

---

## Cas d'usage typiques

### Composant React/Vue avec variantes type-safe

```tsx
import type { ColorToken } from '@mm-ds/core/ts';
import tokens from './scss/ts-bridge/_tokens.module.scss';

interface ButtonProps {
  variant: 'primary' | 'accent' | 'secondary';
}

function Button({ variant }: ButtonProps) {
  const bg = tokens[`clr-${variant}-400`];
  // ...
}
```

### Documentation VitePress dynamique

```vue
<script setup>
import tokens from '../scss/ts-bridge/_tokens.module.scss';

const colors = Object.entries(tokens)
  .filter(([key]) => key.startsWith('clr-'))
  .map(([key, value]) => ({ key: key.replace('clr-', ''), value }));
</script>

<template>
  <div v-for="{ key, value } in colors" :key="key"
       :style="{ backgroundColor: value }">
    {{ key }}
  </div>
</template>
```

### Breakpoint media query en JavaScript

```typescript
import tokens from './scss/ts-bridge/_tokens.module.scss';

const mq = window.matchMedia(`(min-width: ${tokens['bp-medium']})`);
mq.addEventListener('change', (e) => {
  console.log('Medium breakpoint:', e.matches);
});
```
