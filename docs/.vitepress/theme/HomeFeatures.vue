<template>
  <div class="sh-features-wrapper">
    <div class="sh-features-grid">
      <div v-for="f in features" :key="f.label" class="sh-feature-card">
        <div class="sh-feature-header">
          <span class="sh-feature-icon" v-html="f.svg" aria-hidden="true" />
          <strong class="sh-feature-tag">{{ f.label }}</strong>
        </div>
        <p class="sh-feature-title">{{ f.title }}</p>
        <p class="sh-feature-details">{{ f.details }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    label: 'Work',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-2v2H9V4h6zM4 19V8h16v11H4z"/>
    </svg>`,
    title: 'UK Government Digital',
    details: 'Principal Developer at the Driver and Vehicle Standards Agency (DVSA), delivering digital services used by millions of drivers and riders across the UK.',
  },
  {
    label: 'Community',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>`,
    title: 'Community Builder',
    details: 'Co-organiser of PHPMiNDS and LincolnHack — supporting the East Midlands tech community through meetups, hackathons, and bringing people together to build things.',
  },
  {
    label: 'Technical',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
    </svg>`,
    title: 'Full-Stack Pragmatist',
    details: 'PHP, TypeScript, Java, Ruby, AWS, and whatever the problem actually needs. Open source advocate with a broad toolkit built over nearly three decades.',
  },
]
</script>
