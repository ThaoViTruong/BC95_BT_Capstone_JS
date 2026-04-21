class Cart {
  constructor() {
    this.items = [];
  }

  findIndexByProductId(productId) {
    const id = String(productId ?? "");
    return this.items.findIndex((it) => String(it.product.id) === id);
  }

  addProduct(product) {
    const p = product instanceof Product ? product : new Product(product);
    const idx = this.findIndexByProductId(p.id);
    if (idx === -1) {
      this.items.push(new CartItem(p, 1));
    } else {
      this.items[idx].increase(1);
    }
  }

  decreaseProduct(productId, step = 1) {
    const id = String(productId ?? "");
    if (!id) return;
    const idx = this.findIndexByProductId(id);
    if (idx === -1) return;

    const s = Math.max(1, Number(step) || 1);
    const current = Number(this.items[idx].quantity) || 1;
    if (current <= 1) return;
    this.items[idx].decrease(Math.min(s, current - 1));
  }

  removeProduct(productId) {
    const id = String(productId ?? "");
    if (!id) return;
    const idx = this.findIndexByProductId(id);
    if (idx === -1) return;
    this.items.splice(idx, 1);
  }

  setProductQuantity(productId, quantity) {
    const id = String(productId ?? "");
    if (!id) return;
    const idx = this.findIndexByProductId(id);
    if (idx === -1) return;

    const q = Number(quantity);
    if (!Number.isFinite(q) || q <= 0) {
      this.items.splice(idx, 1);
      return;
    }
    this.items[idx].setQuantity(q);
  }

  get totalQuantity() {
    return this.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  }

  get totalPrice() {
    return this.items.reduce((sum, it) => sum + (Number(it.subtotal) || 0), 0);
  }
}

window.Cart = Cart;
