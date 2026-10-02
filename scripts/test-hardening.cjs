const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const listeners = new Map();
const track = { dataset: {}, scrollLeft: 0, clientWidth: 100, scrollWidth: 200, addEventListener() {} };
const carousel = { querySelector: selector => selector === '[data-carousel-track]' ? track : null };
let disconnected = 0, observed = 0;
const document = {
  body: { dataset: {} },
  querySelector: () => null,
  querySelectorAll: selector => selector === '[data-carousel]' ? [carousel] : [],
  addEventListener(type, callback) { listeners.set(type, [...(listeners.get(type) || []), callback]); },
};
const context = vm.createContext({ document, window: { namiMoneyFormat: '<span>${{amount}}</span>' }, location: { origin: 'https://example.com' }, ResizeObserver: class { observe() { observed++; } disconnect() { disconnected++; } }, URL });
for (const name of ['nami.js', 'nami-capabilities.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets', name), 'utf8'), context);
assert.equal(typeof context.window.namiMoney, 'function', 'commerce components must share one money formatter');
assert.equal(context.window.namiMoney(123456), '$1,234.56');
context.window.namiMoneyFormat = '{{ amount_no_decimals_with_comma_separator }} €';
assert.equal(context.window.namiMoney(123456), '1.235 €');
context.window.namiMoneyFormat = '{{amount_with_space_separator}}';
assert.equal(context.window.namiMoney(123456), '1 234.56');
const root = { contains: node => node === carousel };
for (const callback of listeners.get('shopify:section:load') || []) callback({ target: document });
assert.equal(observed, 1, 'reloading unchanged section must not initialize a carousel twice');
for (const callback of listeners.get('shopify:section:unload') || []) callback({ target: root });
assert.equal(disconnected, 1, 'section unload must disconnect carousel observers');
console.log('PASS: shared money formats and section-unload observer cleanup');

(async () => {
  const handlers = {};
  const changes = [];
  let quantity = 1, lineKey = 'line-key';
  const body = { innerHTML: '' };
  const line = { querySelector: () => ({ previousElementSibling: { textContent: '1' } }) };
  const button = { dataset: { cartPlus: 'line-key' }, closest: selector => selector === '.cart-line' ? line : button };
  const doc = {
    body: { dataset: {} },
    querySelector: selector => selector === '[data-cart-body]' ? body : null,
    querySelectorAll: selector => selector === '[data-cart-drawer]' ? [{}] : [],
    addEventListener(type, callback) { (handlers[type] ||= []).push(callback); },
  };
  const fetch = async (url, options) => {
    if (url.endsWith('change.js')) { const data = JSON.parse(options.body); assert.equal(data.id, lineKey, 'queued changes must resolve a line key replaced by discounts'); quantity = data.quantity; lineKey = `discount-key-${quantity}`; changes.push(quantity); return { ok: true }; }
    return { ok: true, json: async () => ({ item_count: quantity + 1, total_price: quantity * 90 + 100, items: [
      { key: 'full-price', variant_id: 123, quantity: 1, final_price: 100, final_line_price: 100, properties: {} },
      { key: lineKey, variant_id: 123, quantity, final_price: 90, final_line_price: quantity * 90, properties: {}, line_level_discount_allocations: [{ discount_application: { title: 'QA discount' } }] },
    ] }) };
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/nami.js'), 'utf8'), { document: doc, window: {}, fetch });
  await new Promise(resolve => setImmediate(resolve));
  for (const callback of handlers.click) callback({ target: button, preventDefault() {} });
  for (const callback of handlers.click) callback({ target: button, preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(changes, [2, 3], 'rapid cart increments must use the latest serialized quantity');
  console.log('PASS: rapid queued cart increments preserve both clicks');

  let release, requests = 0;
  const pending = new Promise(resolve => { release = resolve; });
  const submit = { disabled: false };
  const variantId = { value: '1' };
  const section = { querySelector: () => ({ textContent: JSON.stringify({ variants: [{ id: 1, available: true }, { id: 2, available: false }] }) }) };
  const form = { dataset: {}, closest: selector => selector === '[data-product-section]' ? section : form, querySelector: selector => selector === '[type=submit]' ? submit : variantId };
  const submitHandlers = [];
  const formDoc = { body: { dataset: { cartType: 'page' } }, querySelector: () => null, querySelectorAll: () => [], addEventListener: (type, callback) => { if (type === 'submit') submitHandlers.push(callback); } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/nami.js'), 'utf8'), { document: formDoc, window: {}, FormData: class {}, location: { assign() {} }, fetch: async () => { requests++; await pending; return { ok: true }; } });
  submitHandlers[0]({ target: form, preventDefault() {} });
  submitHandlers[0]({ target: form, preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests, 1, 'pending add must not initialize a second request');
  variantId.value = '2'; release();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(submit.disabled, true, 'completing an add must not enable a newly selected sold-out variant');
  assert.equal(form.dataset.submitting, undefined);
  console.log('PASS: duplicate submit prevention and sold-out state after pending add');
  submit.disabled = false; variantId.value = undefined;
  submitHandlers[0]({ target: form, preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(submit.disabled, false, 'a complementary Quick Add must not inherit parent variant availability');
  console.log('PASS: complementary Quick Add remains reusable');
})().catch(error => { console.error(error); process.exitCode = 1; });
