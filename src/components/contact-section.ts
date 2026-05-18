import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('contact-section')
export class ContactSection extends LitElement {
  @property({ type: String })
  title = 'Contact'

  @property({ type: String })
  subtitle = ''

  protected render() {
    return html`
      <section aria-labelledby="contact-title" class="page">
        <div class="panel">
          <h2 id="contact-title">${this.title}</h2>
          <p>${this.subtitle}</p>

          <div class="gallery" role="list" aria-label="Primary contact links">
            <a
              role="listitem"
              class="item"
              href="https://github.com/AndyNoob"
              target="_blank"
              rel="noreferrer"
            >
              <span class="icon" aria-hidden="true">🐙</span>
              <span>
                <strong>GitHub</strong>
                <small>github.com/AndyNoob</small>
              </span>
            </a>
            <a role="listitem" class="item" href="mailto:andynoob@users.noreply.github.com">
              <span class="icon" aria-hidden="true">✉️</span>
              <span>
                <strong>Email</strong>
                <small>andynoob@users.noreply.github.com</small>
              </span>
            </a>
          </div>

          <footer class="legacy">
            <h3>Legacy mini-games</h3>
            <div class="legacy-links">
              <a href="/legacy/project/index.html">Index</a>
              <a href="/legacy/project/snake.html">Snake</a>
              <a href="/legacy/project/tron.html">Tron</a>
            </div>
          </footer>
        </div>
      </section>
    `
  }

  static styles = css`
    .page {
      height: 100svh;
      display: grid;
      place-items: center;
      padding: clamp(1rem, 2vw, 2rem);
      overflow: clip;
    }

    .panel {
      width: min(760px, 100%);
      border-radius: 1rem;
      padding: clamp(1.1rem, 2vw, 2rem);
      background: rgba(18, 18, 18, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
      display: grid;
      gap: 1.1rem;
    }

    h2 {
      margin: 0;
      font-size: clamp(2.2rem, 5vw, 3.2rem);
      --outline-size: clamp(1px, 0.045em, 4px);
      text-shadow:
        calc(-1 * var(--outline-size)) 0 0 #000,
        var(--outline-size) 0 0 #000,
        0 calc(-1 * var(--outline-size)) 0 #000,
        0 var(--outline-size) 0 #000;
    }

    p {
      margin: 0;
      line-height: 1.5;
      opacity: 0.9;
      --outline-size: clamp(1px, 0.04em, 3px);
      text-shadow:
        calc(-1 * var(--outline-size)) 0 0 #000,
        var(--outline-size) 0 0 #000,
        0 calc(-1 * var(--outline-size)) 0 #000,
        0 var(--outline-size) 0 #000;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.8rem;
    }

    .item {
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.9rem;
      padding: 0.8rem 0.95rem;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.75rem;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      text-decoration: none;
      color: inherit;
    }

    .item:hover,
    .item:focus-visible {
      border-color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.12);
      outline: none;
    }

    .icon {
      font-size: 1.4rem;
    }

    .item span {
      display: grid;
      gap: 0.15rem;
    }

    strong {
      font-size: 1.03rem;
    }

    small {
      opacity: 0.78;
      font-size: 0.86rem;
      overflow-wrap: anywhere;
    }

    .legacy {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 0.9rem;
      display: grid;
      gap: 0.6rem;
    }

    h3 {
      margin: 0;
      font-size: 1.05rem;
    }

    .legacy-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .legacy-links a {
      color: inherit;
      text-decoration: none;
      border-bottom: 2px solid rgba(255, 255, 255, 0.55);
    }

    .legacy-links a:hover,
    .legacy-links a:focus-visible {
      border-bottom-color: #fff;
      outline: none;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'contact-section': ContactSection
  }
}
