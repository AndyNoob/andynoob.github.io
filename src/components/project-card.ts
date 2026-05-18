import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { Project } from '../types'

@customElement('project-card')
export class ProjectCard extends LitElement {
  @property({ attribute: false })
  project: Project | null = null

  protected render() {
    if (!this.project) {
      return html``
    }

    const { title, summary, tech, tags, links, thumbnail, status } = this.project

    return html`
      <article class="card">
        <img src=${thumbnail} alt=${`${title} preview`} loading="lazy" />
        <div class="content">
          <div class="topline">
            <h3>${title}</h3>
            <span class="status">${status}</span>
          </div>
          <p>${summary}</p>
          <div class="meta">${tech.map((item) => html`<span>${item}</span>`)}</div>
          <div class="tags">${tags.map((item) => html`<small>#${item}</small>`)}</div>
          <div class="links">
            ${links.live ? html`<a href=${links.live} target="_blank" rel="noreferrer">Live</a>` : null}
            ${links.source ? html`<a href=${links.source} target="_blank" rel="noreferrer">Source</a>` : null}
            ${links.demo ? html`<a href=${links.demo}>Demo</a>` : null}
          </div>
        </div>
      </article>
    `
  }

  static styles = css`
    .card {
      border-radius: 1rem;
      overflow: hidden;
      background: rgba(30, 30, 30, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.18);
      display: grid;
      grid-template-rows: 180px 1fr;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
      min-height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: #222;
    }

    .content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .topline {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }

    h3 {
      margin: 0;
      font-size: 1.3rem;
    }

    p {
      margin: 0;
      opacity: 0.9;
      line-height: 1.4;
    }

    .status {
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 999px;
      white-space: nowrap;
    }

    .meta,
    .tags,
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .meta span,
    .tags small {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      padding: 0.2rem 0.55rem;
    }

    a {
      text-decoration: none;
      color: inherit;
      border-bottom: 2px solid rgba(255, 255, 255, 0.5);
      padding-bottom: 0.1rem;
    }

    a:hover,
    a:focus-visible {
      border-bottom-color: #fff;
      outline: none;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'project-card': ProjectCard
  }
}
