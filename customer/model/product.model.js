class Product {
  constructor({ id, name, price, img, type } = {}) {
    this.id = String(id ?? "");
    this.name = String(name ?? "");
    this.price = Number(price ?? 0);
    this.img = String(img ?? "");
    this.type = String(type ?? "");
  }
}

window.Product = Product;
