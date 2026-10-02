const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const schema = (directory, type) => JSON.parse(fs.readFileSync(path.join(root, directory, `${type}.liquid`), 'utf8').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const plainRichtext = text => text === '' || /^\s*<(p|ul|ol|h[1-6])(?:\s|>)/i.test(text) ? text : `<p>${String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(/\r?\n/g, '<br>')}</p>`;
function migrate(input) {
  const data = structuredClone(input), review = [];
  function settings(values, declared, location, plainFields = [], removed = []) {
    for (const [id, value] of Object.entries(values)) {
      const field = (declared || []).find(item => item.id === id);
      if (!field) {
        if (!removed.includes(id)) throw new Error(`${location}: unrecognized setting ${id}; no output written, migrate this customization manually`);
        review.push({ location, setting: id, value, action: 'Removed setting: review archived value and re-enter in an existing supported content field if required.' });
        delete values[id];
      } else if (plainFields.includes(id)) values[id] = plainRichtext(value);
      else if (field.options && !field.options.some(option => option.value === value)) {
        review.push({ location, setting: id, value, action: `Unsupported choice: reset to ${field.default || field.options[0].value}; review manually.` });
        values[id] = field.default || field.options[0].value;
      }
    }
  }
  function section(section, location) {
    const type = section.type, current = schema('sections', type), values = section.settings ||= {};
    if (type === 'image-with-text' && Object.hasOwn(values, 'reverse')) {
      values.media_position ??= values.reverse ? 'right' : 'left'; delete values.reverse;
    }
    if (type === 'product-carousel' && Object.hasOwn(values, 'limit')) {
      values.products_to_show ??= values.limit; delete values.limit;
    }
    if (type === 'comparison-table' && Object.values(section.blocks || {}).some(block => block.type === 'column')) {
      const columns = (section.block_order || Object.keys(section.blocks)).map(id => section.blocks[id]);
      if (columns.some(block => block.type !== 'column') || columns.length > 4) throw new Error(`${location}: mixed or oversized comparison requires manual migration`);
      values.columns = Math.max(2, columns.length);
      for (let index = 0; index < 4; index++) values[`column_${index + 1}`] = columns[index]?.settings?.name ?? ' ';
      section.blocks = {}; section.block_order = [];
      for (const [index, key] of ['row_one', 'row_two', 'row_three'].entries()) {
        const id = `legacy_row_${index + 1}`, row = { label: values[key] ?? ['Material', 'Care', 'Warranty'][index] };
        for (let column = 0; column < 4; column++) row[`value_${column + 1}`] = columns[column]?.settings?.[`${key}_value`] ?? '';
        section.blocks[id] = { type: 'row', settings: row }; section.block_order.push(id); delete values[key];
      }
    }
    const removed = ['collection-grid', 'faq', 'featured-collection', 'featured-product', 'features', 'multi-column', 'newsletter'].includes(type) ? ['eyebrow'] : [];
    if (type === 'featured-product') removed.push('button_label');
    if (type === 'comparison-table') removed.push('row_one', 'row_two', 'row_three');
    settings(values, current.settings, location, ['hero-banner', 'collection-grid'].includes(type) ? ['text'] : [], removed);
    function block(block, parent, where) {
      if (block.type.startsWith('shopify://apps/')) return;
      const local = parent.blocks?.find(item => item.type === block.type);
      const declared = local?.settings ? local : parent.blocks?.some(item => item.type === '@theme') ? schema('blocks', block.type) : local;
      if (!declared) throw new Error(`${where}: unknown block ${block.type}; restore from backup and migrate manually`);
      const plain = type === 'bento-grid' && block.type === 'tile' || type === 'timeline' && block.type === 'step' ? ['text'] : type === 'collection-grid' && block.type === 'collection' ? ['description'] : [];
      settings(block.settings ||= {}, declared.settings, where, plain, type === 'collection-grid' && block.type === 'collection' ? ['eyebrow', 'icon'] : type === 'multi-column' && block.type === 'column' ? ['number'] : []);
      for (const [id, child] of Object.entries(block.blocks || {})) blockVisit(child, declared, `${where}/${id}`);
    }
    const blockVisit = block;
    for (const [id, item] of Object.entries(section.blocks || {})) block(item, current, `${location}/${id}`);
  }
  function visit(object, location) {
    if (!object || typeof object !== 'object') return;
    if (object.sections) for (const [id, item] of Object.entries(object.sections)) section(item, `${location}/sections/${id}`);
    if (object.current && typeof object.current === 'object') visit(object.current, `${location}/current`);
    for (const [id, preset] of Object.entries(object.presets || {})) visit(preset, `${location}/presets/${id}`);
  }
  if (data.current || data.presets) {
    const defaultSchemes = JSON.parse(fs.readFileSync(path.join(root, 'config/settings_data.json'), 'utf8')).current.color_schemes;
    for (const saved of [data.current, ...Object.values(data.presets || {})]) {
      if (!saved || typeof saved !== 'object') continue;
      if (saved.settings && typeof saved.settings === 'object') {
        for (const [id, value] of Object.entries(saved.settings)) if (!Object.hasOwn(saved, id)) saved[id] = value;
        delete saved.settings;
      }
      saved.color_schemes = { ...structuredClone(defaultSchemes), ...saved.color_schemes };
    }
  }
  visit(data, 'configuration');
  return { data, review };
}
module.exports = { migrate };
if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output || path.resolve(input) === path.resolve(output)) throw new Error('Usage: node scripts/migrate-v02.cjs OLD.json NEW.json (distinct paths; output must not exist)');
  const result = migrate(JSON.parse(fs.readFileSync(input, 'utf8')));
  fs.writeFileSync(output, `${JSON.stringify(result.data, null, 2)}\n`, { flag: 'wx' });
  console.error(JSON.stringify({ review: result.review }, null, 2));
}
