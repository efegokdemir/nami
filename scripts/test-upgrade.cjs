const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const root = require('node:path').resolve(__dirname, '..');
const base = '41c301c8f10850dfb35dfe375d0eab81716018a9';
const input = JSON.parse(execFileSync('git', ['show', `${base}:templates/index.json`], { cwd: root, encoding: 'utf8' }));
input.sections.story.settings.reverse = true;
input.sections.compare = { type: 'comparison-table', settings: { heading: 'Compare', feature_label: 'Features', row_one: 'Material', row_two: 'Care', row_three: 'Warranty' }, blocks: { a: { type: 'column', settings: { name: 'A', row_one_value: 'Cotton', row_two_value: 'Wash', row_three_value: 'One year' } }, b: { type: 'column', settings: { name: 'B', row_one_value: 'Wool', row_two_value: 'Dry clean', row_three_value: 'Two years' } } }, block_order: ['b', 'a'] };
input.order.push('compare');
const original = JSON.stringify(input);
const result = fs.existsSync(require('node:path').join(__dirname, 'migrate-v02.cjs')) ? require('./migrate-v02.cjs').migrate(input) : { data: input, review: [] };
assert.equal(result.data.sections.carousel.settings.products_to_show, 5, 'saved v0.2 carousel count survives');
assert.equal(result.data.sections.story.settings.media_position, 'right');
assert.equal(result.data.sections.hero.settings.text, '<p>Thoughtful objects, considered materials and room to make them yours.</p>');
assert.equal(result.data.sections.compare.settings.column_1, 'B');
assert.equal(result.data.sections.compare.blocks.legacy_row_1.settings.value_1, 'Wool');
assert.equal(result.data.sections.compare.blocks.legacy_row_1.settings.value_2, 'Cotton');
assert.equal(result.data.sections.compare.blocks.legacy_row_3.settings.label, 'Warranty');
assert.equal(JSON.stringify(input), original, 'migration never edits its input');
assert(result.review.some(item => item.setting === 'eyebrow' && item.value === 'Find your starting point'));
assert.deepEqual(require('./migrate-v02.cjs').migrate(result.data).data, result.data, 'migration is idempotent');
const escaped = require('./migrate-v02.cjs').migrate({ sections: { x: { type: 'hero-banner', settings: { text: 'A & <B>\nNext' } } } });
assert.equal(escaped.data.sections.x.settings.text, '<p>A &amp; &lt;B&gt;<br>Next</p>');
console.log('PASS actual v0.2 homepage, count/position aliases, ordered comparison transpose, review archive, text escaping, non-mutation and idempotence');
const saved = JSON.parse(execFileSync('git', ['show', `${base}:config/settings_data.json`], { cwd: root, encoding: 'utf8' }));
const migrated = require('./migrate-v02.cjs').migrate(saved).data;
assert.equal(migrated.current.section_spacing, 72, 'legacy nested global settings are flattened');
assert(migrated.current.color_schemes['scheme-2'], 'v0.2 scheme references resolve in Theme Editor');
assert.equal(migrated.current.settings, undefined);
assert.throws(() => require('./migrate-v02.cjs').migrate({ sections: { x: { type: 'hero-banner', settings: { custom_unknown: 'keep' } } } }), /unrecognized setting/);
console.log('PASS actual v0.2 global settings and fail-safe unknown customization');
const documents = execFileSync('git', ['ls-tree', '-r', '--name-only', base], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(file => /^(templates|sections)\/.*\.json$|^config\/settings_data.json$/.test(file));
for (const file of documents) {
  const saved = JSON.parse(execFileSync('git', ['show', `${base}:${file}`], { cwd: root, encoding: 'utf8' }));
  const converted = require('./migrate-v02.cjs').migrate(saved).data;
  assert.deepEqual(require('./migrate-v02.cjs').migrate(converted).data, converted, `${file}: repeated upgrade is safe`);
  for (const section of Object.values(converted.sections || {})) {
    const schema = JSON.parse(fs.readFileSync(`${root}/sections/${section.type}.liquid`, 'utf8').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
    for (const key of Object.keys(section.settings || {})) assert(schema.settings?.some(item => item.id === key), `${file}/${section.type}/${key}: migrated setting exists`);
  }
}
console.log(`PASS all ${documents.length} actual v0.2 saved JSON documents`);
