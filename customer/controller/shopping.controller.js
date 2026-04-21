const els = {
  typeSelect: document.getElementById("typeSelect"),
  productGrid: document.getElementById("productGrid"),
  resultText: document.getElementById("resultText"),
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

const normalizeType = (type) => String(type || "").trim().toLowerCase();

const formatPrice = (price) => {
  const n = Number(price);
  if (Number.isNaN(n)) return String(price ?? "");
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
};

const utils = {
  normalizeType,
  formatPrice,
};

const openCartPopup = (els, utils) => {
  if (!els.cartPopup) return;
  els.cartPopup.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  window.shoppingCartController.renderCart(els, utils);
};

const closeCartPopup = (els) => {
  if (!els.cartPopup) return;
  els.cartPopup.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
};

const bindCartPopupEvents = (els, utils) => {
  if (!els.cartButton || !els.cartPopup) return;

  els.cartButton.addEventListener("click", () => openCartPopup(els, utils));

  if (els.cartPopupClose)
    els.cartPopupClose.addEventListener("click", () => closeCartPopup(els));

  if (els.cartPopupBackdrop)
    els.cartPopupBackdrop.addEventListener("click", () => closeCartPopup(els));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (els.cartPopup.classList.contains("hidden")) return;
    closeCartPopup(els);
  });
};

const init = async () => {
  bindCartPopupEvents(els, utils);
  window.shoppingCartController.bindEvents(els, utils);
  const data = await getDataPhone();
  state.products = Array.isArray(data) ? data.map((x) => new Product(x)) : [];
  window.shoppingProductsController.renderProducts(els, state.products, utils);
  window.shoppingProductsController.bindProductEvents(els, state, utils);
  window.shoppingCartController.renderCart(els, utils);
};

window.addEventListener("DOMContentLoaded", init);
