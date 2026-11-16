// drawerComponent.styles.js
import { css } from 'lit';

export const drawerComponentStyles = css`

    :host {
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: var(--hgps-surface);
    }

    .drawer {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .drawer-header {
        display: flex;
        flex-direction: row;
    }

    .drawer-content{
        height: 100%;
    }
`;
