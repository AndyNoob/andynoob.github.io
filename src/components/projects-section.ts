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
          <p class="more-link">
            <a href="/projects/">Go to the project page for more</a>
          </p>
        </div>
      </section>
    `
  }

  static styles = css`
    .page {
      height: 100%;
      padding: clamp(1.1rem, 2vw, 2rem) clamp(1rem, 2.2vw, 2.2rem);
      display: grid;
      grid-template-rows: auto auto minmax(0, 1fr);
      gap: 0;
      overflow: hidden;
    }

    header {
      margin-bottom: 0.75rem;
    }

    h2 {
      margin: 0;
      font-size: clamp(2.4rem, 5.5vw, 3.4rem);
      color: #fff;
      -webkit-text-stroke: clamp(1px, 0.045em, 4px) #000;
      paint-order: stroke fill;
      text-shadow: none;
    }

    p {
      margin: 0.6rem 0 0;
      opacity: 0.85;
      max-width: 45rem;
      font-size: clamp(1rem, 1.5vw, 1.2rem);
      color: #fff;
      -webkit-text-stroke: clamp(0.7px, 0.035em, 2px) #000;
      paint-order: stroke fill;
      text-shadow: none;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0.85rem 0 1rem;
    }

    button {
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(0, 0, 0, 0.35);
      color: #eef8ff;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
    }

    button[data-active] {
      background: #b9e8ff;
      border-color: #d2efff;
      color: #0a1a28;
    }

    .projects-box {
      position: relative;
      min-height: 0;
      max-height: 100%;
      overflow: hidden;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(0, 0, 0, 0.33);
      padding: 1rem 1rem 3.8rem;
    }

    .projects-box::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 6rem;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.85));
      pointer-events: none;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      align-items: stretch;
    }

    .more-link {
      margin: 0;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.9rem;
      text-align: center;
      z-index: 1;
    }

    .more-link a {
      color: #9ddcff;
      text-decoration: none;
      border-bottom: 1px solid rgba(157, 220, 255, 0.75);
      padding-bottom: 0.15rem;
      font-size: 0.95rem;
      letter-spacing: 0.01em;
    }

    @media (max-width: 1100px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 760px) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'projects-section': ProjectsSection
  }
}
