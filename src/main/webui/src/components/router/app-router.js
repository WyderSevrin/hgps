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
            background: #ffffff; /* Couleur de l'arrière-plan pour couvrir ce qui est derrière */
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Optionnel : Une ombre pour donner un effet de profondeur */
            z-index: 10; /* S'assurer que l'en-tête reste au-dessus du reste */
        }



        main > side-bar-component {
            width: 7%;
        }

        main > .pageContainer {
            box-sizing: border-box;
            overflow: hidden;
            min-height: 0;
            transition: width 0.3s ease;
            z-index: 1;

            width: 93%;
        }

        main > .pageContainer.globalDrawerOpen {
            width: 73%;
        }

        main > .drawerContent {
            box-sizing: border-box;
            display: flex;
            min-height: 0;
            transition: width 0.3s ease;
            width: 0px;
            overflow: hidden;
        }

        main > .drawerContent.globalDrawerOpen {
            width: 20%;
        }


    `;

    static properties = {
        currentPage: {type: String},
        drawerOpen: {type: Boolean},
    };

    constructor() {
        super();
        this.currentPage = this._getPageFromHash();
        this.drawerOpen = false;
        this._onHashChange = this._onHashChange.bind(this);
        this._onOpenDrawer = this._onOpenDrawer.bind(this);
        this._onCloseDrawer = this._onCloseDrawer.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('hashchange', this._onHashChange);
        window.addEventListener('open-drawer', this._onOpenDrawer);
        window.addEventListener('close-drawer', this._onCloseDrawer);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._onHashChange);
        window.removeEventListener('open-drawer', this._onOpenDrawer);
        window.removeEventListener('close-drawer', this._onCloseDrawer);
        super.disconnectedCallback();
    }

    _onOpenDrawer() {
        this.drawerOpen = true;
    }

    _onCloseDrawer() {
        this.drawerOpen = false;
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
                <div class="pageContainer ${this.drawerOpen ? 'globalDrawerOpen' : ''}">
                    ${this._renderPage()}
                </div>

                <!-- Ajoutez le tiroir global ici -->
                <drawer-component class="drawerContent ${this.drawerOpen ? 'globalDrawerOpen' : ''}"></drawer-component>
            </main>
        `;
    }


}

customElements.define('app-router', AppRouter);