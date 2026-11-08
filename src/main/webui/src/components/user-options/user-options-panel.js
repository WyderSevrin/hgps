import {LitElement, html, css} from 'lit';
import '../icon/icon.js';
import {I18nController, t} from '../../services/i18n/i18n.js';

// Option categories, in navigation order. Labels come from
// userOptions.categories.<id>.{title,description}.
const CATEGORIES = [
    {id: 'account', icon: 'account_circle'},
    {id: 'map', icon: 'map'},
    {id: 'appearance', icon: 'palette'},
];

/**
 * User options, split into categories: a side navigation on the left and
 * the selected category's options on the right. On narrow screens the
 * navigation becomes a row of tabs above the content.
 *
 * The categories are empty for now; each one renders a placeholder.
 *
 * @property {string} category - id of the selected category
 */
export class UserOptionsPanel extends LitElement {
    static styles = css`
        :host {
            display: flex;
            min-height: 22rem;
        }

        /* ---- Side navigation ---- */
        nav {
            flex: 0 0 13rem;
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-1);
            padding: var(--hgps-size-3);
            box-sizing: border-box;
            background-color: var(--hgps-bg);
            border-right: thin solid var(--hgps-border);
        }

        .tab {
            all: unset;
            position: relative;
            display: flex;
            align-items: center;
            gap: var(--hgps-size-3);
            padding: var(--hgps-size-2) var(--hgps-size-3);
            border-radius: var(--hgps-size-2);
            color: var(--hgps-text-muted);
            font-size: 0.88rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.15s ease, color 0.15s ease;
        }

        .tab custom-icon {
            color: var(--hgps-text-subtle);
            transition: color 0.15s ease;
        }

        .tab:hover {
            background-color: var(--hgps-surface-2);
            color: var(--hgps-text);
        }

        .tab[aria-selected="true"] {
            background-color: color-mix(in srgb, var(--hgps-accent) 14%, transparent);
            color: var(--hgps-text-strong);
            font-weight: 600;
        }

        .tab[aria-selected="true"] custom-icon {
            color: var(--hgps-accent);
        }

        /* Gold marker on the selected entry */
        .tab[aria-selected="true"]::before {
            content: '';
            position: absolute;
            left: 0;
            top: 20%;
            bottom: 20%;
            width: 0.1875rem;
            border-radius: 0.1875rem;
            background-color: var(--hgps-accent);
        }

        .tab:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: -0.125rem;
        }

        /* ---- Content ---- */
        .content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-4);
            padding: var(--hgps-size-5) var(--hgps-size-6);
            box-sizing: border-box;
        }

        .content-header h3 {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--hgps-text-strong);
        }

        .content-header p {
            margin: var(--hgps-size-1) 0 0;
            font-size: 0.84rem;
            color: var(--hgps-text-subtle);
        }

        .empty {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--hgps-size-2);
            padding: var(--hgps-size-6) var(--hgps-size-4);
            border: thin dashed var(--hgps-border-strong);
            border-radius: var(--hgps-size-3);
            color: var(--hgps-text-muted);
            font-size: 0.86rem;
            text-align: center;
        }

        .empty custom-icon {
            color: var(--hgps-text-faint);
        }

        /* ---- Narrow screens: tabs on top ---- */
        @media (max-width: 40rem) {
            :host {
                flex-direction: column;
            }

            nav {
                flex: 0 0 auto;
                flex-direction: row;
                overflow-x: auto;
                border-right: none;
                border-bottom: thin solid var(--hgps-border);
            }

            .tab {
                flex: 1 0 auto;
                justify-content: center;
            }

            .tab[aria-selected="true"]::before {
                top: auto;
                bottom: 0;
                left: 20%;
                right: 20%;
                width: auto;
                height: 0.1875rem;
            }

            .content {
                padding: var(--hgps-size-4);
            }
        }
    `;

    static properties = {
        category: {type: String},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.category = CATEGORIES[0].id;
    }

    get _tabs() {
        return [...this.shadowRoot.querySelectorAll('.tab')];
    }

    // Arrow keys move between categories (both orientations), Home/End jump.
    _onNavKeyDown(event) {
        const index = CATEGORIES.findIndex(c => c.id === this.category);
        const last = CATEGORIES.length - 1;
        const next = {
            ArrowDown: index === last ? 0 : index + 1,
            ArrowRight: index === last ? 0 : index + 1,
            ArrowUp: index === 0 ? last : index - 1,
            ArrowLeft: index === 0 ? last : index - 1,
            Home: 0,
            End: last,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        this.category = CATEGORIES[next].id;
        this.updateComplete.then(() => this._tabs[next]?.focus());
    }

    render() {
        const current = CATEGORIES.find(c => c.id === this.category) ?? CATEGORIES[0];
        const key = `userOptions.categories.${current.id}`;
        return html`
            <nav role="tablist" aria-orientation="vertical"
                 aria-label="${t('userOptions.categoriesLabel')}"
                 @keydown="${this._onNavKeyDown}">
                ${CATEGORIES.map(c => {
                    const selected = c.id === current.id;
                    return html`
                        <button class="tab" role="tab" id="tab-${c.id}"
                                aria-selected="${selected}"
                                aria-controls="panel"
                                tabindex="${selected ? 0 : -1}"
                                @click="${() => this.category = c.id}">
                            <custom-icon label="${c.icon}"></custom-icon>
                            <span>${t(`userOptions.categories.${c.id}.title`)}</span>
                        </button>`;
                })}
            </nav>

            <section class="content" id="panel" role="tabpanel" aria-labelledby="tab-${current.id}">
                <div class="content-header">
                    <h3>${t(`${key}.title`)}</h3>
                    <p>${t(`${key}.description`)}</p>
                </div>
                <div class="empty">
                    <custom-icon label="${current.icon}"></custom-icon>
                    <span>${t('userOptions.empty')}</span>
                </div>
            </section>
        `;
    }
}

customElements.define('user-options-panel', UserOptionsPanel);
