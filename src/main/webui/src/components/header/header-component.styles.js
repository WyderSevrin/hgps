// header-component.styles.js
import { css } from 'lit';

export const headerComponentStyles = css`
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

    .header-control:hover {
        background-color: var(--hgps-header-control-hover);
    }
    .header-control custom-icon {
        font-size: 20px;
    }


    @media (max-width: 520px) {
        header { padding: 6px 12px; }
        .brand { gap: 8px; }
    }
`;
