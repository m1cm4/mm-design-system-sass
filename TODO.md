# TODO — MM Design System

## TypeScript Token Generator Script (Niveau 3)

**Statut :** En attente
**Priorité :** Basse
**Quand :** Après la stabilisation des tokens (v1.0 ou quand le système de tokens ne change plus fréquemment)

### Description

Créer un script Node.js qui parse les fichiers SCSS de tokens (`project-abstracts/`) et génère automatiquement un fichier `tokens.ts` contenant toutes les valeurs sous forme de constantes TypeScript typées.

### Ce que ça apporte de plus

Le niveau 2 (actuellement implémenté) repose sur le mécanisme `:export` des CSS Modules, qui nécessite un bundler compatible (Vite, webpack). Le script générateur résout les cas suivants :

1. **Environnements sans bundler** — Les projets SSR (Node.js pur), les scripts CLI, ou les outils de build custom qui n'utilisent pas Vite/webpack n'ont pas accès aux CSS Modules. Le script génère un fichier `.ts` autonome.

2. **Validation au build** — Le script peut vérifier que les tokens du projet respectent les interfaces du core et remonter des erreurs avant la compilation SCSS.

3. **Documentation automatique** — Le fichier généré peut servir de source de vérité pour générer automatiquement les pages de documentation VitePress (palette de couleurs, échelle de tailles, etc.) sans dépendre du bundler.

4. **Synchronisation garantie** — Pas de risque de décalage entre les valeurs SCSS et les types TS, car le script est la source unique de génération.

### Moment opportun

- **Pas maintenant** : Les tokens changent encore fréquemment pendant le développement. Générer à chaque modification est une friction inutile.
- **Idéal** : Quand la palette de couleurs et l'échelle de tailles sont stabilisées (pré-release v1.0), ajouter le script comme étape `pnpm generate:tokens` dans le pipeline de build.
- **Objectif spécifique** : Si un consommateur du DS a besoin des tokens en dehors d'un contexte Vite (ex: un thème Astro SSR, un outil CLI interne).

### Implémentation envisagée

```
packages/core/scripts/generate-tokens.ts
```

Le script lirait les maps SCSS (`$default-palette`, `$sizes`, `$font-sizes`, `$breakpoints`) via `sass-embedded` et produirait un fichier TypeScript avec les valeurs compilées.
