(() => {
  const elements = {
    modal: document.getElementById("checkoutModal"),
    backdrop: document.getElementById("checkoutModalBackdrop"),
    closeBtn: document.getElementById("checkoutModalClose"),
    step1: document.getElementById("checkoutStep1"),
    step2: document.getElementById("checkoutStep2"),
    step1Circle: document.getElementById("step1Circle"),
    step2Circle: document.getElementById("step2Circle"),
    step2Text: document.getElementById("step2Text"),
    form: document.getElementById("checkoutForm"),
    deliveryTabs: document.querySelectorAll(".delivery-tab"),
    pickupContent: document.getElementById("pickupContent"),
    deliveryContent: document.getElementById("deliveryContent"),
    backBtn: document.getElementById("backToStep1"),
  };

  const state = {
    currentStep: 1,
    deliveryMethod: "pickup", 
    recipientAutoFilled: true,
  };

  const getField = (name) => elements.form?.elements?.namedItem?.(name) || null;

  const normalizePhoneDigits = (value) => String(value || "").replace(/\D/g, "");

  const setValidity = (input, message) => {
    if (!input) return;
    input.setCustomValidity(message || "");
  };

  const validateName = (input, label) => {
    if (!input) return true;
    const value = String(input.value || "").trim();
    if (!value) {
      setValidity(input, `Vui lòng nhập ${label}.`);
      return false;
    }
    if (value.length < 5) {
      setValidity(input, `${label} phải từ 5 ký tự trở lên.`);
      return false;
    }
    setValidity(input, "");
    return true;
  };

  const validatePhone = (input, label) => {
    if (!input) return true;
    const raw = String(input.value || "").trim();
    const digits = normalizePhoneDigits(raw);
    if (!digits) {
      setValidity(input, `Vui lòng nhập ${label}.`);
      return false;
    }
    if (!/^\d+$/.test(raw)) {
      setValidity(input, `${label} chỉ được chứa chữ số.`);
      return false;
    }
    if (!/^\d{10,11}$/.test(digits)) {
      setValidity(input, `${label} phải gồm 10-11 chữ số.`);
      return false;
    }
    setValidity(input, "");
    return true;
  };

  const validateEmail = (input) => {
    if (!input) return true;
    const value = String(input.value || "").trim();
    if (!value) {
      setValidity(input, "Vui lòng nhập email.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setValidity(input, "Email không hợp lệ. Ví dụ: ten@gmail.com");
      return false;
    }
    setValidity(input, "");
    return true;
  };

  const clearCustomValidity = () => {
    ["customerName", "customerPhone", "customerEmail", "recipientName", "recipientPhone"].forEach((name) => {
      setValidity(getField(name), "");
    });
  };

  const applyDeliveryRequirements = (method) => {
    const recipientName = getField("recipientName");
    const recipientPhone = getField("recipientPhone");
    const isDelivery = method === "delivery";
    if (recipientName) recipientName.required = isDelivery;
    if (recipientPhone) recipientPhone.required = isDelivery;
  };

  const syncRecipientFromCustomer = ({ force } = { force: false }) => {
    if (state.deliveryMethod !== "delivery") return;
    const customerName = getField("customerName");
    const customerPhone = getField("customerPhone");
    const recipientName = getField("recipientName");
    const recipientPhone = getField("recipientPhone");
    if (!recipientName || !recipientPhone || !customerName || !customerPhone) return;

    const shouldFill =
      force ||
      state.recipientAutoFilled ||
      (!String(recipientName.value || "").trim() && !String(recipientPhone.value || "").trim());

    if (!shouldFill) return;

    recipientName.value = customerName.value || "";
    recipientPhone.value = customerPhone.value || "";
    state.recipientAutoFilled = true;
  };

  const validateStep1 = () => {
    applyDeliveryRequirements(state.deliveryMethod);

    const customerName = getField("customerName");
    const customerPhone = getField("customerPhone");
    const customerEmail = getField("customerEmail");

    const okCustomer =
      validateName(customerName, "Họ tên") &&
      validatePhone(customerPhone, "Số điện thoại") &&
      validateEmail(customerEmail);

    let okRecipient = true;
    if (state.deliveryMethod === "delivery") {
      okRecipient =
        validateName(getField("recipientName"), "Tên người nhận") &&
        validatePhone(getField("recipientPhone"), "Số điện thoại người nhận");
    } else {
      setValidity(getField("recipientName"), "");
      setValidity(getField("recipientPhone"), "");
    }

    const ok = okCustomer && okRecipient;
    return elements.form?.reportValidity ? elements.form.reportValidity() && ok : ok;
  };

  const open = () => {
    if (!elements.modal) return;
    elements.modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    reset();
    
    if (window.vnAddressService) {
      const citySelect = document.getElementById("addressCity");
      const districtSelect = document.getElementById("addressDistrict");
      const wardSelect = document.getElementById("addressWard");
      
      window.vnAddressService.populateProvinces(citySelect);
      window.vnAddressService.bindAddressDropdowns(citySelect, districtSelect, wardSelect);
    }
  };

  const close = () => {
    if (!elements.modal) return;
    elements.modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  const reset = () => {
    state.currentStep = 1;
    state.deliveryMethod = "pickup";
    state.recipientAutoFilled = true;
    
    if (elements.form) elements.form.reset();
    clearCustomValidity();
    
    showStep(1);
    switchDeliveryTab("pickup");
    
    if (window.shoppingPaymentController) {
      window.shoppingPaymentController.reset();
    }
  };

  const showStep = (step) => {
    state.currentStep = step;
    if (step === 1) {
      elements.step1.classList.remove("hidden");
      elements.step2.classList.add("hidden");
      
      elements.step1Circle.classList.add("bg-teal-600", "text-white");
      elements.step1Circle.classList.remove("bg-slate-200", "text-slate-500");
      
      elements.step2Circle.classList.add("bg-slate-200", "text-slate-500");
      elements.step2Circle.classList.remove("bg-teal-600", "text-white");
      elements.step2Text.classList.add("text-slate-500");
      elements.step2Text.classList.remove("text-slate-900");
    } else {
      elements.step1.classList.add("hidden");
      elements.step2.classList.remove("hidden");
      
      elements.step1Circle.classList.add("bg-teal-600", "text-white");
      
      elements.step2Circle.classList.add("bg-teal-600", "text-white");
      elements.step2Circle.classList.remove("bg-slate-200", "text-slate-500");
      elements.step2Text.classList.add("text-slate-900");
      elements.step2Text.classList.remove("text-slate-500");
    }
  };

  const switchDeliveryTab = (method) => {
    state.deliveryMethod = method;
    applyDeliveryRequirements(method);
    elements.deliveryTabs.forEach(tab => {
      const isMatch = tab.dataset.tab === method;
      tab.classList.toggle("bg-teal-600", isMatch);
      tab.classList.toggle("text-white", isMatch);
      tab.classList.toggle("text-slate-600", !isMatch);
      tab.classList.toggle("hover:bg-slate-50", !isMatch);
    });

    if (method === "pickup") {
      elements.pickupContent.classList.remove("hidden");
      elements.deliveryContent.classList.add("hidden");
    } else {
      elements.pickupContent.classList.add("hidden");
      elements.deliveryContent.classList.remove("hidden");
      syncRecipientFromCustomer();
    }
  };

  const bindEvents = () => {
    elements.backdrop?.addEventListener("click", close);
    elements.closeBtn?.addEventListener("click", close);

    elements.deliveryTabs.forEach(tab => {
      tab.addEventListener("click", () => switchDeliveryTab(tab.dataset.tab));
    });

    const customerName = getField("customerName");
    const customerPhone = getField("customerPhone");
    const customerEmail = getField("customerEmail");
    const recipientName = getField("recipientName");
    const recipientPhone = getField("recipientPhone");

    customerName?.addEventListener("input", () => {
      validateName(customerName, "Họ tên");
      syncRecipientFromCustomer();
    });
    customerPhone?.addEventListener("input", () => {
      validatePhone(customerPhone, "Số điện thoại");
      syncRecipientFromCustomer();
    });
    customerEmail?.addEventListener("input", () => validateEmail(customerEmail));

    recipientName?.addEventListener("input", () => {
      state.recipientAutoFilled = false;
      validateName(recipientName, "Tên người nhận");
    });
    recipientPhone?.addEventListener("input", () => {
      state.recipientAutoFilled = false;
      validatePhone(recipientPhone, "Số điện thoại người nhận");
    });

    elements.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateStep1()) return;
      showStep(2);
    });

    elements.backBtn?.addEventListener("click", () => showStep(1));
  };

  bindEvents();

  window.shoppingCheckoutController = {
    open,
    close
  };
})();
