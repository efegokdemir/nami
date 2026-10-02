# Upgrading saved v0.2 configurations

This is a configuration migration, not a drop-in replacement of Liquid files. Keep the installed v0.2 theme and its exported ZIP unchanged. Work in a separate unpublished copy of v0.3. Do not replace merchant JSON with the new distribution defaults.

The schema comparison uses v0.2 commit `41c301c8f10850dfb35dfe375d0eab81716018a9`. No existing section files, global setting IDs or global theme-block types were removed. App area's former explicit theme-block list becomes `@theme`: saved heading/text/button/image/statistic/quote/group blocks and nested group content remain supported without renaming. Legacy Product/Featured Product configurations with only Information/app blocks retain core purchase controls.

## Exact changes

| Saved setting/layout | Resolution |
| --- | --- |
| `image-with-text.reverse` | Converted to `media_position`: true → right, false → left. An explicitly supplied new setting wins. |
| `product-carousel.limit` | Converted to `products_to_show`; an explicitly supplied new count wins. |
| `comparison-table` `column` blocks: `name`, `row_one_value`, `row_two_value`, `row_three_value`; section `row_one`, `row_two`, `row_three` | Transposed into three `row` blocks with `label` and `value_1`–`value_4`. Saved block order determines column order. Names become `column_1`–`column_4`; missing old row labels use the actual v0.2 defaults. A one-column table gets an empty second column because the existing v0.3 control requires two. Mixed/custom comparison blocks require manual migration. |
| `hero-banner.text`, `collection-grid.text`, collection block `description`, bento tile `text`, timeline step `text` | Plain text converted to escaped paragraph HTML with preserved line breaks. Already paragraph/list/heading HTML is retained. Review unusual HTML-looking plain text manually. |
| `features` feature block `icon`: free text → select | Existing supported icon names survive. Unsupported values (including numeric/custom names) reset to the declared default and are archived for review; select an existing icon or use the existing custom image field. |
| Section `eyebrow` removed from collection-grid, faq, featured-collection, featured-product, features, multi-column, newsletter | Archived, not rendered automatically. Re-enter desired copy in an existing heading/text/content field, or omit it. No legacy merchant controls added. |
| Collection block `eyebrow`, `icon`; multi-column column `number` | Archived. Re-enter meaningful copy in existing title/description/content; old numeric decorations are not restored. |
| `featured-product.button_label` | Archived. The native buy button uses the translated Add to cart label; manually transfer contextual copy into an existing text/Custom Liquid block if needed. |
| Bundled v0.2 `config/settings_data.json` uses `current.settings` nesting | Flattened to `current`; explicit top-level values win. Same normalization applies to object presets. Missing scheme-1–scheme-4 records are filled from the current distribution; merchant-owned schemes win. |

Global fonts, logo, page width, radius, motion and social IDs remain compatible. Unsaved defaults can differ; exact pixel-equivalent v0.2 layout is not promised. Merchant/custom-code edits are not automatically ported.

## Procedure

1. Export the installed v0.2 configuration: `config/settings_data.json`, every JSON template (including alternate templates), and JSON section groups. Preserve resource references and app blocks. Save the original files outside the working copy.
2. From the v0.3 repository run this for **each** exported JSON document, with distinct input/output paths and a new review file:

   ```sh
   node scripts/migrate-v02.cjs /absolute/backup/templates/index.json /absolute/staging/templates/index.json 2>/absolute/staging/index-migration-review.json
   ```

   The destination must not exist. The tool does not edit the source or contact Shopify. It preserves section/block IDs except transposed comparison rows. It handles templates, section groups, static sections in settings data and saved object presets. Unknown settings/blocks stop migration rather than silently discarding customizations. Run it again only into a fresh destination; supported conversions are idempotent.
3. Read every review report. Manually reconcile archived removed fields using the exact table above. For unknown customizations or a failed conversion, keep the backup, port to supported fields/block types, and rerun. Do not upload a partially migrated file set.
4. Put reviewed output at the corresponding paths in the separate v0.3 staging copy. Validate with `node scripts/validate-theme.cjs`, `node scripts/test-hardening.cjs`, `node scripts/test-upgrade.cjs`, both asset syntax checks and Shopify Theme Check. Keep the v0.3 schema/assets/Liquid; do not copy v0.2 implementation files over them.
5. Strict-upload **only to an unpublished copy**, inspect homepage/alternate templates, collection, PDP, variant selection, cart and Theme Editor, and verify merchant resources/apps still resolve. Publish only after merchant approval. Roll back by republishing the untouched old theme, not retagging a release.

The final-blocker pass tested the actual released v0.2 homepage, all 14 saved JSON documents locally, plus ordered comparison and nested reusable-block configurations in unpublished Shopify QA. This does not prove compatibility with arbitrary merchant forks or third-party app internals.
