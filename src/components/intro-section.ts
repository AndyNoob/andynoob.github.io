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
        <div class="content">
          <div class="hello"><h1 id="intro-title">${this.title}</h1></div>
          ${this.subtitle ? html`<p class="subtitle">${this.subtitle}</p>` : null}
          <p class="bio">${this.bio}</p>
        </div>
      </section>
    `
  }

  static styles = css`
    .page {
      height: 100svh;
      display: grid;
      place-items: center;
      padding: clamp(1.2rem, 2vw, 2rem);
      overflow: clip;
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: clamp(0.9rem, 1.5vw, 1.4rem);
      width: min(92vw, 1200px);
      animation: slideIn 460ms ease both;
    }

    h1 {
      margin: 0;
      font-size: clamp(5.5rem, 21vw, 16rem);
      font-weight: 700;
      line-height: 1;
      color: #fff;
      -webkit-text-stroke: clamp(2px, 0.06em, 10px) #000;
      paint-order: stroke fill;
      text-shadow: none;
    }

    .subtitle {
      font-size: clamp(1.5rem, 3vw, 2.4rem);
      opacity: 0.85;
      color: #fff;
      -webkit-text-stroke: clamp(1px, 0.045em, 4px) #000;
      paint-order: stroke fill;
      text-shadow: none;
      margin: 0;
    }

    .bio {
      max-width: 54rem;
      font-size: clamp(1.35rem, 2.5vw, 2rem);
      line-height: 1.5;
      text-align: right;
      width: 100%;
      margin: 0;
      color: #fff;
      -webkit-text-stroke: clamp(1px, 0.04em, 3px) #000;
      paint-order: stroke fill;
      text-shadow: none;
    }

    @media (max-width: 768px) {
      .bio {
        text-align: left;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(-8vw);
        opacity: 0;
      }
      to {
        transform: translateX(0);
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
