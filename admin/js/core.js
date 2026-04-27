// js/admin/core.js

export const BASE_URL =
  "https://69ca6795ba5984c44bf318fe.mockapi.io/api/v1/phone";

export const state = {
  productList: [],
  editingId: null,
};

export const elements = {};

export const setElements = () => {
  elements.form = document.getElementById("productForm");
  elements.name = document.getElementById("name");
  elements.price = document.getElementById("price");
  elements.img = document.getElementById("img");
  elements.screen = document.getElementById("screen");
  elements.backCamera = document.getElementById("backCamera");
  elements.frontCamera = document.getElementById("frontCamera");
  elements.desc = document.getElementById("desc");
  elements.type = document.getElementById("type");

  elements.btnSave = document.getElementById("btnSave");
  elements.btnUpdate = document.getElementById("btnUpdate");
  elements.btnReset = document.getElementById("btnReset");

  elements.keyword = document.getElementById("keyword");
  elements.btnSearch = document.getElementById("btnSearch");

  elements.tableBody = document.getElementById("productTableBody");
  elements.message = document.getElementById("message");
};