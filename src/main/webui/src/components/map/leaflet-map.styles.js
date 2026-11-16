// leaflet-map.styles.js
import { css } from 'lit';

export const leafletMapStyles = css`
    :host {
        display: block;
        height: 200px;
    }

    .vertex-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--hgps-map-marker);
        color: var(--hgps-text-strong);
        border: 2px solid var(--hgps-text-strong);
        border-radius: 50%;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 1px 4px var(--hgps-shadow-soft);
    }
`;
