(() => {
  const cart = new Cart();

  const SHIPPING_FEE = 0;
  const TAX_RATE = 0;

  const getTypeLabel = (type, utils) => {
    const t = utils?.normalizeType ? utils.normalizeType(type) : String(type || "").trim().toLowerCase();
    if (t === "iphone") return "iPhone";
    if (t === "samsung") return "Samsung";
    return "Khác";
  };

  const persistCart = () => {
    window.cartStorage?.saveCartSnapshot?.(cart);
  };

  const hydrateCartFromStorage = (products) => {
    window.cartStorage?.hydrateCartFromStorage?.(cart, products);
  };

  const calcTax = (subtotal) => {
    const sub = Number(subtotal) || 0;
    const rate = Number(TAX_RATE) || 0;
    return Math.max(0, sub * Math.max(0, rate));
  };

  const updateCartSummary = (els, utils) => {
    const itemCount = cart.items.length;
  if (els.cartCount) {
    els.cartCount.textContent = String(itemCount);
    if (itemCount > 0) els.cartCount.classList.remove("hidden");
    else els.cartCount.classList.add("hidden");
  }
  if (els.cartCountText) els.cartCountText.textContent = String(itemCount);

    const subtotal = cart.totalPrice;
    const tax = calcTax(subtotal);
    const total = subtotal + (Number(SHIPPING_FEE) || 0) + tax;

  if (els.cartSubtotal) els.cartSubtotal.textContent = utils.formatPrice(subtotal);
  if (els.cartTax) els.cartTax.textContent = utils.formatPrice(tax);
  if (els.cartShipping) {
    if ((Number(SHIPPING_FEE) || 0) <= 0) els.cartShipping.textContent = "Miễn phí";
    else els.cartShipping.textContent = utils.formatPrice(SHIPPING_FEE);
  }
  if (els.cartTotal) els.cartTotal.textContent = utils.formatPrice(total);

  if (els.cartCheckoutButton) {
    els.cartCheckoutButton.disabled = itemCount <= 0;
  }
  };

  const createEmptyCart = () => {
    const wrap = document.createElement("div");
  wrap.className =
    "rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600";

    const icon = document.createElement("div");
  icon.className =
    "mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600";
  icon.innerHTML = '<i class="fa-solid fa-bag-shopping text-lg"></i>';

    const title = document.createElement("div");
  title.className = "mt-4 text-base font-bold text-slate-900";
  title.textContent = "Giỏ hàng của bạn đang trống";

    const desc = document.createElement("p");
  desc.className = "mt-2 text-sm text-slate-500";
  desc.textContent = "Thêm sản phẩm để tiếp tục mua sắm.";

  wrap.appendChild(icon);
  wrap.appendChild(title);
  wrap.appendChild(desc);
  return wrap;
  };

  const createQtyButton = ({ label, action, productId }) => {
    const btn = document.createElement("button");
    btn.type = "button";
  btn.className =
    "inline-flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]";
    btn.textContent = label;
    btn.dataset.action = action;
    btn.dataset.productId = String(productId ?? "");
  return btn;
  };

  const createCartItemCard = (cartItem, utils) => {
    const product = cartItem?.product || null;
    const productId = String(product?.id ?? "");
    const qty = Math.max(1, Number(cartItem?.quantity) || 1);

    const card = document.createElement("article");
  card.className =
    "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm";

    const row = document.createElement("div");
  row.className = "flex flex-col gap-4 sm:flex-row sm:items-center";

    const imgWrap = document.createElement("div");
  imgWrap.className =
    "h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100";

    const img = document.createElement("img");
  img.className = "h-full w-full object-cover object-center";
    img.src = product?.img || "";
    img.alt = product?.name || "Sản phẩm";
  img.loading = "lazy";
  imgWrap.appendChild(img);

    const info = document.createElement("div");
  info.className = "min-w-0 flex-1";

    const name = document.createElement("h4");
  name.className = "truncate text-base font-bold text-slate-900";
    name.textContent = product?.name || "Sản phẩm";

    const meta = document.createElement("p");
  meta.className =
    "mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400";
    meta.textContent = getTypeLabel(product?.type, utils);

    const unit = document.createElement("p");
  unit.className = "mt-3 text-sm font-semibold text-slate-700";
    unit.textContent = utils.formatPrice(product?.price);

  info.appendChild(name);
  info.appendChild(meta);
  info.appendChild(unit);

    const actions = document.createElement("div");
  actions.className =
    "flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end";

    const qtyWrap = document.createElement("div");
  qtyWrap.className =
    "inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-white";

    const dec = createQtyButton({
    label: "−",
    action: "decrease",
    productId,
  });
    const inc = createQtyButton({
    label: "+",
    action: "increase",
    productId,
  });

    const qtyText = document.createElement("div");
  qtyText.className = "px-3 text-sm font-bold text-slate-800";
  qtyText.textContent = String(qty);

  if (qty <= 1) {
    dec.disabled = true;
    dec.className =
      "inline-flex h-9 w-9 items-center justify-center text-slate-300";
  }

  qtyWrap.appendChild(dec);
  qtyWrap.appendChild(qtyText);
  qtyWrap.appendChild(inc);

    const sub = document.createElement("div");
  sub.className = "text-right text-sm font-bold text-slate-900";
    sub.textContent = utils.formatPrice(cartItem?.subtotal);

    const remove = document.createElement("button");
  remove.type = "button";
  remove.className =
    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800";
  remove.dataset.action = "remove";
  remove.dataset.productId = productId;
  remove.innerHTML = '<i class="fa-solid fa-trash-can"></i><span>Xóa</span>';

  actions.appendChild(qtyWrap);
  actions.appendChild(sub);
  actions.appendChild(remove);

  row.appendChild(imgWrap);
  row.appendChild(info);
  row.appendChild(actions);
  card.appendChild(row);

  return card;
  };

  const renderCart = (els, utils) => {
    if (!els?.cartItems) return;
    els.cartItems.innerHTML = "";

    if (!cart.items.length) {
      els.cartItems.appendChild(createEmptyCart());
    } else {
      cart.items.forEach((it) => els.cartItems.appendChild(createCartItemCard(it, utils)));
    }

    updateCartSummary(els, utils);
  };

  const addToCartById = (state, productId, els, utils) => {
    const id = String(productId ?? "");
    if (!id) return;

    const products = Array.isArray(state?.products) ? state.products : [];
    const product = products.find((p) => String(p.id) === id);
    if (!product) return;

    cart.addProduct(product);
    persistCart();
    renderCart(els, utils);
  };

  let eventsBound = false;

  const bindEvents = (els, utils) => {
    if (eventsBound) return;
    eventsBound = true;

    if (els?.cartItems) {
      els.cartItems.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action][data-product-id]");
        if (!btn) return;

        const action = btn.dataset.action;
        const productId = btn.dataset.productId;
        if (!productId) return;

        if (action === "increase") {
          const idx = cart.findIndexByProductId(productId);
          if (idx !== -1) cart.items[idx].increase(1);
        } else if (action === "decrease") {
          const idx = cart.findIndexByProductId(productId);
          if (idx === -1) return;
          const currentQty = Number(cart.items[idx].quantity) || 1;
          if (currentQty <= 1) return;
          cart.decreaseProduct(productId, 1);
        } else if (action === "remove") {
          const idx = cart.findIndexByProductId(productId);
          const name = idx !== -1 ? cart.items[idx]?.product?.name || "Sản phẩm" : "Sản phẩm";
          const ok = confirm(`Xóa "${name}" khỏi giỏ hàng?`);
          if (!ok) return;
          cart.removeProduct(productId);
        } else {
          return;
        }

        persistCart();
        renderCart(els, utils);
      });
    }

    els?.cartCheckoutButton?.addEventListener("click", () => {
      if (els.cartCheckoutButton.disabled) return;
      
      if (typeof window.shoppingCheckoutController?.open === "function") {
        const cartPopup = document.getElementById("cartPopup");
        if (cartPopup) cartPopup.classList.add("hidden");
        window.shoppingCheckoutController.open();
      } else {
        alert("Chức năng thanh toán đang được phát triển.");
      }
    });
  };

  window.shoppingCartController = window.shoppingCartController || {};
  window.shoppingCartController.cart = cart;
  window.shoppingCartController.renderCart = renderCart;
  window.shoppingCartController.addToCartById = addToCartById;
  window.shoppingCartController.hydrateCartFromStorage = hydrateCartFromStorage;
  window.shoppingCartController.bindEvents = bindEvents;
})();
