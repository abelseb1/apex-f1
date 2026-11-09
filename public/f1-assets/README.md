# F1 Asset Slots

This folder is reserved for licensed Formula 1, team, driver, and car assets.

Do not place files scraped from Formula1.com here unless you have permission to use them.

The `drivers/` folder contains card crops from the local driver-grid image supplied by the project owner. The `cars/` folder contains clear standalone team car cutouts supplied by the project owner. The app still keeps generated fallbacks in `components/F1Visuals.tsx`, so future licensed assets can be swapped in without changing page layouts.

## Supplemental portrait sources

At the owner's request, the three small supplemental images were replaced with the original-resolution versions of the same photographs, retrieved November 9, 2026. Rights remain with their respective owners; availability on these public pages is not a redistribution license.

- `rafael_camara-portrait.webp` (1336 x 3840): https://www.formula1.com/en/drivers/rafael-camara
- `ryo_hirakawa-portrait.webp` (600 x 1056): https://www.formula1.com/en/results/2026/drivers/RYOHIR01/ryo-hirakawa
- `yuki_tsunoda-portrait.webp` (1336 x 3840): https://www.formula1.com/en/results/2026/drivers/YUKTSU01/yuki-tsunoda
- `card-texture.webp`: the DRS bitmap texture served by the official drivers page.
- `flags/br.png` and `flags/jp.png`: https://flagcdn.com/.

Rafael's number 51, Brazilian nationality, and birth date are sourced from his official Formula 1 profile; these fill missing provider fields without replacing race results.
