import {svg} from 'lit';

// Inline SVG flags (emoji flags don't render on Windows). Each uses its real
// proportions with `slice`, so it fills a round/square frame without bars.
const frame = (viewBox, content) => svg`
    <svg viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${content}</svg>`;

export const FLAGS = {
    // United Kingdom
    en: frame('0 0 60 30', svg`
        <clipPath id="flag-en-diag"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#flag-en-diag)" stroke="#C8102E" stroke-width="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>`),
    fr: frame('0 0 3 2', svg`
        <rect width="1" height="2" fill="#002654"/>
        <rect x="1" width="1" height="2" fill="#fff"/>
        <rect x="2" width="1" height="2" fill="#CE1126"/>`),
    de: frame('0 0 5 3', svg`
        <rect width="5" height="1" fill="#000"/>
        <rect y="1" width="5" height="1" fill="#DD0000"/>
        <rect y="2" width="5" height="1" fill="#FFCE00"/>`),
    it: frame('0 0 3 2', svg`
        <rect width="1" height="2" fill="#009246"/>
        <rect x="1" width="1" height="2" fill="#fff"/>
        <rect x="2" width="1" height="2" fill="#CE2B37"/>`),
};
