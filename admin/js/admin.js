// js/admin.js

import { setElements, elements } from "./core.js";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  searchProduct,
  sortByPrice,
} from "./crud-flow.js";

document.addEventListener("DOMContentLoaded", () => {
  setElements();
  fetchProducts();

  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    createProduct();
  });

  elements.btnUpdate.addEventListener("click", updateProduct);
  elements.btnSearch.addEventListener("click", searchProduct);

  // optional sort
  window.sortAsc = () => sortByPrice("asc");
  window.sortDesc = () => sortByPrice("desc");
});