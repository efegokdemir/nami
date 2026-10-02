const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
let checked = 0;
const fail = message => { throw new Error(message); };
const unique = (values, label) => {
  if (new Set(values).size !== values.length) fail(`Duplicate ${label}`);
};
const settings = (items, label) => unique((items || []).filter(item => item.id).map(item => item.id), `${label} setting id`);
for (const dir of ['config', 'locales', 'templates', 'sections', 'blocks']) {
  for (const file of fs.readdirSync(path.join(root, dir))) {
    const absolute = path.join(root, dir, file);
    if (!fs.statSync(absolute).isFile()) continue;
    const text = fs.readFileSync(absolute, 'utf8');
    if (file.endsWith('.json')) {
      const data = JSON.parse(text);
      if (dir === 'templates' || (dir === 'sections' && data.sections)) {
        const sections = data.sections || {};
        unique(data.order || [], `${file} section order`);
        for (const id of data.order || []) if (!sections[id]) fail(`${file}: missing ordered section ${id}`);
        for (const section of Object.values(sections)) {
          if (!fs.existsSync(path.join(root, 'sections', `${section.type}.liquid`))) fail(`${file}: unknown section ${section.type}`);
          for (const id of section.block_order || []) if (!section.blocks?.[id]) fail(`${file}: missing ordered block ${id}`);
        }
      }
      checked++;
    } else if (file.endsWith('.liquid') && ['sections', 'blocks'].includes(dir)) {
      const match = text.match(/{% schema %}([\s\S]*?){% endschema %}/);
      if (!match) fail(`${file}: missing schema`);
      const schema = JSON.parse(match[1]);
      settings(schema.settings, file);
      unique((schema.blocks || []).map(block => block.type), `${file} block type`);
      for (const block of schema.blocks || []) settings(block.settings, `${file}/${block.type}`);
      checked++;
    }
  }
}
console.log(`Validated ${checked} JSON documents and section/block schemas.`);
