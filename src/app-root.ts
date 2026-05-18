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

  private wheelDelta = 0
  private lastWheelAt = 0
  private wheelNavigationLock = false

  private onHashChange = () => {
    this.route = resolveRoute(window.location.hash)
  }

  private onWheel = (event: WheelEvent) => {
    if (this.wheelNavigationLock) {
      event.preventDefault()
      return
    }

    if (!this.canNavigateFromProjects(event.deltaY)) {
      return
    }

    const now = performance.now()
    if (now - this.lastWheelAt > 280) {
      this.wheelDelta = 0
    }
    this.lastWheelAt = now
    this.wheelDelta += event.deltaY

    if (Math.abs(this.wheelDelta) < 140) {
      return
    }

    event.preventDefault()
    const direction = this.wheelDelta > 0 ? 1 : -1
    this.wheelDelta = 0

    const currentIndex = routeOrder.indexOf(this.route)
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), routeOrder.length - 1)
    if (nextIndex === currentIndex) {
      return
    }

    this.wheelNavigationLock = true
    window.location.hash = `#/${routeOrder[nextIndex]}`
    window.setTimeout(() => {
      this.wheelNavigationLock = false
    }, 500)
  }

  connectedCallback(): void {
    super.connectedCallback()
    if (!window.location.hash) {
      window.location.hash = defaultHash
    }
    window.addEventListener('hashchange', this.onHashChange)
    window.addEventListener('wheel', this.onWheel, { passive: false })
    void this.bootstrapProjects()
  }

  disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.onHashChange)
    window.removeEventListener('wheel', this.onWheel)
    super.disconnectedCallback()
  }

  private canNavigateFromProjects(deltaY: number): boolean {
    if (this.route !== 'projects') {
      return true
    }

    const projectsSection = this.renderRoot.querySelector('projects-section')
    const projectsBox = projectsSection?.shadowRoot?.querySelector<HTMLElement>('.projects-box')
    if (!projectsBox) {
      return true
    }

    const maxScroll = projectsBox.scrollHeight - projectsBox.clientHeight
    if (maxScroll <= 0) {
      return true
    }

    if (deltaY > 0) {
      return projectsBox.scrollTop + projectsBox.clientHeight >= projectsBox.scrollHeight - 2
    }

    return projectsBox.scrollTop <= 2
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

    switch (this.route) {
      case 'projects':
        return html`
          <section class="section">
            <projects-section
              .title=${dictionary.projectsTitle}
              .subtitle=${dictionary.projectsSubtitle}
              .projects=${this.projects}
            ></projects-section>
            ${this.loadError ? html`<p class="error">${this.loadError}</p>` : null}
          </section>
        `
      case 'contact':
        return html`
          <section class="section">
            <contact-section
              .title=${dictionary.contactTitle}
              .subtitle=${dictionary.contactSubtitle}
            ></contact-section>
          </section>
        `
      default:
        return html`
          <section class="section">
            <intro-section
              .title=${dictionary.introTitle}
              .subtitle=${dictionary.introSubtitle}
              .bio=${dictionary.introBio}
            ></intro-section>
          </section>
        `
    }
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
      height: 100svh;
      color: white;
      position: relative;
      overflow: hidden;
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
      background: rgba(0, 0, 0, 0.72);
      border-color: rgba(127, 215, 255, 0.95);
      color: #ecf8ff;
    }

    main {
      height: 100svh;
      padding-right: 4.5rem;
      overflow: hidden;
    }

    .section {
      height: 100svh;
      position: relative;
      overflow: hidden;
    }

    .error {
      margin: 0;
      position: absolute;
      left: 1rem;
      right: 5.2rem;
      bottom: 0.75rem;
      color: #ffcccc;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 204, 204, 0.45);
      border-radius: 0.5rem;
      padding: 0.45rem 0.6rem;
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
