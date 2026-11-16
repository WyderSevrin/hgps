// not-found-page.js
import { LitElement, html } from 'lit';
import { notFoundPageStyles } from './not-found-page.styles.js';
import { I18nController, t } from '../../services/i18n/i18n.js';

export class NotFoundPage extends LitElement {
    static styles = notFoundPageStyles;

    constructor() {
        super();
        this.i18n = new I18nController(this);
    }

    render() {
        return html`<h1>${t('notFound.title')}</h1>`;
    }
}

customElements.define('not-found-page', NotFoundPage);