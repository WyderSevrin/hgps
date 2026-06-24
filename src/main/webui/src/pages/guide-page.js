// guide-page.js
import { LitElement, html, css } from 'lit';

export class GuidePage extends LitElement {
    static styles = css`
    h1 {
      color: #007acc;
    }
  `;

    render() {
        return html`<h1>Welcome to the Guide Page</h1>`;
    }
}

customElements.define('guide-page', GuidePage);