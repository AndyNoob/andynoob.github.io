import type { Project, ProjectStatus } from '../types'

interface RawProject {
  id?: unknown
  title?: unknown
  summary?: unknown
  tech?: unknown
  links?: unknown
  thumbnail?: unknown
  status?: unknown
  featured?: unknown
  tags?: unknown
  date?: unknown
}

function isStatus(value: unknown): value is ProjectStatus {
  return value === 'active' || value === 'archived' || value === 'prototype'
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function sanitizeProject(item: RawProject): Project | null {
  if (typeof item.id !== 'string') return null
  if (typeof item.title !== 'string') return null
  if (typeof item.summary !== 'string') return null
  if (typeof item.thumbnail !== 'string') return null
  if (!isStatus(item.status)) return null

  const rawLinks = item.links as Record<string, unknown> | undefined
  const links = {
    live: typeof rawLinks?.live === 'string' ? rawLinks.live : undefined,
    source: typeof rawLinks?.source === 'string' ? rawLinks.source : undefined,
    demo: typeof rawLinks?.demo === 'string' ? rawLinks.demo : undefined
  }

  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    tech: toStringArray(item.tech),
    links,
    thumbnail: item.thumbnail,
    status: item.status,
    featured: item.featured === true,
    tags: toStringArray(item.tags),
    date: typeof item.date === 'string' ? item.date : undefined
  }
}

export async function loadProjects(): Promise<Project[]> {
  const response = await fetch('/data/projects.json')

  if (!response.ok) {
    throw new Error(`Unable to load projects data (${response.status})`)
  }

  const data = (await response.json()) as unknown

  if (!Array.isArray(data)) {
    throw new Error('Projects data must be an array')
  }

  const sanitized = data
    .map((item) => sanitizeProject(item as RawProject))
    .filter((project): project is Project => project !== null)

  return sanitized
}
