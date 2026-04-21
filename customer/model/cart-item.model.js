class CartItem {
  constructor(product, quantity = 1) {
    this.product = product instanceof Product ? product : new Product(product);
    this.quantity = Math.max(1, Number(quantity) || 1);
  }

  increase(step = 1) {
    const s = Number(step) || 1;
    this.quantity = Math.max(1, this.quantity + s);
  }

  decrease(step = 1) {
    const s = Number(step) || 1;
    this.quantity = Math.max(1, this.quantity - s);
  }

  setQuantity(quantity) {
    const q = Number(quantity);
    this.quantity = Math.max(1, Number.isFinite(q) ? q : 1);
  }

  get subtotal() {
    return (Number(this.product.price) || 0) * (Number(this.quantity) || 0);
  }
}

window.CartItem = CartItem;
