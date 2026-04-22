(() => {
  const openProductPopup = (product, utils) => {
    const popup = document.getElementById("productPopup");
    const content = document.getElementById("productPopupContent");
    if (!popup || !content || !product) return;

    content.innerHTML = `
      <div class="flex flex-col gap-6 sm:flex-row">
        <div class="sm:w-1/2">
          <div class="flex h-full items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-4">
            <img src="${product.img || ""}" alt="${product.name || "Product"}" class="h-64 w-full object-contain mix-blend-multiply sm:h-80" />
          </div>
        </div>
        <div class="sm:w-1/2">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-2xl font-bold text-slate-900">${product.name || "Product"}</h3>
            <span class="inline-flex items-center rounded-full bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 ring-1 ring-inset ring-teal-600/20">${utils?.normalizeType?.(product.type) || product.type || "other"}</span>
          </div>
          <p class="mt-4 text-3xl font-bold text-slate-900">${utils?.formatPrice?.(product.price) || "$" + product.price}</p>
          <div class="mt-6 space-y-4">
            <div class="space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">Specifications</h4>
              <dl class="grid grid-cols-1 gap-y-2 text-sm">
                <div class="flex items-start gap-2"><dt class="min-w-28 font-semibold text-slate-600">Screen:</dt><dd class="text-slate-900">${product.screen || "N/A"}</dd></div>
                <div class="flex items-start gap-2"><dt class="min-w-28 font-semibold text-slate-600">Back Camera:</dt><dd class="text-slate-900">${product.backCamera || "N/A"}</dd></div>
                <div class="flex items-start gap-2"><dt class="min-w-28 font-semibold text-slate-600">Front Camera:</dt><dd class="text-slate-900">${product.frontCamera || "N/A"}</dd></div>
              </dl>
            </div>
            <div class="space-y-2 border-t border-slate-100 pt-4">
              <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500">Description</h4>
              <p class="text-sm leading-relaxed text-slate-600">${product.desc || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    popup.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  };

  const closeProductPopup = () => {
    const popup = document.getElementById("productPopup");
    if (popup) {
      popup.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  };

  const initProductPopupEvents = () => {
    document.getElementById("productPopupClose")?.addEventListener("click", closeProductPopup);
    document.getElementById("productPopupBackdrop")?.addEventListener("click", closeProductPopup);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeProductPopup(); });
  };

  const handleProductDetailsClick = (e, state, utils) => {
    const btn = e.target.closest("button[data-action='details']");
    if (!btn) return;
    const productId = btn.dataset.productId;
    const product = state?.products?.find((p) => String(p.id) === productId);
    if (product) openProductPopup(product, utils);
  };

  window.productDetailController = {
    openProductPopup,
    closeProductPopup,
    initProductPopupEvents,
    handleProductDetailsClick,
  };
})();