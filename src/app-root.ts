import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { loadProjects } from './lib/projects'
import { t } from './lib/i18n'
import type { Project } from './types'
import './components/intro-section'
import './components/projects-section'
import './components/contact-section'

type Route = 'intro' | 'projects' | 'contact'

const routeOrder: Route[] = ['intro', 'projects', 'contact']
const defaultHash = '#/intro'

function resolveRoute(hash: string): Route {
  const normalized = hash.replace('#/', '').trim()
  if (normalized === 'projects') return 'projects'
  if (normalized === 'contact') return 'contact'
  return 'intro'
}

@customElement('app-root')
export class AppRoot extends LitElement {
  @state()
  private route: Route = resolveRoute(window.location.hash)

  @state()
  private projects: Project[] = []

  @state()
  private loadError = ''

  private sectionObserver: IntersectionObserver | null = null

  private onHashChange = () => {
    this.route = resolveRoute(window.location.hash)
    this.scrollToRoute(this.route)
  }

  connectedCallback(): void {
    super.connectedCallback()
    if (!window.location.hash) {
      window.location.hash = defaultHash
    }
    window.addEventListener('hashchange', this.onHashChange)
    void this.bootstrapProjects()
  }

  firstUpdated(): void {
    this.scrollToRoute(this.route)
    this.attachSectionObserver()
  }

  disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.onHashChange)
    this.sectionObserver?.disconnect()
    super.disconnectedCallback()
  }

  private attachSectionObserver() {
    const sections = [...this.renderRoot.querySelectorAll<HTMLElement>('[data-route]')]
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return

        const route = visible.target.getAttribute('data-route')
        if (route === 'intro' || route === 'projects' || route === 'contact') {
          this.route = route
          if (window.location.hash !== `#/${route}`) {
            window.history.replaceState(null, '', `#/${route}`)
          }
        }
      },
      { threshold: [0.35, 0.6, 0.8] }
    )

    sections.forEach((section) => this.sectionObserver?.observe(section))
  }

  private scrollToRoute(route: Route) {
    const target = this.renderRoot.querySelector<HTMLElement>(`[data-route="${route}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  private async bootstrapProjects() {
    try {
      this.projects = await loadProjects()
      this.loadError = ''
    } catch (error) {
      this.projects = []
      this.loadError = error instanceof Error ? error.message : 'Unknown project load error'
    }
  }

  private renderRoute() {
    const dictionary = t('en')

    return html`
      <section class="section" data-route="intro">
        <intro-section
          .title=${dictionary.introTitle}
          .subtitle=${dictionary.introSubtitle}
          .bio=${dictionary.introBio}
        ></intro-section>
      </section>

      <section class="section" data-route="projects">
        <projects-section
          .title=${dictionary.projectsTitle}
          .subtitle=${dictionary.projectsSubtitle}
          .projects=${this.projects}
        ></projects-section>
        ${this.loadError ? html`<p class="error">${this.loadError}</p>` : null}
      </section>

      <section class="section" data-route="contact">
        <contact-section
          .title=${dictionary.contactTitle}
          .subtitle=${dictionary.contactSubtitle}
        ></contact-section>
      </section>
    `
  }

  protected render() {
    return html`
      <div class="app">
        <nav aria-label="Primary">
          ${routeOrder.map(
            (route) => html`
              <a href=${`#/${route}`} ?data-active=${this.route === route}>${route}</a>
            `
          )}
        </nav>
        <main>
          ${this.renderRoute()}
        </main>
      </div>
    `
  }

  static styles = css`
    .app {
      min-height: 100svh;
      color: white;
      position: relative;
    }

    nav {
      position: fixed;
      top: 50%;
      right: 1.2rem;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 10;
    }

    a {
      text-transform: capitalize;
      text-decoration: none;
      color: inherit;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 999px;
      padding: 0.6rem 0.4rem;
      background: rgba(0, 0, 0, 0.45);
      letter-spacing: 0.08em;
      font-size: 0.68rem;
      backdrop-filter: blur(4px);
    }

    a[data-active] {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.85);
    }

    main {
      min-height: 100svh;
      padding-right: 4.5rem;
    }

    .section {
      min-height: 100svh;
      scroll-margin-top: 0;
    }

    .error {
      margin: 0 2rem 2rem;
      color: #ffcccc;
    }

    @media (max-width: 768px) {
      nav {
        top: auto;
        bottom: 1rem;
        right: 0;
        left: 0;
        transform: none;
        flex-direction: row;
        justify-content: center;
      }

      a {
        writing-mode: horizontal-tb;
        padding: 0.35rem 0.7rem;
      }

      main {
        padding-right: 0;
        padding-bottom: 3.5rem;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot
  }
}
