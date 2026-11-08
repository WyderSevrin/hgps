// not-found-page.js
import { LitElement, html, css } from 'lit';
import { I18nController, t } from '../services/i18n/i18n.js';

export class NotFoundPage extends LitElement {
    static styles = css`
    h1 {
      color: var(--hgps-danger);
    }
  `;

    constructor() {
        super();
        this.i18n = new I18nController(this);
    }

    render() {
        return html`<h1>${t('notFound.title')}</h1>`;
    }
}

customElements.define('not-found-page', NotFoundPage);