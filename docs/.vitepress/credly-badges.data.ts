/**
 * VitePress build-time data loader.
 * Fetches all Credly badges at build time — handles pagination so new badges
 * appear automatically on the next deploy without any code changes.
 */

interface CredlyBadge {
  id: string
  name: string
}

interface CredlyResponse {
  data: Array<{
    id: string
    badge_template: {
      name: string
    }
  }>
  metadata: {
    next_page_url: string | null
  }
}

export default {
  async load(): Promise<CredlyBadge[]> {
    const badges: CredlyBadge[] = []
    let url: string | null =
      'https://www.credly.com/users/shaun-hare.0f555c25/badges.json'

    while (url) {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Credly API responded ${res.status}`)
      const json: CredlyResponse = await res.json()

      for (const badge of json.data) {
        badges.push({ id: badge.id, name: badge.badge_template.name })
      }

      url = json.metadata.next_page_url
    }

    return badges
  },
}
