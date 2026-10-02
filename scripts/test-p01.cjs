const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = f => fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const schema = name => JSON.parse(read(`sections/${name}.liquid`).split('{% schema %}')[1].split('{% endschema %}')[0]);
const field = (name,id) => schema(name).settings.find(s => s.id === id);
assert.match(read('snippets/section-style.liquid'),/--section-padding-top:{{ top }}/);
assert.doesNotMatch(read('snippets/section-style.liquid'),/padding-top:{{ top }}px/);
assert.match(read('snippets/section-style.liquid'),/--section-stack-top:{{ top }}/,'custom padding must remain exact even in a section stack');
assert.match(read('assets/nami-capabilities.css'),/merch-grid:not\(\.merch-grid--carousel\):has\(> :only-child\) \{ max-width:420px/,'sparse one-product grids must not create a full-width giant card');
assert.equal(field('featured-collection','mobile_columns').default,'2');
assert.equal(field('featured-product','gallery_layout').default,'thumbnails');
assert.equal(schema('header').class,'nami-header-section');
assert.equal(schema('split-hero').presets,undefined);
for (const [name,type] of Object.entries({'main-article':'article','main-blog':'blog','main-cart':'cart','main-404':'404','main-product':'product','main-search':'search'})) assert.deepEqual(schema(name).enabled_on.templates,[type]);
for (const name of ['hero-banner','split-hero']) assert.match(read(`sections/${name}.liquid`),/render 'hero'/);
for (const name of ['main-search','main-blog']) assert.match(read(`sections/${name}.liquid`),/paginate .* by 24/);
for (const id of ['column_3','column_4']) assert.ok(field('comparison-table',id).visible_if);
assert.match(read('sections/contact-form.liquid'),/append: section.id/);
assert.doesNotMatch(read('sections/contact-form.liquid'),/id="Contact(?:Name|Email|Message)"/);
const card = read('snippets/product-card.liquid');
assert.ok(card.indexOf('card-quick-add') < card.indexOf('product-card__content'),'actions belong in the media frame, not the permanent content stack');
assert.match(card,/value.swatch/);
assert.match(read('assets/nami-capabilities.css'),/filter-popover\[open\] \.filter-popover__panel \{ align-content:start/);
assert.match(read('assets/nami-capabilities.css'),/marquee-animated\.is-enhanced:is\(:hover,:focus-within,\.is-paused\).*animation-play-state:paused/,'pause must outrank the enhanced animation shorthand');
console.log('PASS P0/P1 structure, preserved shared rendering, responsive defaults, labels and native pagination contracts');

function motionFixture(reduced) {
  const events = new Map(),classes = new Set(['marquee-animated']);
  const section = {dataset:{},classList:{contains:c=>classes.has(c),add:c=>classes.add(c),toggle(c){if(classes.has(c)){classes.delete(c);return false;}classes.add(c);return true;}},querySelector:()=>button};
  const button = {hidden:true,attributes:{},setAttribute(k,v){this.attributes[k]=v;},matches:s=>s==='[data-marquee-pause]',closest:s=>s==='button'?button:section};
  const document = {documentElement:{classList:{contains:()=>false}},querySelector:()=>null,querySelectorAll:s=>s==='[data-marquee]'?[section]:[],addEventListener(k,cb){events.set(k,cb);}};
  vm.runInNewContext(read('assets/nami-capabilities.js'),{document,window:{},matchMedia:()=>({matches:reduced})});
  events.get('shopify:section:load')({target:document});
  assert.equal(classes.has('is-enhanced'),!reduced);
  assert.equal(button.hidden,reduced);
  if(!reduced){events.get('click')({target:button});assert.equal(button.attributes['aria-pressed'],'true');assert.equal(classes.has('is-paused'),true);events.get('click')({target:button});assert.equal(button.attributes['aria-pressed'],'false');}
}
motionFixture(false);motionFixture(true);
console.log('PASS persistent marquee pause/resume, reduced-motion static initialization and repeated section-load idempotence');

{
  const handlers = new Map(),events = new Map(),classes = new Set(); let bottom = 900;
  const header = {offsetHeight:69,classList:{toggle(c,on){if(on)classes.add(c);else classes.delete(c);}}};
  const hero = {getBoundingClientRect:()=>({bottom})};
  const document = {querySelector:s=>s==='[data-header]'?header:s.startsWith('main >')?hero:null,querySelectorAll:()=>[],addEventListener(k,fn){events.set(k,fn);}};
  const window = {addEventListener(k,fn){assert.equal(handlers.has(k),false,'section reload must not bind another global header listener');handlers.set(k,fn);}};
  vm.runInNewContext(read('assets/nami-capabilities.js'),{document,window});
  for(let i=0;i<3;i++)events.get('shopify:section:load')({target:document});
  assert.equal(handlers.size,2);assert.equal(classes.has('header-solid'),false);
  bottom=-1;handlers.get('scroll')();assert.equal(classes.has('header-solid'),true);
  bottom=900;handlers.get('resize')();assert.equal(classes.has('header-solid'),false);
  console.log('PASS transparent-header scroll state and idempotent editor reload bindings');
}
