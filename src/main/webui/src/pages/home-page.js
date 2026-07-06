// home-page.js
import { LitElement, html, css } from 'lit';

export class HomePage extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 10px;
        }

        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        @import url('../../node_modules/@material-icons/font/css/all.css');

        custom-icon{
            height: 30px;
            width: 30px;
            background-color: var(--hgps-surface-2);
        }
    `;


    render() {
        return html`<h1>Welcome to the Home Page</h1>

        <custom-icon label="home"></custom-icon>



        `;
    }
}

customElements.define('home-page', HomePage);