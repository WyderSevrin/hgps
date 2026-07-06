import {LitElement, html, css} from 'lit';
import '../icon/icon.js';

export class ConfirmDialogComponent extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: none;
        }

        :host([open]) {
            display: block;
        }

        .backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(2px);
        }

        .dialog {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(90vw, 380px);
            box-sizing: border-box;
            background-color: #2b2b2b;
            border: 1px solid #3d3d3d;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            color: #e8e8e8;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
        }

        .dialog-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 16px;
            font-size: 1.05rem;
            font-weight: 600;
            color: #ffffff;
            border-bottom: 1px solid #3d3d3d;
        }

        .dialog-header custom-icon {
            color: #ef5350;
        }

        .dialog-body {
            padding: 16px;
            font-size: 0.9rem;
            line-height: 1.5;
            color: #cfcfcf;
        }

        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            padding: 12px 16px;
            border-top: 1px solid #3d3d3d;
            background-color: #262626;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 9px 16px;
            border: none;
            border-radius: 6px;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .btn-cancel {
            background-color: #454545;
            color: #e8e8e8;
        }

        .btn-cancel:hover {
            background-color: #555555;
        }

        .btn-danger {
            background-color: #e53935;
            color: #ffffff;
        }

        .btn-danger:hover {
            background-color: #f4433a;
        }

        .btn-danger custom-icon {
            font-size: 1rem;
        }
    `;

    static properties = {
        open: {type: Boolean, reflect: true},
        title: {type: String},
        message: {type: String},
        confirmLabel: {type: String},
        cancelLabel: {type: String},
    };

    constructor() {
        super();
        this.open = false;
        this.title = 'Confirm';
        this.message = 'Are you sure?';
        this.confirmLabel = 'Confirm';
        this.cancelLabel = 'Cancel';
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
                    <span>${this.title}</span>
                </div>
                <div class="dialog-body">${this.message}</div>
                <div class="dialog-actions">
                    <button class="btn btn-cancel" @click="${() => this._cancel()}">
                        ${this.cancelLabel}
                    </button>
                    <button class="btn btn-danger" @click="${() => this._confirm()}">
                        <custom-icon label="delete"></custom-icon>
                        ${this.confirmLabel}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('confirm-dialog', ConfirmDialogComponent);
