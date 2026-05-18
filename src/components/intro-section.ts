import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('intro-section')
export class IntroSection extends LitElement {
  @property({ type: String })
  title = 'Hello'

  @property({ type: String })
  subtitle = ''

  @property({ type: String })
  bio = ''

  protected render() {
    return html`
      <section aria-labelledby="intro-title" class="page">
        <div class="hello"><h1 id="intro-title">${this.title}</h1></div>
        <p class="subtitle">${this.subtitle}</p>
        <p class="bio">${this.bio}</p>
      </section>
    `
  }

  static styles = css`
    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: 1rem;
      padding: 2rem;
      animation: fadeUp 0.4s ease;
    }

    h1 {
      margin: 0;
      font-size: clamp(4rem, 16vw, 11rem);
      font-weight: 700;
      line-height: 1;
    }

    .subtitle {
      font-size: clamp(1.1rem, 2.3vw, 1.7rem);
      opacity: 0.85;
    }

    .bio {
      max-width: 45rem;
      font-size: clamp(1.05rem, 2vw, 1.5rem);
      line-height: 1.5;
      text-align: right;
      width: 100%;
    }

    @media (max-width: 768px) {
      .bio {
        text-align: left;
      }
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
    'intro-section': IntroSection
  }
}
