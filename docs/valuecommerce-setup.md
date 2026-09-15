# ValueCommerce integration plan

## Security rule
Real contract IDs, site IDs, API keys, tokens and raw affiliate tags must not be committed to this public repository.

## Required account-side checks
1. Confirm the 防犯ラボ site is registered and approved in ValueCommerce.
2. Record the site ID in the deployment secret store, not in GitHub source.
3. Search security/home-security programs and request partnership only where terms fit the site.
4. Confirm LinkSwitch availability and whether it is suitable for each page type.
5. Confirm Item API access if product comparison/search is used.

## Runtime policy
- AI may select only internal ad IDs from `data/ads.json`.
- An ad is renderable only when `approved=true`, `active=true`, and a validated destination/tag exists.
- AI never writes or modifies affiliate tags.
- Program terms shown in the ValueCommerce dashboard override public search information.
- Sponsored/advertising disclosure must be visible where required.

## Initial candidates
- Home security lead programs such as SECOM/ALSOK: keep disabled until partnership approval is confirmed in the dashboard.
- Product-oriented programs: use official product/API feeds where available instead of scraping dashboard pages.
