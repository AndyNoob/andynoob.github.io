import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('intro-section')
export class IntroSection extends LitElement {
  @property({ type: String })
  title = 'Hello'

  @property({ type: String })
  subtitle = ''

  @property({ type: String })
  bio = ''

  @state()
  private visible = false

  private observer: IntersectionObserver | null = null

  firstUpdated(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        this.visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.45)
      },
      { threshold: [0.25, 0.45, 0.65] }
    )
    this.observer.observe(this)
  }

  disconnectedCallback(): void {
    this.observer?.disconnect()
    super.disconnectedCallback()
  }

  protected render() {
    return html`
      <section aria-labelledby="intro-title" class="page">
        <div class=${`content ${this.visible ? 'is-visible' : 'is-hidden'}`}>
          <div class="hello"><h1 id="intro-title">${this.title}</h1></div>
          <p class="subtitle">${this.subtitle}</p>
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
      transition:
        transform 450ms ease,
        opacity 450ms ease;
    }

    .content.is-visible {
      opacity: 1;
      transform: translateX(0);
    }

    .content.is-hidden {
      opacity: 0;
      transform: translateX(-8vw);
    }

    h1 {
      margin: 0;
      font-size: clamp(5.5rem, 21vw, 16rem);
      font-weight: 700;
      line-height: 1;
      text-shadow:
        -2px 0 #000,
        0 2px #000,
        2px 0 #000,
        0 -2px #000,
        0 0 14px rgba(0, 0, 0, 0.7);
    }

    .subtitle {
      font-size: clamp(1.5rem, 3vw, 2.4rem);
      opacity: 0.85;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.85);
      margin: 0;
    }

    .bio {
      max-width: 54rem;
      font-size: clamp(1.35rem, 2.5vw, 2rem);
      line-height: 1.5;
      text-align: right;
      width: 100%;
      margin: 0;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
    }

    @media (max-width: 768px) {
      .bio {
        text-align: left;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'intro-section': IntroSection
  }
}
