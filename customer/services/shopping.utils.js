(() => {
  const normalizeType = (type) => String(type || "").trim().toLowerCase();

  const formatPrice = (price) => {
    const n = Number(price);
    if (Number.isNaN(n)) return String(price ?? "");

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  };

  window.shoppingUtils = window.shoppingUtils || {};
  window.shoppingUtils.normalizeType = normalizeType;
  window.shoppingUtils.formatPrice = formatPrice;
})();
