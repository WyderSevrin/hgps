// guide-page.js
import { LitElement, html } from 'lit';
import { guidePageStyles } from './guide-page.styles.js';
import { I18nController, t } from '../../services/i18n/i18n.js';

export class GuidePage extends LitElement {
    static styles = guidePageStyles;

    static properties = {
        summaryCollapsed: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.summaryCollapsed = false;
    }

    // Built on every render so the texts follow the current language.
    get sections() {
        const list = key => t(key, { returnObjects: true });
        return [
            {
                id: 'where-to-find-the-gold',
                title: t('guide.whereToFind.title'),
                content: html`
                    <p>${t('guide.whereToFind.text')}</p>
                    <ul>
                        ${list('guide.whereToFind.items').map(item => html`<li>${item}</li>`)}
                    </ul>
                    <img src="/quinoa/river.png" alt="${t('guide.imageAlt')}" />
                `,
            },
            {
                id: 'how-to-pan-for-gold',
                title: t('guide.howToPan.title'),
                content: html`
                    <p>${t('guide.howToPan.text')}</p>
                    <ol>
                        ${list('guide.howToPan.steps').map(step => html`<li>${step}</li>`)}
                    </ol>
                    <img src="/quinoa/guide.png" alt="${t('guide.imageAlt')}" />
                `,
            },
            {
                id: 'from-where-comes-the-gold',
                title: t('guide.origin.title'),
                content: html`
                    <p>${t('guide.origin.text')}</p>
                `,
            },
        ];
    }

    scrollToSection(id) {
        const target = this.renderRoot.getElementById(id);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    toggleSummary() {
        this.summaryCollapsed = !this.summaryCollapsed;
    }

    render() {
        const sections = this.sections;
        return html`
        <div class="page">
            <div class="page-content">
                <div class="summary ${this.summaryCollapsed ? 'collapsed' : ''}">
                    <button
                        class="summary-toggle"
                        aria-label="${this.summaryCollapsed ? t('guide.showSummary') : t('guide.hideSummary')}"
                        aria-expanded="${!this.summaryCollapsed}"
                        @click=${() => this.toggleSummary()}
                    >
                        <custom-icon label="menu"></custom-icon>
                    </button>
                    <div class="summary-items">
                        ${sections.map(section => html`
                            <button
                                class="summary-item"
                                @click=${() => this.scrollToSection(section.id)}
                            >${section.title}</button>
                        `)}
                    </div>
                </div>
                <div class="guide-content">
                    <h1>${t('guide.welcome')}</h1>
                    <p>${t('guide.intro')}</p>

                    ${sections.map(section => html`
                        <div id=${section.id} class="guide-section">
                            <h1>${section.title}</h1>
                            ${section.content}
                        </div>
                    `)}
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('guide-page', GuidePage);
