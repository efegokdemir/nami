(() => {
  const $ = (selector, root = document) => root?.querySelector(selector);
  const $$ = (selector, root = document) => [...(root?.querySelectorAll(selector) || [])];
  const routes = window.Shopify?.routes?.root || '/';
  const money = cents => (window.namiMoneyFormat || '${{amount}}').replace(/<[^>]*>/g, '').replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token) => {
    const parts = (Number(cents || 0) / 100).toFixed(token.includes('no_decimals') ? 0 : 2).split('.');
    const comma = token.includes('comma_separator'), separator = token.includes('space_separator') ? ' ' : comma ? '.' : ',';
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator) + (parts[1] ? (comma ? ',' : '.') + parts[1] : '');
  });
  const updateVariant = section => {
    const data = JSON.parse($('[data-product-json]', section)?.textContent || '{}');
    const values = $$('[data-product-option]', section).map(select => select.value);
    const variant = values.length ? data.variants?.find(item => item.options.every((option,index) => option === values[index])) : data.variants?.[0];
    $$('[data-variant-id]', section).forEach(input => { input.value = variant?.id || ''; });
    $$('[data-product-price]', section).forEach(price => {
      price.replaceChildren(document.createTextNode(variant ? money(variant.price) : 'Unavailable'));
      if (variant?.compare_at_price > variant?.price) { const del = document.createElement('del'); del.textContent = money(variant.compare_at_price); price.append(del); }
    });
    $$('[data-add-to-cart-button],[data-sticky-submit]',section).forEach(button => { button.disabled = !variant?.available; button.textContent = variant ? (variant.available ? window.namiAddLabel || 'Add to cart' : window.namiSoldOutLabel || 'Sold out') : 'Unavailable'; });
    $$('[data-option-buttons]',section).forEach(group => { const value = values[Number(group.dataset.optionButtons)]; $$('[data-option-value]',group).forEach(button => button.setAttribute('aria-pressed',String(button.dataset.optionValue === value))); });
    $$('[data-product-sku]',section).forEach(node => { node.textContent = `SKU: ${variant?.sku || ''}`; });
    $$('[data-product-inventory]',section).forEach(node => { node.textContent = variant?.available ? (node.dataset.showCount === 'true' && variant.inventory_management && variant.inventory_quantity > 0 ? `${variant.inventory_quantity} available` : 'In stock') : window.namiSoldOutLabel || 'Sold out'; });
    if (variant?.featured_media) {
      const media = $(`[data-media-id="${variant.featured_media.id}"]`,section);
      if (media && $('.product-media--carousel,.gallery-thumbnails',section)) media.scrollIntoView({ behavior:'auto',block:'nearest',inline:'start' });
    }
  };
  const updateCarousel = container => {
    const track = $('[data-carousel-track]',container); if (!track) return;
    const prev = $('[data-carousel-prev]',container), next = $('[data-carousel-next]',container);
    if (prev) prev.disabled = track.scrollLeft <= 1;
    if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const activateTab = button => {
    const tabs = button.closest('[data-tabs]'), index = $$('[data-tab-button]',tabs).indexOf(button);
    $$('[data-tab-button]',tabs).forEach(item => { item.setAttribute('aria-selected',String(item === button)); item.tabIndex = item === button ? 0 : -1; });
    $$('[data-tab-panel]',tabs).forEach((panel,i) => { panel.hidden = i !== index; });
  };
  const init = (root = document) => {
    $$('[data-product-section]',root).forEach(section => {
      if (section.dataset.capabilitiesReady) return; section.dataset.capabilitiesReady = 'true';
      $$('[data-option-buttons]',section).forEach(group => { group.hidden = false; const select = $(`[data-option-index="${group.dataset.optionButtons}"]`,section); if (select) select.hidden = true; });
    });
    $$('[data-carousel]',root).forEach(container => {
      const track = $('[data-carousel-track]',container); if (!track || track.dataset.capabilitiesReady) return;
      track.dataset.capabilitiesReady = 'true'; track.addEventListener('scroll',() => updateCarousel(container),{ passive:true });
      new ResizeObserver(() => updateCarousel(container)).observe(track); updateCarousel(container);
    });
    $$('[data-before-after]',root).forEach(container => {
      const input = $('[data-comparison-range]',container); if (!input || input.dataset.capabilitiesReady) return;
      container.classList.add('is-enhanced'); input.dataset.capabilitiesReady = 'true';
      const update = () => container.style.setProperty('--comparison',`${input.value}%`);
      input.addEventListener('input',update); update();
    });
    $$('[data-product-recommendations]',root).forEach(section => {
      if (!section.dataset.productId || section.dataset.capabilitiesReady) return; section.dataset.capabilitiesReady = 'true';
      const url = new URL(`${routes}recommendations/products`,location.origin);
      url.searchParams.set('product_id',section.dataset.productId); url.searchParams.set('section_id',section.dataset.sectionId || 'product-recommendations');
      url.searchParams.set('intent',section.dataset.intent || 'related'); url.searchParams.set('limit',section.dataset.limit || '4');
      fetch(url).then(response => response.ok ? response.text() : Promise.reject()).then(html => {
        const doc = new DOMParser().parseFromString(html,'text/html'),incoming = $('[data-recommendations-grid]',doc);
        if (!incoming?.children.length) { section.hidden = true; return; }
        if (section.dataset.sectionId) { const incomingSection = $('[data-product-recommendations]',doc); section.innerHTML = incomingSection.innerHTML; section.className = incomingSection.className; }
        else $('[data-recommendations-grid]',section).innerHTML = incoming.innerHTML;
        section.hidden = false;
      }).catch(() => { section.hidden = true; });
    });
    $$('[data-recently-viewed]',root).forEach(section => {
      if (section.dataset.capabilitiesReady) return; section.dataset.capabilitiesReady = 'true';
      try {
        const data = JSON.parse($('[data-product-json]')?.textContent || '{}');
        const handles = JSON.parse(localStorage.getItem('nami-recent-products') || '[]').filter(handle => handle !== data.handle).slice(0,4);
        Promise.all(handles.map(handle => fetch(`${routes}products/${encodeURIComponent(handle)}?section_id=product-card-render`).then(response => response.ok ? response.text() : '').catch(() => ''))).then(html => { const grid = $('[data-recently-viewed-grid]',section); if (grid && html.some(Boolean)) { grid.innerHTML = html.join(''); section.hidden = false; } });
      } catch { section.hidden = true; }
    });
  };
  document.addEventListener('click',event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.matches('[data-option-value]')) { const section = button.closest('[data-product-section]'), group = button.closest('[data-option-buttons]'); const select = $(`[data-option-index="${group.dataset.optionButtons}"]`,section); select.value = button.dataset.optionValue; updateVariant(section); }
    if (button.matches('[data-sticky-submit]')) $('[data-product-form] [data-add-to-cart-button]',button.closest('[data-product-section]'))?.click();
    if (button.matches('[data-carousel-prev],[data-carousel-next]')) { const track = $('[data-carousel-track]',button.closest('[data-carousel]')); if (track) track.scrollBy({ left:(button.hasAttribute('data-carousel-prev') ? -1 : 1) * track.clientWidth,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }); }
    if (button.matches('[data-tab-button]')) activateTab(button);
    if (button.matches('[data-quantity-plus],[data-quantity-minus]')) { const input = $('[data-product-quantity]',button.closest('[data-product-section]') || button.closest('form')); if (input) input.value = Math.max(1,Number(input.value || 1) + (button.hasAttribute('data-quantity-plus') ? 1 : -1)); }
    if (button.matches('[data-share-url]')) { const share = {title:button.dataset.shareTitle,url:button.dataset.shareUrl}; const operation = navigator.share ? navigator.share(share) : navigator.clipboard?.writeText(share.url); operation?.catch(() => {}); }
  });
  document.addEventListener('change',event => { if (event.target.matches('[data-product-option]')) updateVariant(event.target.closest('[data-product-section]')); });
  document.addEventListener('toggle',event => {
    const details = event.target; if (!(details instanceof HTMLDetailsElement) || !details.open) return;
    const accordion = details.closest('[data-single-open]'); if (accordion) $$('details',accordion).filter(other => other !== details).forEach(other => { other.open = false; });
    if (details.matches('.product-hotspot')) {
      $$('.product-hotspot',details.parentElement).filter(other => other !== details).forEach(other => { other.open = false; });
      const panel = $('.product-hotspot__panel',details),rect = details.getBoundingClientRect();
      details.style.setProperty('--hotspot-offset',`${Math.max(20 - rect.left,Math.min(0,innerWidth - rect.left - panel.offsetWidth - 20))}px`);
    }
  },true);
  document.addEventListener('keydown',event => {
    if (event.target.matches('[data-tab-button]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      const buttons = $$('[data-tab-button]',event.target.closest('[data-tabs]')),i = buttons.indexOf(event.target);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault(); activateTab(buttons[index]); buttons[index].focus();
    }
    const search = $('[data-predictive-search]');
    if (search && !search.hidden && ['ArrowDown','ArrowUp'].includes(event.key)) {
      const controls = [$('[data-search-input]'),...$$('[data-predictive-results] a')],i = controls.indexOf(document.activeElement);
      if (i >= 0 && controls.length > 1) { event.preventDefault(); controls[(i + (event.key === 'ArrowDown' ? 1 : -1) + controls.length) % controls.length].focus(); }
    }
    if (event.key === 'Escape') $$('.product-hotspot[open],.desktop-nav details[open]').forEach(details => { details.open = false; });
    const filter = $('.filter-popover[open]');
    if (filter && innerWidth < 750) {
      if (event.key === 'Escape') { filter.open = false; $('summary',filter).focus(); }
      if (event.key === 'Tab') { const controls = $$('summary,input:not([disabled]),button',filter).filter(node => node.getClientRects().length); const first = controls[0],last = controls[controls.length-1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault();last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();first?.focus(); } }
    }
  });
  document.addEventListener('shopify:section:load',event => init(event.target));
  document.addEventListener('shopify:block:select',event => { const details = event.target.closest('details'); if (details) details.open = true; });
  init();
})();
