export function createFontFaceCss(assetBase: string): string {
  return `
    @font-face { font-family: "Montserrat"; font-style: normal; font-weight: 300 700; font-display: swap; src: url("${assetBase}concert-fonts/02.woff2") format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
    @font-face { font-family: "Montserrat"; font-style: normal; font-weight: 300 700; font-display: swap; src: url("${assetBase}concert-fonts/05.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191-2193, U+2212, U+2215; }
    @font-face { font-family: "Tenor Sans"; font-style: normal; font-weight: 400; font-display: swap; src: url("${assetBase}concert-fonts/06.woff2") format("woff2"); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
    @font-face { font-family: "Tenor Sans"; font-style: normal; font-weight: 400; font-display: swap; src: url("${assetBase}concert-fonts/08.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191-2193, U+2212, U+2215; }
  `;
}
