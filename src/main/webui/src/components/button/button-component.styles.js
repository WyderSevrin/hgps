// button-component.styles.js
import { css } from 'lit';

export const buttonComponentStyles = css`

    * {
        width: 100%;
    }

    .material-icons {
        font-size: 24px; /* Taille par défaut de l'icône */
        vertical-align: middle;
    }

    button {
        background: var(--hgps-surface-3);
        color: var(--hgps-text);
        border: none;
        padding: 10px;
        font-family: inherit; /* buttons don't inherit the app font by default */
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center; /* Aligner l'icône et le texte proprement */
        gap: 8px; /* Espacement entre l'icône et le texte */
        box-sizing: border-box;
        white-space: nowrap; /* avoid label wrapping while the sidebar resizes */
        overflow: hidden;
    }

    button.icon-only {
        justify-content: center; /* center the lone icon when the label is hidden */
        gap: 0;
    }

    button.active {
        background-color: var(--hgps-accent); /* Couleur spécifique pour la page active */
        color: var(--hgps-accent-contrast);
        font-weight: bold;
    }

    button:hover {
        background-color: var(--hgps-surface-hover);
    }

    button.active:hover {
        background-color: var(--hgps-accent-hover);
    }

    .icon {
        font-size: 18px; /* Taille par défaut de l'icône */
    }

`;
