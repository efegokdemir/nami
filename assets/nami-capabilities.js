(() => {
  const $ = (selector, root = document) => root?.querySelector(selector);
  const $$ = (selector, root = document) => [...(root?.querySelectorAll(selector) || [])];
  const routes = window.Shopify?.routes?.root || '/';
  const money = cents => window.namiMoney(cents);
  const observers = new Map();
  const requests = new Map();
  const placeHotspotPanel = details => {
    const panel = $('.product-hotspot__panel',details); if (!panel || !details.open) return;
    const rect = details.getBoundingClientRect(),edge = 12;
    const viewportHeight = document.documentElement.clientHeight || innerHeight;
    const header = document.querySelector?.('[data-header]');
    const topEdge = Math.max(edge,(header?.getBoundingClientRect?.().bottom || 0)+edge);
    panel.style?.setProperty('--panel-max-height',`${Math.max(44,viewportHeight-topEdge-edge)}px`);
    const left = Math.max(edge,Math.min(rect.left,document.documentElement.clientWidth-panel.offsetWidth-edge));
    const top = Math.max(topEdge,Math.min(rect.bottom+8,viewportHeight-panel.offsetHeight-edge));
    panel.style?.setProperty('--panel-left',`${left}px`);
    panel.style?.setProperty('--panel-top',`${top}px`);
    details.style.setProperty('--hotspot-offset',`${left-rect.left}px`);
    details.style.setProperty('--hotspot-top',`${top-rect.top}px`);
  };
  const separateHotspots = (root = document) => {
    $$('.shoppable-image',root).forEach(image => {
      const box = image.getBoundingClientRect(); if (!box.width || !box.height) return;
      const placed = [];
      $$('.product-hotspot',image).forEach(details => {
        const originalX = parseFloat(details.style.left)*box.width/100,originalY = parseFloat(details.style.top)*box.height/100;
        let x = Math.max(22,Math.min(box.width-22,originalX)),y = Math.max(22,Math.min(box.height-22,originalY));
        for(let i=0;i<placed.length+1 && placed.some(p=>Math.hypot(p.x-x,p.y-y)<44);i++) {
          y = originalY+44*(i+1) <= box.height-22 ? originalY+44*(i+1) : Math.max(22,originalY-44*(i+1));
          if(placed.some(p=>Math.hypot(p.x-x,p.y-y)<44)) x = Math.max(22,Math.min(box.width-22,originalX+44*(i+1)));
        }
        placed.push({x,y}); details.style.setProperty('--marker-shift-x',`${x-originalX}px`); details.style.setProperty('--marker-shift-y',`${y-originalY}px`); placeHotspotPanel(details);
      });
    });
  };
  let hotspotScrollBound = false;
  let headerScrollBound = false;
  const syncHeader = () => {
    const header = $('[data-header]'),hero = $('main > .shopify-section:first-child .capability-hero:not(.capability-hero--empty)');
    if (header) header.classList.toggle('header-solid',!hero || hero.getBoundingClientRect().bottom <= header.offsetHeight);
  };
  const updateVariant = section => {
    const data = JSON.parse($('[data-product-json]', section)?.textContent || '{}');
    const values = $$('[data-product-option]', section).map(select => select.value);
    const variant = values.length ? data.variants?.find(item => item.options.every((option,index) => option === values[index])) : data.variants?.[0];
    $$('[data-variant-id]', section).forEach(input => { input.value = variant?.id || ''; });
    $$('[data-product-price]', section).forEach(price => {
      price.replaceChildren(document.createTextNode(variant ? money(variant.price) : 'Unavailable'));
      if (variant?.compare_at_price > variant?.price) { const del = document.createElement('del'); del.textContent = money(variant.compare_at_price); price.append(del); }
    });
    $$('[data-add-to-cart-button],[data-sticky-submit]',section).forEach(button => { button.disabled = !variant?.available || Boolean(button.closest('form')?.dataset.submitting); button.textContent = variant ? (variant.available ? window.namiAddLabel || 'Add to cart' : window.namiSoldOutLabel || 'Sold out') : 'Unavailable'; });
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
    const controls = $('.carousel-controls',container);
    if (controls) controls.hidden = track.scrollWidth <= track.clientWidth + 2;
    if (prev) prev.disabled = track.scrollLeft <= 1;
    if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  const activateTab = button => {
    const tabs = button.closest('[data-tabs]'), index = $$('[data-tab-button]',tabs).indexOf(button);
    $$('[data-tab-button]',tabs).forEach(item => { item.setAttribute('aria-selected',String(item === button)); item.tabIndex = item === button ? 0 : -1; });
    $$('[data-tab-panel]',tabs).forEach((panel,i) => { panel.hidden = i !== index; });
  };
  const init = (root = document) => {
    if ($('.shoppable-image') && !hotspotScrollBound) {
      window.addEventListener('resize',() => separateHotspots());
      window.addEventListener('scroll',() => $$('.product-hotspot[open]').forEach(placeHotspotPanel),{passive:true});
      hotspotScrollBound = true;
    }
    separateHotspots(root);
    $$('.shoppable-image > img',root).forEach(image => { if(!image.dataset.hotspotReady) { image.dataset.hotspotReady = 'true'; image.addEventListener('load',() => separateHotspots(image.closest('.shoppable-image').parentElement)); } });
    if ($('[data-header]')) {
      if (!headerScrollBound) { window.addEventListener('scroll',syncHeader,{passive:true}); window.addEventListener('resize',syncHeader); headerScrollBound = true; }
      syncHeader();
    }
    $$('[data-autoplay-video]',root).forEach(container => {
      const video = $('video',container); if (!video || container.dataset.capabilitiesReady) return;
      container.dataset.capabilitiesReady = 'true';
      if (matchMedia('(prefers-reduced-motion:reduce)').matches || document.body?.classList?.contains('motion-minimal')) video.controls = true;
      else video.play().catch(() => { video.controls = true; });
    });
    $$('[data-marquee]',root).forEach(section => {
      if (section.dataset.capabilitiesReady) return;
      section.dataset.capabilitiesReady = 'true';
      if (section.classList.contains('marquee-animated') && !matchMedia('(prefers-reduced-motion:reduce)').matches && !document.body?.classList?.contains('motion-minimal')) {
        section.classList.add('is-enhanced'); const button = $('[data-marquee-pause]',section); if (button) button.hidden = false;
      }
    });
    $$('[data-product-section]',root).forEach(section => {
      if (section.dataset.capabilitiesReady) return; section.dataset.capabilitiesReady = 'true';
      $$('[data-option-buttons]',section).forEach(group => { group.hidden = false; const select = $(`[data-option-index="${group.dataset.optionButtons}"]`,section); if (select) select.hidden = true; });
    });
    $$('[data-carousel]',root).forEach(container => {
      const track = $('[data-carousel-track]',container); if (!track || track.dataset.capabilitiesReady) return;
      track.dataset.capabilitiesReady = 'true'; track.addEventListener('scroll',() => updateCarousel(container),{ passive:true });
      const observer = new ResizeObserver(() => updateCarousel(container));
      observer.observe(track); observers.set(container, observer); updateCarousel(container);
    });
    $$('[data-before-after]',root).forEach(container => {
      const input = $('[data-comparison-range]',container); if (!input || input.dataset.capabilitiesReady) return;
      container.classList.add('is-enhanced'); input.dataset.capabilitiesReady = 'true';
      const update = () => container.style.setProperty('--comparison',`${input.value}%`);
      input.addEventListener('input',update); update();
      const surface = $('.image-comparison__images',container);
      if (surface) {
        const drag = event => {
          const rect = surface.getBoundingClientRect();
          input.value = Math.round(Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)));
          update();
        };
        surface.addEventListener('pointerdown',event => { if (event.button !== 0) return; surface.setPointerCapture(event.pointerId); input.focus({preventScroll:true}); drag(event); });
        surface.addEventListener('pointermove',event => { if (surface.hasPointerCapture(event.pointerId)) drag(event); });
      }
    });
    $$('[data-product-recommendations]',root).forEach(section => {
      if (!section.dataset.productId || section.dataset.capabilitiesReady) return; section.dataset.capabilitiesReady = 'true';
      const url = new URL(`${routes}recommendations/products`,location.origin);
      url.searchParams.set('product_id',section.dataset.productId); url.searchParams.set('section_id',section.dataset.sectionId || 'product-recommendations');
      url.searchParams.set('intent',section.dataset.intent || 'related'); url.searchParams.set('limit',section.dataset.limit || '4');
      const controller = new AbortController(); requests.set(section, controller);
      fetch(url, { signal: controller.signal }).then(response => response.ok ? response.text() : Promise.reject()).then(html => {
        if (!section.isConnected) return;
        const doc = new DOMParser().parseFromString(html,'text/html'),incoming = $('[data-recommendations-grid]',doc);
        if (!incoming?.children.length) { section.hidden = true; return; }
        if (section.dataset.sectionId) { const incomingSection = $('[data-product-recommendations]',doc); section.innerHTML = incomingSection.innerHTML; section.className = incomingSection.className; }
        else $('[data-recommendations-grid]',section).innerHTML = incoming.innerHTML;
        section.hidden = false;
      }).catch(error => { if (error?.name !== 'AbortError') section.hidden = true; }).finally(() => requests.delete(section));
    });
    $$('[data-recently-viewed]',root).forEach(section => {
      if (section.dataset.capabilitiesReady) return; section.dataset.capabilitiesReady = 'true';
      try {
        const data = JSON.parse($('[data-product-json]')?.textContent || '{}');
        const handles = JSON.parse(localStorage.getItem('nami-recent-products') || '[]').filter(handle => handle !== data.handle).slice(0,4);
        const controller = new AbortController(); requests.set(section, controller);
        Promise.all(handles.map(handle => fetch(`${routes}products/${encodeURIComponent(handle)}?section_id=product-card-render`, { signal: controller.signal }).then(response => response.ok ? response.text() : '').catch(() => ''))).then(html => {
          if (!section.isConnected) return;
          const cards = html.map(markup => $('.product-card', new DOMParser().parseFromString(markup, 'text/html'))?.outerHTML || '');
          const grid = $('[data-recently-viewed-grid]',section); if (grid && cards.some(Boolean)) { grid.innerHTML = cards.join(''); section.hidden = false; }
        }).finally(() => requests.delete(section));
      } catch { section.hidden = true; }
    });
  };
  document.addEventListener('click',event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.matches('[data-option-value]')) { const section = button.closest('[data-product-section]'), group = button.closest('[data-option-buttons]'); const select = $(`[data-option-index="${group.dataset.optionButtons}"]`,section); select.value = button.dataset.optionValue; updateVariant(section); }
    if (button.matches('[data-sticky-submit]')) $('[data-product-form] [data-add-to-cart-button]',button.closest('[data-product-section]'))?.click();
    if (button.matches('[data-carousel-prev],[data-carousel-next]')) { const track = $('[data-carousel-track]',button.closest('[data-carousel]')); if (track) track.scrollBy({ left:(button.hasAttribute('data-carousel-prev') ? -1 : 1) * track.clientWidth,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }); }
    if (button.matches('[data-tab-button]')) activateTab(button);
    if (button.matches('[data-marquee-pause]')) {
      const section = button.closest('[data-marquee]'),paused = section.classList.toggle('is-paused');
      button.setAttribute('aria-pressed',String(paused)); button.textContent = paused ? 'Resume animation' : 'Pause animation';
    }
    if (button.matches('[data-quantity-plus],[data-quantity-minus]')) { const input = $('[data-product-quantity]',button.closest('[data-product-section]') || button.closest('form')); if (input) input.value = Math.max(1,Number(input.value || 1) + (button.hasAttribute('data-quantity-plus') ? 1 : -1)); }
    if (button.matches('[data-share-url]')) { const share = {title:button.dataset.shareTitle,url:button.dataset.shareUrl}; const operation = navigator.share ? navigator.share(share) : navigator.clipboard?.writeText(share.url); operation?.catch(() => {}); }
    if (button.matches('[data-hotspot-close]')) { const details = button.closest('.product-hotspot'); details.open = false; $('summary',details)?.focus(); }
  });
  document.addEventListener('change',event => { if (event.target.matches('[data-product-option]')) updateVariant(event.target.closest('[data-product-section]')); });
  document.addEventListener('toggle',event => {
    const details = event.target; if (!(details instanceof HTMLDetailsElement) || !details.open) return;
    const accordion = details.closest('[data-single-open]'); if (accordion) $$('details',accordion).filter(other => other !== details).forEach(other => { other.open = false; });
    if (details.matches('.product-hotspot')) {
      $$('.product-hotspot',details.parentElement).filter(other => other !== details).forEach(other => { other.open = false; });
      placeHotspotPanel(details);
      requestAnimationFrame(() => { if (details.isConnected && details.open) placeHotspotPanel(details); });
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
    if (event.key === 'Escape') $$('.product-hotspot[open],.desktop-nav details[open]').forEach(details => { details.open = false; $('summary',details)?.focus(); });
    const filter = $('.filter-popover[open]');
    if (filter && innerWidth < 750) {
      if (event.key === 'Escape') { filter.open = false; $('summary',filter).focus(); }
      if (event.key === 'Tab') { const controls = $$('summary,input:not([disabled]),button',filter).filter(node => node.getClientRects().length); const first = controls[0],last = controls[controls.length-1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault();last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();first?.focus(); } }
    }
  });
  document.addEventListener('shopify:section:load',event => init(event.target));
  document.addEventListener('shopify:section:unload',event => {
    for (const [container, observer] of observers) if (event.target.contains(container)) { observer.disconnect(); observers.delete(container); }
    for (const [section, controller] of requests) if (event.target.contains(section)) { controller.abort(); requests.delete(section); }
  });
  document.addEventListener('shopify:block:select',event => { const details = event.target.closest('details'); if (details) details.open = true; });
  init();
})();
