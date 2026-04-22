(() => {
  const PAGE_SIZE = 6;
  let currentPage = 1;
  let currentProducts = [];

  const updateResultText = (els, count) => {
    if (!els?.resultText) return;
    els.resultText.textContent = `Showing ${count} products`;
  };

  const getTotalPages = () => {
    if (!currentProducts.length) return 0;
    return Math.ceil(currentProducts.length / PAGE_SIZE);
  };

  const createPageButton = ({ label, page, active, disabled }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold shadow-sm outline-none transition focus:ring-2 focus:ring-teal-200";
    btn.textContent = label;
    btn.disabled = Boolean(disabled);
    if (!btn.disabled && typeof page === "number") btn.dataset.page = String(page);

    if (btn.disabled) {
      btn.classList.add("cursor-not-allowed", "border-slate-200", "bg-white", "text-slate-300");
    } else if (active) {
      btn.classList.add("border-slate-900", "bg-slate-900", "text-white");
      btn.setAttribute("aria-current", "page");
    } else {
      btn.classList.add("border-slate-200", "bg-white", "text-slate-700", "hover:bg-slate-50", "active:scale-[0.99]");
    }
    return btn;
  };

  const createProductCard = (p, utils) => {
    const card = document.createElement("article");
    card.className = "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md";

    const imageWrap = document.createElement("div");
    imageWrap.className = "h-80 w-full bg-gradient-to-br from-slate-900 to-slate-700 md:h-96";

    const img = document.createElement("img");
    img.className = "h-full w-full object-cover object-center";
    img.src = p.img || "";
    img.alt = p.name || "Product";
    img.loading = "lazy";
    imageWrap.appendChild(img);

    const body = document.createElement("div");
    body.className = "p-5";

    const name = document.createElement("h3");
    name.className = "text-lg font-bold text-slate-900";
    name.textContent = p.name || "Product name";

    const meta = document.createElement("p");
    meta.className = "mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400";
    meta.textContent = utils.normalizeType(p.type) || "other";

    const price = document.createElement("p");
    price.className = "mt-3 text-sm font-bold text-slate-700";
    price.textContent = utils.formatPrice(p.price);

    const btnGroup = document.createElement("div");
    btnGroup.className = "mt-4 flex gap-2";

    const detailsBtn = document.createElement("button");
    detailsBtn.type = "button";
    detailsBtn.className = "flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.99]";
    detailsBtn.innerHTML = '<i class="fa-solid fa-eye"></i><span>View details</span>';
    detailsBtn.dataset.productId = String(p.id ?? "");
    detailsBtn.dataset.action = "details";

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]";
    addBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i><span>Add to cart</span>';
    addBtn.dataset.productId = String(p.id ?? "");
    addBtn.dataset.action = "add";

    btnGroup.appendChild(detailsBtn);
    btnGroup.appendChild(addBtn);

    body.appendChild(name);
    body.appendChild(meta);
    body.appendChild(price);
    body.appendChild(btnGroup);

    card.appendChild(imageWrap);
    card.appendChild(body);
    return card;
  };

  const renderProducts = (els, products, utils) => {
    currentProducts = Array.isArray(products) ? products : [];
    currentPage = 1;
    renderCurrentPage(els, utils);
  };

  const renderCurrentPage = (els, utils) => {
    if (!els?.productGrid) return;
    els.productGrid.innerHTML = "";

    if (!currentProducts.length) {
      const empty = document.createElement("div");
      empty.className = "col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500";
      empty.textContent = "No matching products.";
      els.productGrid.appendChild(empty);
      updateResultText(els, 0);
      renderPagination(els);
      return;
    }

    const totalPages = getTotalPages();
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = currentProducts.slice(start, start + PAGE_SIZE);
    pageItems.forEach((p) => els.productGrid.appendChild(createProductCard(p, utils)));

    updateResultText(els, currentProducts.length);
    renderPagination(els);
  };

  const renderPagination = (els) => {
    if (!els?.pagination) return;
    els.pagination.innerHTML = "";
    const totalPages = getTotalPages();
    if (totalPages <= 1) return;

    els.pagination.appendChild(createPageButton({ label: "Previous", page: currentPage - 1, disabled: currentPage <= 1 }));

    for (let p = 1; p <= totalPages; p++) {
      els.pagination.appendChild(createPageButton({ label: String(p), page: p, active: p === currentPage }));
    }

    els.pagination.appendChild(createPageButton({ label: "Next", page: currentPage + 1, disabled: currentPage >= totalPages }));
  };

  const getSelectedType = (els, utils) => {
    if (!els?.typeSelect) return "";
    return utils.normalizeType(els.typeSelect.value);
  };

  const getSortMode = (els) => {
    if (!els?.sortSelect) return "";
    return String(els.sortSelect.value || "");
  };

  const applyFilterAndSort = (els, state, utils) => {
    const selectedType = getSelectedType(els, utils);
    const sortMode = getSortMode(els);
    const source = Array.isArray(state?.products) ? state.products : [];
    const result = selectedType ? source.filter((p) => utils.normalizeType(p.type) === selectedType) : [...source];

    if (sortMode === "price_asc") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortMode === "price_desc") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    renderProducts(els, result, utils);
  };

  const handleTypeChange = (els, state, utils) => applyFilterAndSort(els, state, utils);
  const handleSortChange = (els, state, utils) => applyFilterAndSort(els, state, utils);

  const handleProductGridClick = (e, state, els, utils) => {
    const btn = e.target.closest("button[data-product-id]");
    if (!btn) return;

    const action = btn.dataset.action;
    if (action === "details") {
      window.productDetailController?.handleProductDetailsClick(e, state, utils);
    } else {
      window.shoppingCartController?.addToCartById?.(state, btn.dataset.productId, els, utils);
    }
  };

  const handlePaginationClick = (e, els, utils) => {
    const btn = e.target.closest("button[data-page]");
    if (!btn) return;
    const page = Number(btn.dataset.page);
    if (!Number.isFinite(page)) return;
    currentPage = page;
    renderCurrentPage(els, utils);
  };

  const bindProductEvents = (els, state, utils) => {
    if (els?.typeSelect) els.typeSelect.onchange = () => handleTypeChange(els, state, utils);
    if (els?.sortSelect) els.sortSelect.onchange = () => handleSortChange(els, state, utils);
    els?.productGrid?.addEventListener("click", (e) => handleProductGridClick(e, state, els, utils));
    els?.pagination?.addEventListener("click", (e) => handlePaginationClick(e, els, utils));
  };

  window.shoppingProductsController = { renderProducts, bindProductEvents };
})();