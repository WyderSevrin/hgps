import {LitElement, html} from 'lit';
import { fieldLabelStyles } from '../../styles/shared.styles.js';
import { goldPresenceFilterStyles } from './gold-presence-filter.styles.js';
import {Area} from '../../models/area.js';
import {I18nController, t} from '../../services/i18n/i18n.js';

/**
 * Multi-select filter over the gold presence levels (0 = undetermined .. 5).
 * Each level is a toggle chip tinted with its palette color.
 *
 * @property {number[]} levels - the selected (visible) levels
 *
 * Fires a `filter-change` CustomEvent with `detail: {levels}` (sorted numbers).
 */
export class GoldPresenceFilter extends LitElement {
    static styles = [fieldLabelStyles, goldPresenceFilterStyles];

    static properties = {
        levels: {type: Array},
    };

    static ALL_LEVELS = Array.from(
        {length: Area.GOLD_PRESENCE_MAX - Area.GOLD_PRESENCE_MIN + 1},
        (_, i) => Area.GOLD_PRESENCE_MIN + i);

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.levels = [...GoldPresenceFilter.ALL_LEVELS];
    }

    _emit(levels) {
        this.levels = [...levels].sort((a, b) => a - b);
        this.dispatchEvent(new CustomEvent('filter-change', {
            detail: {levels: this.levels},
            bubbles: true,
            composed: true,
        }));
    }

    _toggle(level) {
        const set = new Set(this.levels);
        set.has(level) ? set.delete(level) : set.add(level);
        this._emit(set);
    }

    render() {
        const selected = new Set(this.levels);
        const allSelected = GoldPresenceFilter.ALL_LEVELS.every(l => selected.has(l));
        return html`
            <div class="top">
                <span class="field-label" id="label">${t('mapFilters.goldPresence')}</span>
                ${allSelected ? null : html`
                    <button class="all" @click="${() => this._emit(GoldPresenceFilter.ALL_LEVELS)}">
                        ${t('mapFilters.showAll')}
                    </button>`}
            </div>
            <div class="chips" role="group" aria-labelledby="label">
                ${GoldPresenceFilter.ALL_LEVELS.map(level => {
                    const name = level === Area.GOLD_PRESENCE_MIN
                            ? t('map.goldPresenceUnset')
                            : `${level} / ${Area.GOLD_PRESENCE_MAX}`;
                    return html`
                        <button class="chip"
                                style="--chip-color: var(${Area.goldPresenceColorVar(level)})"
                                aria-pressed="${selected.has(level)}"
                                title="${name}"
                                @click="${() => this._toggle(level)}">
                            <span class="dot"></span>${level === Area.GOLD_PRESENCE_MIN ? '?' : level}
                        </button>`;
                })}
            </div>
        `;
    }
}

customElements.define('gold-presence-filter', GoldPresenceFilter);
