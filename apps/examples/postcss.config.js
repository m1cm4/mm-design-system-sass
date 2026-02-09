import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import postcssPresetEnv from 'postcss-preset-env';

export default {
   plugins: [
      // TODO Réactivate purgeCSS after development
      // purgeCSSPlugin({
      //    content: ['./**/*.html']
      // }),

      postcssPresetEnv({
         stage: 2,//by default,  transform props of stage 4 and 3
         features: {
            // see features at:
            // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
            // https://preset-env.cssdb.org/features/
            // parce que purgecss va supprimer ces règles réécrites (il ne les retrouvent pas dans l'html)
            // keep this props untouched even if are at stage 3.
            // the way PresetEnv rewrite logical properties could cause problems with Purgecss :
            // PurgeCSS will not find the use of this rewritten rules in the html, and, unfortunatly, will purge the css from it.
            'logical-properties-and-values': false,
            'opacity-percentage': true,
            'text-decoration-shorthand': true
         }
      })
   ]
}