// SideBarComponent.styles.js
import { css } from 'lit';

export const sideBarComponentStyles = css`
    aside {
        background-color: var(--hgps-surface);
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 180px;
        transition: width 0.3s ease;
    }

    aside.collapsed {
        width: 64px;
    }

    .aside-container {
        height: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-sizing: border-box;
    }

    /* The toggle sits apart from the navigation buttons. */
    .toggle {
        margin-bottom: 6px;
    }
`;
