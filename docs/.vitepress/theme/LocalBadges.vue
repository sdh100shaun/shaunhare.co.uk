<template>
  <div v-if="localBadges.length" class="local-badges-grid">
    <component
      :is="badge.url ? 'a' : 'div'"
      v-for="badge in localBadges"
      :key="badge.name"
      v-bind="badge.url ? { href: badge.url, target: '_blank', rel: 'noopener noreferrer' } : {}"
      class="local-badge"
      :class="{ 'is-link': !!badge.url }"
      :title="badge.description ?? badge.name"
    >
      <img :src="badge.image" :alt="badge.name" class="local-badge-img" />
      <div class="local-badge-info">
        <span class="local-badge-name">{{ badge.name }}</span>
        <span class="local-badge-issuer">{{ badge.issuer }}</span>
        <span v-if="badge.issued" class="local-badge-date">{{ badge.issued }}</span>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
// Both globs run at Vite build time — JSON is bundled, images get hashed asset URLs.
const jsonModules = import.meta.glob('../badges/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, any>

const imageModules = import.meta.glob('../badges/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const localBadges = Object.entries(jsonModules)
  .filter(([path]) => !path.split('/').pop()!.startsWith('_'))
  .map(([jsonPath, meta]) => {
    const base = jsonPath.split('/').pop()!.replace('.json', '')
    const imageEntry = Object.entries(imageModules).find(
      ([imgPath]) => imgPath.split('/').pop()!.replace(/\.[^.]+$/, '') === base,
    )
    if (!imageEntry) return null
    return {
      name: meta.name as string,
      issuer: meta.issuer as string,
      issued: meta.issued as string | undefined,
      url: meta.url as string | undefined,
      description: meta.description as string | undefined,
      image: imageEntry[1],
    }
  })
  .filter((b): b is NonNullable<typeof b> => b !== null && !!b.name && !!b.issuer)
</script>
