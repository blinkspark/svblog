import adapter from '@sveltejs/adapter-auto'
import {} from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
  },

  compilerOptions: {
    warningFilter: (warning, path) => {
      if (
        warning.code === 'a11y_missing_attribute' ||
        warning.code === 'a11y_consider_explicit_label' ||
        warning.code === 'a11y_no_static_element_interactions' ||
        warning.code === 'a11y_click_events_have_key_events'
      ) {
        return false
      }
      return true
    },
  },
}

export default config
