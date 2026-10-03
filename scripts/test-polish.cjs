const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = name => fs.readFileSync(`${__dirname}/../${name}`, 'utf8');
const js = read('assets/nami-capabilities.js');
const css = read('assets/nami-capabilities.css');
const helpers = js.slice(js.indexOf('  const placeHotspotPanel'), js.indexOf('  let hotspotScrollBound'));
// Mobile opening can temporarily inflate innerHeight. Clamp to the stable layout viewport.
for (const width of [320,390,768,1440]) for (const y of [0,450,856]) {
  const props = {}, panelProps = {};
  const panel = { offsetWidth:240, offsetHeight:331, style:{setProperty(k,v){panelProps[k]=parseFloat(v);}} };
  const details = {open:true, querySelector:()=>panel, getBoundingClientRect:()=>({left:width-44,top:y,bottom:y+44}),style:{setProperty(k,v){props[k]=parseFloat(v);}}};
  vm.runInNewContext(`${helpers}\nplaceHotspotPanel(details);`, {$:(s,r)=>r.querySelector(s),$$:()=>[],details,document:{documentElement:{clientWidth:width,clientHeight:900}},innerHeight:1129});
  assert.ok(panelProps['--panel-left']>=12);
  assert.ok(panelProps['--panel-left']+240<=width-12);
  assert.ok(panelProps['--panel-top']>=12);
  assert.ok(panelProps['--panel-top']+331<=888);
}
assert.match(css,/product-hotspot__panel[^\n]*position:fixed/);
assert.doesNotMatch(css,/\.product-hotspot \{[^\n]*transform:/);
assert.match(js,/controls\.hidden = track\.scrollWidth <= track\.clientWidth/);
assert.match(js,/surface\.addEventListener\('pointerdown'/);
assert.match(css,/bento-tile--product \.bento-tile__media img[^\n]*object-fit:contain/);
assert.match(css,/product-card__title[^\n]*min-height:1\.4em/);
assert.match(css,/@media\(hover:none\), \(pointer:coarse\)/);
assert.match(read('snippets/hero.liquid'),/assign scheme_id = section\.settings\.color_scheme \| append: ''/);
assert.match(css,/auto-contrast:not\(\.capability-hero--empty\) \.capability-hero__content[^\n]*background:none/);
assert.match(read('snippets/product-media.liquid'),/gallery_layout == 'thumbnails' and product\.media\.size > 1/);
const featured = JSON.parse(read('sections/featured-product.liquid').split('{% schema %}')[1].split('{% endschema %}')[0]);
assert.deepEqual(featured.presets[0].blocks.map(b=>b.type),['title','price','variant_picker','quantity','buy_buttons']);
assert.equal(featured.presets[0].blocks.at(-1).settings.dynamic_checkout,false);
console.log('PASS polish: stable viewport hotspot geometry, direct comparison dragging, carousel visibility, purpose-aware media and compact defaults');
