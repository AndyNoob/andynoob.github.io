export type ProjectStatus = 'active' | 'archived' | 'prototype'

export interface Project {
  id: string
  title: string
  summary: string
  tech: string[]
  links: {
    live?: string
    source?: string
    demo?: string
  }
  thumbnail: string
  status: ProjectStatus
  featured: boolean
  tags: string[]
  date?: string
}
