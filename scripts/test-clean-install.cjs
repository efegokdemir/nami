const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = name => fs.readFileSync(`${__dirname}/../${name}`, 'utf8');
const heroSchema = JSON.parse(read('sections/hero-banner.liquid').split('{% schema %}')[1].split('{% endschema %}')[0]);
const heroHeading = heroSchema.settings.find(setting => setting.id === 'heading');
const hero = read('snippets/hero.liquid');
const featuredCollection = read('sections/featured-collection.liquid');

assert.ok(heroHeading, 'Hero heading setting remains available');
assert.equal(heroHeading.default, undefined, 'A new Hero must not inject merchant-facing copy when the merchant has not configured it');
assert.match(hero, /if has_media or section\.settings\.heading != blank or section\.settings\.text != blank or request\.design_mode/, 'An empty Hero is only discoverable in design mode');
assert.match(hero, /if request\.design_mode and has_media == false and section\.settings\.heading == blank and section\.settings\.text == blank %}<p class="editor-help">Add hero content\.<\/p>/, 'Empty Hero guidance stays in Theme Editor');
assert.match(featuredCollection, /if source_products\.size > 0 or section\.blocks\.size > 0 or request\.design_mode/, 'An empty Featured Collection is omitted from the live storefront');
assert.match(featuredCollection, /elsif request\.design_mode %}<p class="editor-help">Select a collection to show products\.<\/p>/, 'Collection setup guidance stays in Theme Editor');

console.log('PASS clean install: empty Hero and Featured Collection stay hidden live; concise setup guidance remains in design mode');
