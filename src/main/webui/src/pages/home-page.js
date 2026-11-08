// home-page.js
import { LitElement, html, css } from 'lit';
import { I18nController, t } from '../services/i18n/i18n.js';

export class HomePage extends LitElement {
    static styles = css`
        :host {
        }
        
        h1 {
            color: var(--hgps-accent);
        }
    `;

    constructor() {
        super();
        this.i18n = new I18nController(this);
    }

    render() {
        return html`<h1>${t('home.welcome')}</h1>
            <div class="page-content">
                <div></div>
                <div class="">
                    
                    
                </div>
                
                
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);