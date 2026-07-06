import {LitElement, html, css} from 'lit';

export class AppRouter extends LitElement {
    static styles = css`

        :host {
            display: flex;
            flex-direction: column;
            height: 100vh; /* anchor the whole layout */
        }

        main {
            margin-top: 60px;
            flex: 1;
            min-height: 0; /* let children's 100% height resolve */
            display: flex;
            flex-direction: row;
            width: 100%;
            box-sizing: border-box;
        }
        
        main > * {
            display: flex;
            flex-direction: row;
        }

        header-component {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: var(--hgps-bg); /* Couleur de l'arrière-plan pour couvrir ce qui est derrière */
            box-shadow: 0px 2px 5px var(--hgps-shadow-soft); /* Optionnel : Une ombre pour donner un effet de profondeur */
            z-index: 10; /* S'assurer que l'en-tête reste au-dessus du reste */
        }

        main > side-bar-component {
            flex: 0 0 auto; /* width is driven by the sidebar's own (collapsible) content */
        }

        main > .pageContainer {
            box-sizing: border-box;
            overflow: hidden;
            min-height: 0;
            z-index: 1;

            flex: 1 1 auto; /* take the remaining width */
            min-width: 0;
        }


    `;

    static properties = {
        currentPage: {type: String},
    };

    constructor() {
        super();
        this.currentPage = this._getPageFromHash();
        this._onHashChange = this._onHashChange.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('hashchange', this._onHashChange);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._onHashChange);
        super.disconnectedCallback();
    }

    _onHashChange() {
        this.currentPage = this._getPageFromHash();
    }

    _getPageFromHash() {
        const hash = window.location.hash;
        return hash ? hash.replace('#', '') : 'home';
    }

    _renderPage() {
        switch (this.currentPage) {
            case 'home':
                return html`
                    <home-page></home-page>`;
            case 'map':
                return html`
                    <map-page></map-page>`;
            case 'guide':
                return html`
                    <guide-page></guide-page>`;
            default:
                return html`
                    <not-found-page></not-found-page>`;
        }
    }

    render() {
        return html`
            <header-component></header-component>
            <main>
                <side-bar-component></side-bar-component>
                <div class="pageContainer">
                    ${this._renderPage()}
                </div>
            </main>
        `;
    }


}

customElements.define('app-router', AppRouter);