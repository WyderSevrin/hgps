import { LitElement, html, css } from 'lit';
import '../icon/icon.js';
import '../modal/modal-component.js';
import '../friends/friends-panel.js';
import '../notifications/notifications-menu.js';
import '../language/language-menu.js';
import '../user-options/user-options-panel.js';
import { I18nController, t } from '../../services/i18n/i18n.js';
import { auth } from '../../services/auth/authService.js';

export class HeaderComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        header {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            box-sizing: border-box;
            padding: 6px 24px;
            /* Match the 60px slot reserved by the app layout (main margin-top) */
            height: 60px;
            background: var(--hgps-header-bg);
            color: var(--hgps-on-header);
            border-bottom: 2px solid var(--hgps-header-border);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .pickaxe {
            width: 30px;
            height: 30px;
            flex: 0 0 auto;
            color: var(--hgps-gold);
        }

        .title {
            margin: 0;
            font-size: clamp(18px, 3vw, 24px);
            font-weight: 800;
            letter-spacing: 0.5px;
            color: var(--hgps-gold-bright);
        }

        /* Actions (friends, user options, language) pinned to the far right */
        .actions {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .icon-btn {
            all: unset;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: var(--hgps-header-control);
            border: 1px solid var(--hgps-gold);
            color: var(--hgps-gold-bright);
            cursor: pointer;
            transition: background-color 0.25s ease, border-color 0.25s ease;
        }
        .icon-btn:hover {
            background-color: var(--hgps-header-control-hover);
            border-color: var(--hgps-gold-bright);
        }
        .icon-btn:focus-visible {
            outline: none;
            border-color: var(--hgps-gold-bright);
            box-shadow: 0 0 0 2px var(--hgps-accent-ring);
        }
        .icon-btn custom-icon {
            font-size: 20px;
        }


        @media (max-width: 520px) {
            header { padding: 6px 12px; }
            .brand { gap: 8px; }
        }
    `;

    static properties = {
        friendsOpen: { type: Boolean, state: true },
        optionsOpen: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.friendsOpen = false;
        this.optionsOpen = false;
    }

    render() {
        return html`
            <header>
                <!-- Brand: simple pickaxe icon + title -->
                <div class="brand">
                    <svg
                        class="pickaxe"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <!-- Double-pointed pick head, sweeping down to both tips -->
                        <path d="M4 8.5c4-3.5 12-3.5 16 0" />
                        <path d="M4 8.5 8 12" />
                        <path d="M20 8.5 16 12" />
                        <!-- Wooden handle down through the head -->
                        <path d="M12 6 12 20" />
                    </svg>

                    <h1 class="title">${t('header.title')}</h1>
                </div>

                <!-- Far-right actions: notifications, friends, user options, language -->
                <div class="actions">
                    <notifications-menu></notifications-menu>
                    <button class="icon-btn"
                            title="${t('header.friends')}"
                            aria-label="${t('header.friends')}"
                            aria-haspopup="dialog"
                            @click="${() => this.friendsOpen = true}">
                        <custom-icon label="group"></custom-icon>
                    </button>
                    <button class="icon-btn"
                            title="${t('header.userOptions')}"
                            aria-label="${t('header.userOptions')}"
                            aria-haspopup="dialog"
                            @click="${() => this.optionsOpen = true}">
                        <custom-icon label="manage_accounts"></custom-icon>
                    </button>
                    <language-menu></language-menu>
                    <button class="icon-btn"
                            title="${t('auth.logoutAs', {username: auth.user?.username})}"
                            aria-label="${t('auth.logout')}"
                            @click="${() => auth.logout()}">
                        <custom-icon label="logout"></custom-icon>
                    </button>
                </div>
            </header>

            <modal-dialog icon="group"
                          style="--modal-width: 34rem; --modal-max-height: 44rem"
                          heading="${t('header.friends')}"
                          ?open="${this.friendsOpen}"
                          @modal-save="${() => this.friendsOpen = false}"
                          @modal-cancel="${() => this.friendsOpen = false}">
                <friends-panel></friends-panel>
            </modal-dialog>

            <modal-dialog icon="manage_accounts"
                          style="--modal-width: 46rem; --modal-body-padding: 0"
                          heading="${t('header.userOptions')}"
                          ?open="${this.optionsOpen}"
                          @modal-save="${() => this.optionsOpen = false}"
                          @modal-cancel="${() => this.optionsOpen = false}">
                <user-options-panel></user-options-panel>
            </modal-dialog>
        `;
    }
}

customElements.define('header-component', HeaderComponent);
