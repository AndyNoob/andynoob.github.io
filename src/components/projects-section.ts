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

        <div class="grid">
          ${this.filteredProjects.map((project) => html`<project-card .project=${project}></project-card>`)}
        </div>
      </section>
    `
  }

  static styles = css`
    .page {
      min-height: 100vh;
      padding: 5rem 2rem;
      animation: fadeUp 0.4s ease;
    }

    header {
      margin-bottom: 1.25rem;
    }

    h2 {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3rem);
    }

    p {
      margin: 0.6rem 0 0;
      opacity: 0.85;
      max-width: 45rem;
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

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      align-items: stretch;
    }

    @keyframes fadeUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'projects-section': ProjectsSection
  }
}
