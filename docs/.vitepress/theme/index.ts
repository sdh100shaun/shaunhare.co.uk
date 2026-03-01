import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HomeFeatures from './HomeFeatures.vue'
import CredlyBadges from './CredlyBadges.vue'
import LocalBadges from './LocalBadges.vue'
import './custom.css'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  // Inject custom feature cards after the hero on the home page only
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-after': () => h(HomeFeatures),
  }),
  enhanceApp({ app }) {
    app.component('CredlyBadges', CredlyBadges)
    app.component('LocalBadges', LocalBadges)
  },
} satisfies Theme
