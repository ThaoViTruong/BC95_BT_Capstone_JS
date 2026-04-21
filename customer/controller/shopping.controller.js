(() => {
  const els = {
    typeSelect: document.getElementById("typeSelect"),
    sortSelect: document.getElementById("sortSelect"),
    productGrid: document.getElementById("productGrid"),
    resultText: document.getElementById("resultText"),
    pagination: document.getElementById("pagination"),
    cartButton: document.getElementById("cartButton"),
    cartPopup: document.getElementById("cartPopup"),
    cartPopupBackdrop: document.getElementById("cartPopupBackdrop"),
    cartPopupClose: document.getElementById("cartPopupClose"),
    cartCount: document.getElementById("cartCount"),
    cartCountText: document.getElementById("cartCountText"),
    cartItems: document.getElementById("cartItems"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartShipping: document.getElementById("cartShipping"),
    cartTax: document.getElementById("cartTax"),
    cartTotal: document.getElementById("cartTotal"),
    cartCheckoutButton: document.getElementById("cartCheckoutButton"),
  };

  const state = {
    products: [],
  };

  const utils =
    window.shoppingUtils ||
    {
      normalizeType: (type) => String(type || "").trim().toLowerCase(),
      formatPrice: (price) => {
        const n = Number(price);
        if (Number.isNaN(n)) return String(price ?? "");
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(n);
      },
    };

  const openCartPopup = () => {
    if (!els.cartPopup) return;
    els.cartPopup.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    window.shoppingCartController?.renderCart(els, utils);
  };

  const closeCartPopup = () => {
    if (!els.cartPopup) return;
    els.cartPopup.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  const bindCartPopupEvents = () => {
    if (!els.cartButton || !els.cartPopup) return;

    els.cartButton.addEventListener("click", openCartPopup);
    els.cartPopupClose?.addEventListener("click", closeCartPopup);
    els.cartPopupBackdrop?.addEventListener("click", closeCartPopup);

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (els.cartPopup.classList.contains("hidden")) return;
      closeCartPopup();
    });
  };

  const init = async () => {
    bindCartPopupEvents();
    window.shoppingCartController?.bindEvents(els, utils);

    const data = await window.getDataPhone?.();
    state.products = Array.isArray(data) ? data.map((x) => new Product(x)) : [];

    window.shoppingProductsController?.renderProducts(els, state.products, utils);
    window.shoppingProductsController?.bindProductEvents(els, state, utils);

    window.shoppingCartController?.hydrateCartFromStorage(state.products);
    window.shoppingCartController?.renderCart(els, utils);
  };

  window.addEventListener("DOMContentLoaded", init);
})();
