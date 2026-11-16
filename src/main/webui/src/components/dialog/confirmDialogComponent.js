import {LitElement, html} from 'lit';
import { buttonStyles } from '../../styles/shared.styles.js';
import { confirmDialogComponentStyles } from './confirmDialogComponent.styles.js';
import '../icon/icon.js';
import {I18nController, t} from '../../services/i18n/i18n.js';

export class ConfirmDialogComponent extends LitElement {
    static styles = [buttonStyles, confirmDialogComponentStyles];

    static properties = {
        open: {type: Boolean, reflect: true},
        title: {type: String},
        message: {type: String},
        confirmLabel: {type: String},
        cancelLabel: {type: String},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.open = false;
        // Left empty so the translated defaults are used at render time.
        this.title = '';
        this.message = '';
        this.confirmLabel = '';
        this.cancelLabel = '';
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('keydown', this._onKeyDown);
    }

    disconnectedCallback() {
        window.removeEventListener('keydown', this._onKeyDown);
        super.disconnectedCallback();
    }

    _onKeyDown(event) {
        if (this.open && event.key === 'Escape') {
            this._cancel();
        }
    }

    _confirm() {
        this.dispatchEvent(new CustomEvent('confirm', {bubbles: true, composed: true}));
    }

    _cancel() {
        this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, composed: true}));
    }

    render() {
        return html`
            <div class="backdrop" @click="${() => this._cancel()}"></div>
            <div class="dialog" role="dialog" aria-modal="true">
                <div class="dialog-header">
                    <custom-icon label="warning"></custom-icon>
                    <span>${this.title || t('common.confirm')}</span>
                </div>
                <div class="dialog-body">${this.message || t('common.areYouSure')}</div>
                <div class="dialog-actions">
                    <button class="btn btn-cancel" @click="${() => this._cancel()}">
                        ${this.cancelLabel || t('common.cancel')}
                    </button>
                    <button class="btn btn-danger" @click="${() => this._confirm()}">
                        <custom-icon label="delete"></custom-icon>
                        ${this.confirmLabel || t('common.confirm')}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('confirm-dialog', ConfirmDialogComponent);
