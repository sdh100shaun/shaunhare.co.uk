import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Shaun Hare',
  description: 'Developer, technical leader, and community builder based in the East Midlands, UK.',
  outDir: '../dist',
  cleanUrls: true,
  head: [
    // Fonts — loaded as <link> so the request fires before CSS is parsed,
    // eliminating flash of unstyled text on the nav title.
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Nunito:wght@800;900&display=swap' }],
    // Pre-establish connection to Credly CDN so the embed script loads faster
    // when the about page is first visited.
    ['link', { rel: 'preconnect', href: 'https://cdn.credly.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://cdn.credly.com' }],
    ['meta', { property: 'og:title', content: 'Shaun Hare' }],
    ['meta', { property: 'og:description', content: 'Developer, technical leader, and community builder based in the East Midlands, UK.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://shaunhare.co.uk' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@sdh100shaun' }],
    ['meta', { name: 'twitter:creator', content: '@sdh100shaun' }],
    ['link', { rel: 'openid2.provider', href: 'https://openid.stackexchange.com/openid/provider' }],
    ['link', { rel: 'openid2.local_id', href: 'https://openid.stackexchange.com/user/70d2bcc7-b959-442d-8329-9883ed5b19a9' }],
  ],
  themeConfig: {
    siteTitle: 'Shaun Hare',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Blog', link: '/blog/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sdh100shaun' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/shaundhare' },
    ],

    footer: {
      message: 'East Midlands, UK',
      copyright: '© Shaun Hare',
    },
  },
})
