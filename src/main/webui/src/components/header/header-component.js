import { LitElement, html } from 'lit';
import { headerControlStyles } from '../../styles/shared.styles.js';
import { headerComponentStyles } from './header-component.styles.js';
import '../icon/icon.js';
import '../modal/modal-component.js';
import '../friends/friends-panel.js';
import '../notifications/notifications-menu.js';
import '../language/language-menu.js';
import '../user-options/user-options-panel.js';
import { I18nController, t } from '../../services/i18n/i18n.js';
import { auth } from '../../services/auth/authService.js';

export class HeaderComponent extends LitElement {
    static styles = [headerControlStyles, headerComponentStyles];

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
                    <button class="header-control"
                            title="${t('header.friends')}"
                            aria-label="${t('header.friends')}"
                            aria-haspopup="dialog"
                            @click="${() => this.friendsOpen = true}">
                        <custom-icon label="group"></custom-icon>
                    </button>
                    <button class="header-control"
                            title="${t('header.userOptions')}"
                            aria-label="${t('header.userOptions')}"
                            aria-haspopup="dialog"
                            @click="${() => this.optionsOpen = true}">
                        <custom-icon label="manage_accounts"></custom-icon>
                    </button>
                    <language-menu></language-menu>
                    <button class="header-control"
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
