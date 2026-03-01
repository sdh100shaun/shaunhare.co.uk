<template>
  <div class="credly-badges-grid">
    <div
      v-for="badge in badges"
      :key="badge.id"
      :data-iframe-width="150"
      :data-iframe-height="270"
      :data-share-badge-id="badge.id"
      data-share-badge-host="https://www.credly.com"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { data as badges } from '../credly-badges.data'

onMounted(async () => {
  // Wait for Vue to flush the badge divs into the DOM before the script runs.
  await nextTick()

  // Always remove and re-inject the script so it re-processes badge divs on
  // every mount — this handles SPA back-navigation where the component
  // re-mounts but the previously-loaded script would otherwise do nothing.
  const existing = document.querySelector('script[src*="cdn.credly.com"]')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.src = 'https://cdn.credly.com/assets/utilities/embed.js'
  script.async = true
  document.head.appendChild(script)
})
</script>
