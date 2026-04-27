(() => {
  const elements = {
    paymentMethods: document.querySelectorAll('input[name="paymentMethod"]'),
    transferInfo: document.getElementById("transferInfo"),
    cardInfo: document.getElementById("cardInfo"),
    completeBtn: document.getElementById("completePayment"),
  };

  const state = {
    paymentMethod: "cash", 
  };

  const switchPaymentMethod = (method) => {
    state.paymentMethod = method;
    
    if (elements.transferInfo) {
      elements.transferInfo.classList.toggle("hidden", method !== "transfer");
    }
    if (elements.cardInfo) {
      elements.cardInfo.classList.toggle("hidden", method !== "card");
    }
  };

  const handlePaymentCompletion = () => {
    alert("Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.");
    
    if (window.shoppingCheckoutController) {
      window.shoppingCheckoutController.close();
    }
    
    // Clear cart
    if (window.shoppingCartController?.cart) {
      window.shoppingCartController.cart.items = [];
      window.cartStorage?.saveCartSnapshot?.(window.shoppingCartController.cart);
      
      const cartEls = {
        cartItems: document.getElementById("cartItems"),
        cartCount: document.getElementById("cartCount"),
        cartCountText: document.getElementById("cartCountText"),
        cartSubtotal: document.getElementById("cartSubtotal"),
        cartTax: document.getElementById("cartTax"),
        cartShipping: document.getElementById("cartShipping"),
        cartTotal: document.getElementById("cartTotal"),
        cartCheckoutButton: document.getElementById("cartCheckoutButton"),
      };
      const utils = window.shoppingUtils;
      window.shoppingCartController.renderCart(cartEls, utils);
    }
  };

  const reset = () => {
    state.paymentMethod = "cash";

    elements.paymentMethods.forEach(radio => {
      if (radio.value === "cash") radio.checked = true;
    });
    switchPaymentMethod("cash");
  };

  const bindEvents = () => {
    elements.paymentMethods.forEach(radio => {
      radio.addEventListener("change", (e) => switchPaymentMethod(e.target.value));
    });

    elements.completeBtn?.addEventListener("click", handlePaymentCompletion);
  };

  bindEvents();

  window.shoppingPaymentController = {
    reset,
    switchPaymentMethod
  };
})();
