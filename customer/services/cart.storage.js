(() => {
  const CART_STORAGE_KEY = "cyberphone_cart_v1";

  const readCartSnapshot = () => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) return [];
      return parsed.items;
    } catch {
      return [];
    }
  };

  const saveCartSnapshot = (cart) => {
    try {
      const items = cart && Array.isArray(cart.items) ? cart.items : [];
      if (!items.length) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return;
      }

      const payloadItems = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const productId = it && it.product ? String(it.product.id || "") : "";
        if (!productId) continue;
        let qty = it && it.quantity ? Number(it.quantity) : 1;
        if (!Number.isFinite(qty) || qty < 1) qty = 1;
        payloadItems.push({ productId, quantity: qty });
      }

      if (!payloadItems.length) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return;
      }

      const payload = { v: 1, items: payloadItems };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      return;
    }
  };

  const hydrateCartFromStorage = (cart, products) => {
    if (!cart) return;
    const list = Array.isArray(products) ? products : [];
    const snapshot = readCartSnapshot();
    if (!snapshot.length) return;

    const qtyById = {};
    for (let i = 0; i < snapshot.length; i++) {
      const x = snapshot[i];
      const id = x ? String(x.productId || "") : "";
      if (!id) continue;
      let q = x && x.quantity ? Number(x.quantity) : 1;
      if (!Number.isFinite(q) || q < 1) q = 1;
      qtyById[id] = (qtyById[id] || 0) + q;
    }

    cart.items = [];
    for (const productId in qtyById) {
      const qty = qtyById[productId];
      let product = null;
      for (let j = 0; j < list.length; j++) {
        if (String(list[j].id) === String(productId)) {
          product = list[j];
          break;
        }
      }
      if (!product) continue;
      cart.items.push(new CartItem(product, qty));
    }
  };

  window.cartStorage = window.cartStorage || {};
  window.cartStorage.saveCartSnapshot = saveCartSnapshot;
  window.cartStorage.hydrateCartFromStorage = hydrateCartFromStorage;
})();
