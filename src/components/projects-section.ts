import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { Project } from '../types'
import './project-card'

@customElement('projects-section')
export class ProjectsSection extends LitElement {
  @property({ type: String })
  title = 'Projects'

  @property({ type: String })
  subtitle = ''

  @property({ attribute: false })
  projects: Project[] = []

  @state()
  private selectedTag = 'all'

  private get availableTags(): string[] {
    const tags = new Set<string>()
    this.projects.forEach((project) => project.tags.forEach((tag) => tags.add(tag)))
    return ['all', ...[...tags].sort()]
  }

  private get filteredProjects(): Project[] {
    if (this.selectedTag === 'all') {
      return this.projects
    }

    return this.projects.filter((project) => project.tags.includes(this.selectedTag))
  }

  private onFilter(tag: string) {
    this.selectedTag = tag
  }

  protected render() {
    return html`
      <section aria-labelledby="projects-title" class="page">
        <header>
          <h2 id="projects-title">${this.title}</h2>
          <p>${this.subtitle}</p>
        </header>

        <div class="filters" role="toolbar" aria-label="Project filters">
          ${this.availableTags.map(
            (tag) => html`
              <button
                type="button"
                ?data-active=${this.selectedTag === tag}
                @click=${() => this.onFilter(tag)}
              >
                ${tag}
              </button>
            `
          )}
        </div>

        <div class="projects-box">
          <div class="grid" role="list">
            ${this.filteredProjects.map(
              (project) =>
                html`<div role="listitem"><project-card .project=${project}></project-card></div>`
            )}
          </div>
        </div>
      </section>
    `
  }

  static styles = css`
    .page {
      height: 100svh;
      padding: clamp(1.1rem, 2vw, 2rem) clamp(1rem, 2.2vw, 2.2rem);
      display: grid;
      grid-template-rows: auto auto minmax(0, 1fr);
      gap: 0;
      overflow: clip;
    }

    header {
      margin-bottom: 1.25rem;
    }

    h2 {
      margin: 0;
      font-size: clamp(2.4rem, 5.5vw, 3.4rem);
      text-shadow:
        -1px 0 #000,
        0 1px #000,
        1px 0 #000,
        0 -1px #000,
        0 0 10px rgba(0, 0, 0, 0.7);
    }

    p {
      margin: 0.6rem 0 0;
      opacity: 0.85;
      max-width: 45rem;
      font-size: clamp(1rem, 1.5vw, 1.2rem);
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.85);
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0 1.75rem;
    }

    button {
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(0, 0, 0, 0.35);
      color: inherit;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
    }

    button[data-active] {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.55);
    }

    .projects-box {
      min-height: 0;
      overflow: auto;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(0, 0, 0, 0.33);
      padding: 1rem;
      scrollbar-gutter: stable both-edges;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      align-items: stretch;
    }

    [role='listitem'] {
      min-height: 100%;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'projects-section': ProjectsSection
  }
}
