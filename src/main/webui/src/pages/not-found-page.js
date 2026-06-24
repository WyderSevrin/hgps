// not-found-page.js
import { LitElement, html, css } from 'lit';

export class NotFoundPage extends LitElement {
    static styles = css`
    h1 {
      color: red;
    }
  `;

    render() {
        return html`<h1>404 - Page Not Found</h1>`;
    }
}

customElements.define('not-found-page', NotFoundPage);