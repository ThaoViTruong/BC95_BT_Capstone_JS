class Product {
  constructor({
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type,
  } = {}) {
    this.id = String(id ?? "");
    this.name = String(name ?? "");
    this.price = Number(price ?? 0);
    this.screen = String(screen ?? "");
    this.backCamera = String(backCamera ?? "");
    this.frontCamera = String(frontCamera ?? "");
    this.img = String(img ?? "");
    this.desc = String(desc ?? "");
    this.type = String(type ?? "");
  }
}

window.Product = Product;
