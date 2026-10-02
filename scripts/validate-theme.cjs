const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
let checked = 0;
const fail = message => { throw new Error(message); };
const unique = (values, label) => {
  if (new Set(values).size !== values.length) fail(`Duplicate ${label}`);
};
const value = (item, supplied, label) => {
  if (['select', 'radio'].includes(item.type) && !(item.options || []).some(option => option.value === supplied)) fail(`${label}: invalid option ${supplied}`);
  if (item.type === 'range' && (typeof supplied !== 'number' || supplied < item.min || supplied > item.max || Math.abs((supplied - item.min) / (item.step || 1) - Math.round((supplied - item.min) / (item.step || 1))) > 0.00001)) fail(`${label}: invalid range value ${supplied}`);
};
const settings = (items, label) => {
  unique((items || []).filter(item => item.id).map(item => item.id), `${label} setting id`);
  for (const item of items || []) if (item.default !== undefined) value(item, item.default, `${label}/${item.id}`);
};
const suppliedSettings = (supplied, declared, label) => {
  for (const [id, suppliedValue] of Object.entries(supplied || {})) {
    const item = (declared || []).find(setting => setting.id === id);
    if (!item) fail(`${label}: unknown setting ${id}`);
    value(item, suppliedValue, `${label}/${id}`);
  }
};
for (const dir of ['config', 'locales', 'templates', 'sections', 'blocks']) {
  for (const file of fs.readdirSync(path.join(root, dir))) {
    const absolute = path.join(root, dir, file);
    if (!fs.statSync(absolute).isFile()) continue;
    const text = fs.readFileSync(absolute, 'utf8');
    if (file.endsWith('.json')) {
      const data = JSON.parse(text);
      if (file === 'settings_schema.json') for (const group of data) settings(group.settings, group.name);
      if (dir === 'templates' || (dir === 'sections' && data.sections)) {
        const sections = data.sections || {};
        unique(data.order || [], `${file} section order`);
        for (const id of data.order || []) if (!sections[id]) fail(`${file}: missing ordered section ${id}`);
        for (const section of Object.values(sections)) {
          if (!fs.existsSync(path.join(root, 'sections', `${section.type}.liquid`))) fail(`${file}: unknown section ${section.type}`);
          const sectionSource = fs.readFileSync(path.join(root, 'sections', `${section.type}.liquid`), 'utf8');
          const schema = JSON.parse(sectionSource.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
          suppliedSettings(section.settings, schema.settings, `${file}/${section.type}`);
          unique(section.block_order || [], `${file}/${section.type} block order`);
          for (const id of section.block_order || []) if (!section.blocks?.[id]) fail(`${file}: missing ordered block ${id}`);
          for (const block of Object.values(section.blocks || {})) {
            const declared = (schema.blocks || []).find(item => item.type === block.type);
            if (!declared && !(schema.blocks || []).some(item => item.type === '@theme' || item.type === '@app' && block.type.startsWith('shopify://apps/'))) fail(`${file}: unknown block ${block.type}`);
            if (declared?.settings) suppliedSettings(block.settings, declared.settings, `${file}/${block.type}`);
          }
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
      for (const preset of schema.presets || []) {
        suppliedSettings(preset.settings, schema.settings, `${file}/${preset.name}`);
        for (const block of Array.isArray(preset.blocks) ? preset.blocks : Object.values(preset.blocks || {})) {
          const declared = (schema.blocks || []).find(item => item.type === block.type);
          if (!declared && !(schema.blocks || []).some(item => item.type === '@theme')) fail(`${file}: unknown preset block ${block.type}`);
          if (declared?.settings) suppliedSettings(block.settings, declared.settings, `${file}/${block.type}`);
        }
      }
      checked++;
    }
  }
}
console.log(`Validated ${checked} JSON documents and section/block schemas.`);
