import {LitElement, html} from 'lit';
import { buttonStyles } from '../../styles/shared.styles.js';
import { modalComponentStyles } from './modal-component.styles.js';
import '../icon/icon.js';
import {I18nController, t} from '../../services/i18n/i18n.js';

/**
 * Reusable modal built on the native <dialog> element (rendered in the top
 * layer, so it is never clipped by its host's stacking context).
 *
 * @property {boolean} open - whether the modal is shown (reflected as attribute)
 * @property {string} heading - title shown in the header
 * @property {string} icon - optional Material icon shown before the title
 * @property {string} saveLabel - label of the save button (default: translated "Save")
 * @property {string} cancelLabel - label of the cancel button (default: translated "Cancel")
 *
 * CSS custom properties:
 *  - --modal-width : preferred width (default 28rem, capped at 92vw)
 *  - --modal-max-height : preferred max height (default 40rem, capped at 88vh)
 *  - --modal-body-padding : padding around the slotted content (default 1rem)
 *
 * Slots:
 *  - default : the modal body
 *
 * Events (the modal closes itself in both cases):
 *  - `modal-save`   : the save button was pressed
 *  - `modal-cancel` : cancel, the close cross, Escape or a backdrop click
 */
export class ModalComponent extends LitElement {
    static styles = [buttonStyles, modalComponentStyles];

    static properties = {
        open: {type: Boolean, reflect: true},
        heading: {type: String},
        icon: {type: String},
        saveLabel: {type: String},
        cancelLabel: {type: String},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.open = false;
        this.heading = '';
        this.icon = '';
        // Left empty so the translated defaults are used at render time.
        this.saveLabel = '';
        this.cancelLabel = '';
    }

    get _dialog() {
        return this.shadowRoot?.querySelector('dialog');
    }

    updated(changed) {
        if (!changed.has('open')) return;
        const dialog = this._dialog;
        if (this.open && !dialog.open) dialog.showModal();
        if (!this.open && dialog.open) dialog.close();
    }

    _finish(eventName) {
        this.open = false;
        this.dispatchEvent(new CustomEvent(eventName, {bubbles: true, composed: true}));
    }

    // Escape key: the browser fires `cancel` on the dialog; route it through
    // the same path as the cancel button so `open` stays in sync.
    _onNativeCancel(event) {
        event.preventDefault();
        this._finish('modal-cancel');
    }

    // A click whose target is the <dialog> itself landed on the backdrop
    // (the content fills the dialog box, so inside clicks hit a child).
    _onDialogClick(event) {
        if (event.target === this._dialog) this._finish('modal-cancel');
    }

    render() {
        return html`
            <dialog aria-labelledby="title"
                    @cancel="${this._onNativeCancel}"
                    @click="${this._onDialogClick}">
                <div class="header">
                    ${this.icon ? html`<custom-icon label="${this.icon}"></custom-icon>` : null}
                    <h2 class="title" id="title">${this.heading}</h2>
                    <button class="close"
                            title="${t('common.close')}"
                            aria-label="${t('common.close')}"
                            @click="${() => this._finish('modal-cancel')}">
                        <custom-icon label="close"></custom-icon>
                    </button>
                </div>
                <div class="body"><slot></slot></div>
                <div class="actions">
                    <button class="btn btn-cancel" @click="${() => this._finish('modal-cancel')}">
                        ${this.cancelLabel || t('common.cancel')}
                    </button>
                    <button class="btn btn-save" @click="${() => this._finish('modal-save')}">
                        <custom-icon label="save"></custom-icon>
                        ${this.saveLabel || t('common.save')}
                    </button>
                </div>
            </dialog>
        `;
    }
}

customElements.define('modal-dialog', ModalComponent);
