// guide-page.js
import { LitElement, html, css } from 'lit';
import { I18nController, t } from '../services/i18n/i18n.js';

export class GuidePage extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
        }

        h1 {
            color: var(--hgps-accent);
        }

        .page {
            height: 100%;
        }

        .page-content {
            height: 100%;
        }

        .summary {
            margin: var(--hgps-size-3);
            padding: var(--hgps-size-5);
            width: fit-content;
            border-radius: var(--hgps-size-3);
            background-color: rgba(38, 54, 63, 0.95);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-3);
            z-index: 100;
            position: fixed;
            right: var(--hgps-size-8);
            overflow: hidden;
            transition:
                width 0.25s ease,
                background-color 0.25s ease;
        }

        .summary.collapsed {
            width: calc(var(--hgps-size-9) + var(--hgps-size-5));
            background-color: transparent;
        }

        .summary.collapsed .summary-toggle {
            background-color: var(--hgps-surface-2);
            transform: rotate(180deg);
        }

        .summary-toggle {
            all: unset;
            align-self: flex-end;
            width: var(--hgps-size-9);
            height: var(--hgps-size-9);
            border-radius: var(--hgps-size-2);
            color: var(--hgps-accent);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition:
                background-color 0.15s ease,
                transform 0.25s ease;
        }

        .summary-toggle:hover,
        .summary-toggle:focus-visible {
            background-color: var(--hgps-surface-hover);
        }

        .summary-toggle:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: 0.125rem;
        }

        .summary-items {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-3);
            width: 100%;
            overflow: hidden;
            opacity: 1;
            transform: translateX(0);
            transition:
                opacity 0.2s ease,
                max-height 0.25s ease,
                transform 0.25s ease;
        }

        .summary.collapsed .summary-items {
            pointer-events: none;
            opacity: 0;
            max-height: 0;
            transform: translateX(calc(0rem - var(--hgps-size-3)));
        }

        .summary-item {
            all: unset;
            cursor: pointer;
            padding: var(--hgps-size-2) var(--hgps-size-3);
            border-radius: var(--hgps-size-2);
            color: var(--hgps-accent);
            font-size: var(--hgps-font-size-3);
            font-weight: 600;
            white-space: nowrap;
            transition: background-color 0.15s ease;
        }

        .summary-item:hover,
        .summary-item:focus-visible {
            background-color: var(--hgps-surface-3);
        }

        .guide-content {
            height: 100%;
            box-sizing: border-box;
            padding: var(--hgps-size-8);
            overflow-y: auto;
            scroll-behavior: smooth;
        }

        .guide-section {
            scroll-margin-top: var(--hgps-size-5);
            margin-bottom: var(--hgps-size-10);
        }
    `;

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
