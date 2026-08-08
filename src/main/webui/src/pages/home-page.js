// home-page.js
import { LitElement, html, css } from 'lit';

export class HomePage extends LitElement {
    static styles = css`
        :host {
        }
        
        h1 {
            color: var(--hgps-accent);
        }
    `;


    render() {
        return html`<h1>Welcome to the Home Page</h1>
            <div class="page-content">
                <div></div>
                <div class="">
                    
                    
                </div>
                
                
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);