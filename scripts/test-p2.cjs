const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const css=read('assets/nami-capabilities.css'),js=read('assets/nami-capabilities.js');
for(const name of ['main-search','main-blog'])assert.match(read(`sections/${name}.liquid`),/paginate .* by 24/);
assert.match(read('sections/bento-grid.liquid'),/assign tile_resource = block.settings.product \| default: block.settings.collection/);
assert.match(read('sections/before-after.liquid'),/image-comparison__labels/);
assert.match(css,/image-comparison__images img[^\n]*object-fit:contain/);
assert.match(read('sections/main-cart.liquid'),/name="updates\[\]"/);
for(const name of ['checkout','update'])assert.match(read('sections/main-cart.liquid'),new RegExp(`name="${name}"`));
assert.match(read('sections/main-search.liquid'),/render 'product-card'/);
assert.match(read('sections/lookbook.liquid'),/render 'product-card'/);
assert.match(read('sections/main-blog.liquid'),/journal-card__media/);
assert.match(css,/journal-grid:has\(> \.journal-card > \.eyebrow:first-child\)/);
assert.ok(!css.includes(':has(.journal-card:not(:has('),'Editorial grid selectors must not nest :has(), which browsers reject');
assert.match(css,/cart-page-layout[^\n]*1\.7fr[^\n]*1fr/);
assert.match(css,/cart-page \.cart-line img[^\n]*aspect-ratio:4\/5/);
assert.match(css,/cart-page \.cart-line dl[^\n]*grid-template-columns:minmax\(0,1fr\)/);
assert.match(css,/cart-page \.cart-line:has\(> span\[aria-hidden\]\) \{ grid-template-columns:minmax\(0,1fr\); \}/);
assert.match(css,/cart-page \.cart-line:has\(> span\[aria-hidden\]\) \.cart-line__price \{ grid-column:1; \}/);
assert.match(css,/directory-card__media--product img[^\n]*object-fit:contain/);
for(const name of ['main-search','main-blog']) assert.ok(read(`sections/${name}.liquid`).includes('replace: "</p>", " "'),'Rich-text excerpts must retain paragraph word boundaries');
assert.match(read('sections/main-list-collections.liquid'),/collection.image \| default: collection.products.first.featured_image/);
assert.match(read('sections/press-mentions.liquid'),/<article class="press-item"/);
assert.match(read('sections/main-article.liquid'),/article-body rte/);
assert.match(css,/image-text__media\.ratio-natural > img[^\n]*max-height:560px;\s*object-fit:contain/);
assert.match(css,/bento-tile--overlay :is\(\.eyebrow,\.price\)[^\n]*color:inherit/);
assert.match(css,/capability-bento:has\(> :only-child\) \.bento-tile__media[^\n]*aspect-ratio:16\/9/);
const bentoSchema=JSON.parse(read('sections/bento-grid.liquid').split('{% schema %}')[1].split('{% endschema %}')[0]);
assert.match(bentoSchema.blocks[0].settings.find(s=>s.id==='size').visible_if,/block\.settings\.(image|product|collection)/);
console.log('PASS P2 presentation contracts, shared commerce rendering and preserved native pagination/form submissions');

const helpers=js.slice(js.indexOf('  const placeHotspotPanel'),js.indexOf('  let hotspotScrollBound'));
for(const width of [320,375,390,430,768,1024,1440])for(const [x,y]of [[0,0],[width-44,0],[0,856],[width-44,856]]){
 const props={},panel={offsetWidth:Math.min(240,width-24),offsetHeight:320};
 const details={open:true,querySelector:()=>panel,getBoundingClientRect:()=>({left:x,top:y,bottom:y+44}),style:{setProperty(k,v){props[k]=parseFloat(v);}}};
 vm.runInNewContext(`${helpers}\nplaceHotspotPanel(details);`,{$:(s,r)=>r.querySelector(s),$$:()=>[],details,document:{documentElement:{clientWidth:width}},innerHeight:900});
 assert.ok(x+props['--hotspot-offset']>=12);assert.ok(x+props['--hotspot-offset']+panel.offsetWidth<=width-12);
 assert.ok(y+props['--hotspot-top']>=12);assert.ok(y+props['--hotspot-top']+panel.offsetHeight<=888);
}
console.log('PASS hotspot popup containment calculations at all four viewport edges across seven widths');

{
 const markers=Array.from({length:3},()=>({open:false,style:{left:'50%',top:'50%',setProperty(k,v){this[k]=parseFloat(v);}}}));
 const image={getBoundingClientRect:()=>({width:350,height:350})};
 vm.runInNewContext(`${helpers}\nseparateHotspots();`,{$:()=>null,$$:(s,r)=>s==='.shoppable-image'?[image]:markers,document:{}});
 const positions=markers.map(x=>({x:175+x.style['--marker-shift-x'],y:175+x.style['--marker-shift-y']}));
 for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++)assert.ok(Math.hypot(positions[i].x-positions[j].x,positions[i].y-positions[j].y)>=44);
}
console.log('PASS coincident hotspot markers separate without changing saved percentage settings');
