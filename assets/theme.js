/**
 * Bit Collector Theme JavaScript
 * Handles all vanilla JS animations, 3D card tilt physics, sepet drawers, search overlays, and tab elements.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initAnnouncementBar();
  initMobileMenu();
  initCardTilt();
  initCardClick();
  initCartDrawer();
  initSearchOverlay();
  initWhatsAppWidget();
  initProductTabs();
  initProductQuantitySelectors();
  initDropsCountdown();
});

/* ── 1. Header Scroll Effect ── */
function initHeaderScroll() {
  const header = document.querySelector('.js-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('glass', 'shadow-lg', 'shadow-black/20');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('glass', 'shadow-lg', 'shadow-black/20');
      header.classList.add('bg-transparent');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── 2. Announcement Bar Loop ── */
function initAnnouncementBar() {
  const announcements = document.querySelectorAll('.js-announcement-item');
  if (announcements.length <= 1) return;

  let currentIndex = 0;

  setInterval(() => {
    // Current slide slides out upwards
    const current = announcements[currentIndex];
    current.classList.remove('opacity-100', 'translate-y-0');
    current.classList.add('opacity-0', '-translate-y-4');

    // Increment index
    currentIndex = (currentIndex + 1) % announcements.length;

    // Next slide slides in from bottom
    const next = announcements[currentIndex];
    next.classList.remove('opacity-0', 'translate-y-4');
    next.classList.add('opacity-100', 'translate-y-0');
  }, 4000);
}

/* ── 3. Mobile Menu Drawer ── */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.js-mobile-menu-toggle');
  const drawer = document.querySelector('.js-mobile-menu-drawer');
  const panel = document.querySelector('.js-mobile-menu-panel');
  const backdrop = document.querySelector('.js-mobile-menu-backdrop');
  const hamIcon = document.querySelector('.js-mobile-menu-icon-hamburger');
  const closeIcon = document.querySelector('.js-mobile-menu-icon-close');

  if (!toggleBtn || !drawer || !panel) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    drawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      panel.classList.remove('translate-x-full');
      hamIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    }, 10);
  };

  const closeMenu = () => {
    isOpen = false;
    panel.classList.add('translate-x-full');
    hamIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  };

  toggleBtn.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  // Submenu toggles
  const parentLinks = document.querySelectorAll('.js-mobile-nav-link');
  parentLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const submenu = link.nextElementSibling;
      const chevron = link.querySelector('.js-chevron');
      if (submenu && submenu.classList.contains('js-mobile-submenu')) {
        e.preventDefault();
        submenu.classList.toggle('hidden');
        if (chevron) chevron.classList.toggle('rotate-180');
      }
    });
  });
}

/* ── 4. 3D Card Tilt Physics ── */
function initCardTilt() {
  const containers = document.querySelectorAll('.js-tilt-container');

  containers.forEach(container => {
    const el = container.querySelector('.js-tilt-element');
    const glow = container.querySelector('.js-tilt-glow');
    if (!el || !glow) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const xVal = e.clientX - rect.left;
      const yVal = e.clientY - rect.top;

      // Normalised coordinates (-1 to 1)
      const x = (xVal - rect.width / 2) / (rect.width / 2);
      const y = (yVal - rect.height / 2) / (rect.height / 2);

      // Tilting variables
      const tiltX = x * 8;
      const tiltY = y * -8;
      const glowX = (xVal / rect.width) * 100;
      const glowY = (yVal / rect.height) * 100;

      el.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.15)';
      
      glow.style.opacity = '0.35';
      glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`;
    });

    container.addEventListener('mouseleave', () => {
      el.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
      el.style.boxShadow = '';
      glow.style.opacity = '0';
    });
  });
}

/* ── 4b. Card Click Navigation & Interactive Button Isolation ── */
function initCardClick() {
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('.js-tilt-container');
    if (!card) return;

    // Check if clicked element or its parent is an interactive button
    const interactiveBtn = e.target.closest('.js-add-to-cart-btn') || 
                           e.target.closest('.js-quick-view-btn') || 
                           e.target.closest('.js-wishlist-toggle');
    if (interactiveBtn) {
      // Prevent parent <a> tag overlay from navigating
      e.preventDefault();
      
      // If it's a wishlist toggle button, toggle styling for instant visual feedback
      if (interactiveBtn.classList.contains('js-wishlist-toggle')) {
        const svg = interactiveBtn.querySelector('svg');
        if (svg) {
          interactiveBtn.classList.toggle('text-red-500');
          interactiveBtn.classList.toggle('text-silver');
          interactiveBtn.classList.toggle('bg-red-500/10');
        }
      }
      return;
    }

    // If we are in Shopify Theme Editor/Customizer, let the native <a> link handle the navigation
    if (window.Shopify && window.Shopify.designMode) {
      return;
    }

    // Fallback JS redirect for extra reliability on the live site (only if not already clicking an <a> link)
    const url = card.getAttribute('data-product-url');
    if (url && !e.target.closest('a')) {
      window.location.href = url;
    }
  });
}

/* ── 5. Shopify Cart API Integration & Sepet Drawer ── */
function initCartDrawer() {
  const drawer = document.getElementById('CartDrawer');
  const panel = document.querySelector('.js-cart-drawer-panel');
  const backdrop = document.querySelector('.js-cart-drawer-backdrop');
  
  const triggers = document.querySelectorAll('.js-cart-drawer-trigger');
  const closeBtns = document.querySelectorAll('.js-cart-drawer-close');

  if (!drawer || !panel) return;

  const openDrawer = () => {
    drawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    fetchAndRenderCart();
    setTimeout(() => {
      panel.classList.remove('translate-x-full');
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-60');
    }, 10);
  };

  const closeDrawer = () => {
    panel.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-60');
    backdrop.classList.add('opacity-0');
    document.body.style.overflow = '';
    setTimeout(() => {
      drawer.classList.add('hidden');
    }, 300);
  };

  triggers.forEach(t => t.addEventListener('click', openDrawer));
  closeBtns.forEach(b => b.addEventListener('click', closeDrawer));
  backdrop.addEventListener('click', closeDrawer);

  // Expose global function to trigger open from add cart buttons
  window.openCartDrawer = openDrawer;

  // Add to cart buttons hook (with visual loading feedback)
  document.body.addEventListener('click', async (e) => {
    const addToCartBtn = e.target.closest('.js-add-to-cart-btn');
    if (!addToCartBtn) return;

    e.preventDefault();
    const variantId = addToCartBtn.getAttribute('data-variant-id');
    const quantity = 1;

    // Visual feedback
    const originalContent = addToCartBtn.innerHTML;
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = `<svg class="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

    await addToCart(variantId, quantity);

    // Restore button
    addToCartBtn.disabled = false;
    addToCartBtn.innerHTML = originalContent;
  });

  // Product page form submit intercept (AJAX Add to Cart)
  const productForm = document.querySelector('form[action*="/cart/add"]');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = productForm.querySelector('[type="submit"]');
      const submitText = submitBtn ? submitBtn.querySelector('span') : null;
      const originalText = submitText ? submitText.textContent : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'Ekleniyor...';
      }

      const formData = new FormData(productForm);
      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (res.ok) {
          openDrawer();
        } else {
          const err = await res.json();
          alert(`Sepete eklenemedi: ${err.description || 'Lütfen stok durumunu kontrol edin.'}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = originalText;
        }
      }
    });
  }
}

// Fetch Cart and Draw HTML
async function fetchAndRenderCart() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    
    // Update counters
    updateCartCounts(cart.item_count);
    
    const container = document.querySelector('.js-cart-items-container');
    const emptyState = document.querySelector('.js-cart-empty-state');
    const itemsList = document.querySelector('.js-cart-drawer-items');
    const footer = document.querySelector('.js-cart-drawer-footer');
    const shippingBar = document.querySelector('.js-cart-shipping-bar');

    if (cart.item_count === 0) {
      emptyState.classList.remove('hidden');
      itemsList.classList.add('hidden');
      footer.classList.add('hidden');
      shippingBar.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    itemsList.classList.remove('hidden');
    footer.classList.remove('hidden');
    shippingBar.classList.remove('hidden');

    // Free shipping threshold calculations (₺2.500 = 250000 cents)
    const threshold = 250000;
    const progressPercent = Math.min((cart.total_price / threshold) * 100, 100);
    const amountLeft = threshold - cart.total_price;

    const shippingTextEl = document.querySelector('.js-shipping-bar-text');
    const progressEl = document.querySelector('.js-shipping-progress');

    progressEl.style.width = `${progressPercent}%`;
    if (amountLeft > 0) {
      const formattedAmount = formatMoney(amountLeft);
      shippingTextEl.innerHTML = `Ücretsiz kargo için <span class="text-electric-blue font-bold">${formattedAmount}</span> kaldı.`;
    } else {
      shippingTextEl.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1">🎉 Ücretsiz Kargo Limitine Ulaştınız!</span>`;
    }

    // Render Items
    itemsList.innerHTML = '';
    cart.items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]';
      
      const imageUrl = item.image ? item.image : '/placeholder.png';
      const formattedLinePrice = formatMoney(item.final_line_price);

      itemEl.innerHTML = `
        <div class="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-800 flex-shrink-0 flex items-center justify-center p-2">
          <img src="${imageUrl}" alt="${item.title}" class="object-contain w-full h-full" />
        </div>
        <div class="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 class="text-sm font-medium text-soft-white truncate">${item.product_title}</h3>
            ${item.vendor ? `<p class="text-[10px] text-muted uppercase mt-0.5">${item.vendor}</p>` : ''}
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
              <button type="button" class="p-1 rounded text-silver hover:text-soft-white hover:bg-white/[0.04] transition-colors js-drawer-qty" data-id="${item.key}" data-qty="${item.quantity - 1}">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </button>
              <span class="text-xs text-soft-white font-medium px-2">${item.quantity}</span>
              <button type="button" class="p-1 rounded text-silver hover:text-soft-white hover:bg-white/[0.04] transition-colors js-drawer-qty" data-id="${item.key}" data-qty="${item.quantity + 1}">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </button>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-soft-white">${formattedLinePrice}</span>
              <button type="button" class="p-1 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors js-drawer-remove" data-id="${item.key}">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
      itemsList.appendChild(itemEl);
    });

    // Subtotal
    document.querySelector('.js-cart-drawer-subtotal').textContent = formatMoney(cart.total_price);

    // Qty and remove button event listener
    itemsList.querySelectorAll('.js-drawer-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const qty = parseInt(btn.getAttribute('data-qty'));
        updateCartItem(id, qty);
      });
    });

    itemsList.querySelectorAll('.js-drawer-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateCartItem(id, 0);
      });
    });

    // Cross-sell items
    loadCrossSells(cart);

  } catch (err) {
    console.error('Render cart error:', err);
  }
}

// Add Item
async function addToCart(variantId, quantity) {
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: quantity }]
      })
    });
    
    if (res.ok) {
      window.openCartDrawer();
    } else {
      const err = await res.json();
      alert(`Sepete eklenemedi: ${err.description || 'Lütfen stok durumunu kontrol edin.'}`);
    }
  } catch (err) {
    console.error(err);
  }
}

// Update Item
async function updateCartItem(id, quantity) {
  try {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, quantity: quantity })
    });
    
    if (res.ok) {
      fetchAndRenderCart();
    }
  } catch (err) {
    console.error(err);
  }
}

// Update badges on navbar
function updateCartCounts(count) {
  const badges = document.querySelectorAll('.js-cart-count-badge');
  badges.forEach(b => {
    b.textContent = count;
    if (count > 0) b.classList.remove('hidden');
    else b.classList.add('hidden');
  });
}

// Format Money Utility
function formatMoney(cents) {
  // Shopify currency format (TRY)
  const amount = (cents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
  return `₺${amount}`;
}

// Dynamically fetch and display cross sells
async function loadCrossSells(cart) {
  const crossSellContainer = document.querySelector('.js-cart-cross-sells');
  const crossSellList = document.querySelector('.js-cross-sells-list');
  if (!crossSellContainer || !crossSellList) return;

  try {
    // Fetch some products from a backup collection
    const res = await fetch('/collections/all/products.json?limit=10');
    const data = await res.json();
    
    if (!data.products) return;

    // Filter products that are accessories and not in cart
    const itemsInCart = cart.items.map(item => item.product_id);
    const suggested = data.products
      .filter(p => p.tags.includes('Aksesuar') || p.tags.includes('accessories') || p.product_type.toLowerCase().includes('aksesuar'))
      .filter(p => !itemsInCart.includes(p.id))
      .slice(0, 3);

    if (suggested.length === 0) {
      crossSellContainer.classList.add('hidden');
      return;
    }

    crossSellContainer.classList.remove('hidden');
    crossSellList.innerHTML = '';

    suggested.forEach(p => {
      const variantId = p.variants[0].id;
      const imageUrl = p.images[0] ? p.images[0].src : '/placeholder.png';
      const priceFormatted = `₺${parseFloat(p.variants[0].price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;

      const itemEl = document.createElement('div');
      itemEl.className = 'flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] justify-between';
      itemEl.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <div class="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 bg-white/[0.02]">
            <img src="${imageUrl}" alt="${p.title}" class="object-contain w-full h-full" />
          </div>
          <div class="min-w-0">
            <h4 class="text-xs text-soft-white truncate max-w-[150px] font-medium">${p.title}</h4>
            <p class="text-[10px] text-silver font-bold">${priceFormatted}</p>
          </div>
        </div>
        <button type="button" class="px-3 py-1.5 rounded-lg bg-electric-blue/10 hover:bg-electric-blue text-[10px] text-electric-blue hover:text-white border border-electric-blue/20 transition-all font-semibold js-cross-sell-add" data-variant-id="${variantId}">
          Ekle
        </button>
      `;
      crossSellList.appendChild(itemEl);
    });

    crossSellList.querySelectorAll('.js-cross-sell-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const variantId = btn.getAttribute('data-variant-id');
        addToCart(variantId, 1);
      });
    });

  } catch (e) {
    console.error('Failed to load cross sells', e);
  }
}

/* ── 6. Search Overlay with Shopify Predictive Search ── */
function initSearchOverlay() {
  const overlay = document.getElementById('SearchOverlay');
  const input = document.querySelector('.js-search-overlay-input');
  
  const triggers = document.querySelectorAll('.js-search-trigger');
  const closeBtns = document.querySelectorAll('.js-search-overlay-close');

  if (!overlay || !input) return;

  const openSearch = () => {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      input.focus();
    }, 100);
  };

  const closeSearch = () => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  };

  triggers.forEach(t => t.addEventListener('click', openSearch));
  closeBtns.forEach(b => b.addEventListener('click', closeSearch));

  // Popular chips suggestions
  document.querySelectorAll('.js-popular-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.getAttribute('data-query');
      triggerPredictiveSearch(input.value);
    });
  });

  // Esc Key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  // Instant Typing Predictive search query
  let debounceTimeout;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      triggerPredictiveSearch(input.value);
    }, 300);
  });

  // Form submit query
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      redirectToSearchResults(input.value);
    }
  });

  const viewAllBtn = document.querySelector('.js-view-all-search-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      redirectToSearchResults(input.value);
    });
  }
}

async function triggerPredictiveSearch(query) {
  const resultsSection = document.querySelector('.js-search-results-section');
  const popularSection = document.querySelector('.js-search-popular-section');
  const resultsList = document.querySelector('.js-search-results-list');

  if (!query.trim()) {
    resultsSection.classList.add('hidden');
    popularSection.classList.remove('hidden');
    return;
  }

  popularSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  try {
    // Query Shopify Predictive Search API (Standard OS 2.0 endpoint)
    const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
    const data = await res.json();
    const products = data.resources.results.products || [];

    resultsList.innerHTML = '';

    if (products.length === 0) {
      resultsList.innerHTML = `<p class="text-sm text-muted">Aramanıza uygun sonuç bulunamadı.</p>`;
      return;
    }

    products.forEach(p => {
      const itemEl = document.createElement('a');
      itemEl.href = p.url;
      itemEl.className = 'flex gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group';
      
      const imageUrl = p.image ? p.image : '/placeholder.png';
      const formattedPrice = `₺${parseFloat(p.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;

      itemEl.innerHTML = `
        <div class="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1 bg-surface-900 border border-white/[0.06]">
          <img src="${imageUrl}" alt="${p.title}" class="object-contain w-full h-full p-1 group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div class="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h4 class="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-electric-blue transition-colors">${p.title}</h4>
            ${p.vendor ? `<p class="text-[10px] text-muted uppercase mt-0.5">${p.vendor}</p>` : ''}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-soft-white">${formattedPrice}</span>
          </div>
        </div>
        <div class="flex items-center text-muted group-hover:text-white transition-colors pr-2">
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      `;
      resultsList.appendChild(itemEl);
    });

  } catch (e) {
    console.error('Search results suggestions fail:', e);
  }
}

function redirectToSearchResults(query) {
  window.location.href = `/search?q=${encodeURIComponent(query)}`;
}

/* ── 7. WhatsApp Floating Support Box ── */
function initWhatsAppWidget() {
  const toggleBtn = document.querySelector('.js-whatsapp-toggle');
  const panel = document.querySelector('.js-whatsapp-panel');
  const closeBtn = document.querySelector('.js-whatsapp-close');

  if (!toggleBtn || !panel) return;

  let isOpen = false;

  const togglePanel = () => {
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.remove('hidden');
      setTimeout(() => {
        panel.classList.remove('translate-y-4', 'opacity-0');
        panel.classList.add('translate-y-0', 'opacity-100');
      }, 10);
    } else {
      panel.classList.remove('translate-y-0', 'opacity-100');
      panel.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => {
        panel.classList.add('hidden');
      }, 300);
    }
  };

  toggleBtn.addEventListener('click', togglePanel);
  if (closeBtn) closeBtn.addEventListener('click', togglePanel);
}

/* ── 8. Product Page Tabs Toggler ── */
function initProductTabs() {
  const tabBtns = document.querySelectorAll('.js-tab-btn');
  const tabContents = document.querySelectorAll('.js-tab-content');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTabName = btn.getAttribute('data-tab');

      // Update button colors
      tabBtns.forEach(b => {
        b.classList.remove('text-soft-white', 'border-b-2', 'border-electric-blue');
        b.classList.add('text-silver');
      });
      btn.classList.remove('text-silver');
      btn.classList.add('text-soft-white', 'border-b-2', 'border-electric-blue');

      // Update active panel content visibility
      tabContents.forEach(content => {
        if (content.getAttribute('data-tab') === activeTabName) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
}

/* ── 9. Qty adjustment elements on product page detail ── */
function initProductQuantitySelectors() {
  const input = document.querySelector('.js-qty-input');
  const plus = document.querySelector('.js-qty-plus');
  const minus = document.querySelector('.js-qty-minus');

  if (!input || !plus || !minus) return;

  plus.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
  });

  minus.addEventListener('click', () => {
    const val = parseInt(input.value);
    if (val > 1) input.value = val - 1;
  });
}

/* ── 10. Drops Geri Sayım Sayacı ── */
function initDropsCountdown() {
  const section = document.querySelector('.js-countdown-section');
  if (!section) return;

  const targetDateStr = section.getAttribute('data-target-date');
  if (!targetDateStr) return;

  // targetDateStr format: YYYY-MM-DD HH:MM:SS veya ISO biçimi
  const targetTime = new Date(targetDateStr.replace(' ', 'T')).getTime();

  const daysEl = section.querySelector('.js-days');
  const hoursEl = section.querySelector('.js-hours');
  const minutesEl = section.querySelector('.js-minutes');
  const secondsEl = section.querySelector('.js-seconds');

  const updateTimer = () => {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      clearInterval(interval);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  // Form submit başarılı toast animasyonu
  const form = section.querySelector('.js-countdown-form');
  const successAlert = section.querySelector('.js-countdown-success');
  if (form && successAlert) {
    form.addEventListener('submit', (e) => {
      successAlert.classList.remove('hidden');
      setTimeout(() => {
        successAlert.classList.add('hidden');
      }, 4000);
    });
  }
}
