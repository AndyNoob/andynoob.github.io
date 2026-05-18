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

          <ul>
            <li><a href="https://github.com/AndyNoob" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="mailto:andynoob@users.noreply.github.com">Email</a></li>
            <li><a href="/legacy/project/index.html">Legacy mini-games index</a></li>
            <li><a href="/legacy/project/snake.html">Legacy Snake</a></li>
            <li><a href="/legacy/project/tron.html">Legacy Tron</a></li>
          </ul>
        </div>
      </section>
    `
  }

  static styles = css`
    .page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
      animation: fadeUp 0.4s ease;
    }

    .panel {
      width: min(760px, 100%);
      border-radius: 1rem;
      padding: 2rem;
      background: rgba(18, 18, 18, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
    }

    h2 {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3rem);
    }

    p {
      margin: 0.8rem 0 1.25rem;
      line-height: 1.5;
      opacity: 0.9;
    }

    ul {
      margin: 0;
      padding-left: 1.1rem;
      display: grid;
      gap: 0.65rem;
    }

    a {
      color: inherit;
      text-decoration: none;
      border-bottom: 2px solid rgba(255, 255, 255, 0.55);
    }

    a:hover,
    a:focus-visible {
      border-bottom-color: #fff;
      outline: none;
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
    'contact-section': ContactSection
  }
}
