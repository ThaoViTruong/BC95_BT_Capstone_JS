// js/admin/crud-flow.js

import { BASE_URL, state, elements } from "./core.js";
import { renderProducts, showMessage } from "./ui-flow.js";

const getFormData = () => ({
  name: elements.name.value.trim(),
  price: Number(elements.price.value),
  img: elements.img.value.trim(),
  screen: elements.screen.value.trim(),
  backCamera: elements.backCamera.value.trim(),
  frontCamera: elements.frontCamera.value.trim(),
  desc: elements.desc.value.trim(),
  type: elements.type.value,
});

// ================= GET =================
export const fetchProducts = async () => {
  const res = await axios.get(BASE_URL);
  state.productList = res.data;
  renderProducts(state.productList);
};

// ================= CREATE =================
export const createProduct = async () => {
  try {
    const data = getFormData();
    if (!validate(data)) return;

    await axios.post(BASE_URL, data);

    showMessage("✅ Thêm thành công");
    elements.form.reset();
    fetchProducts();

  } catch (error) {
    console.log(error);
    showMessage("❌ Có lỗi xảy ra khi tạo mới sản phẩm", "error");
  }
};

// ================= DELETE =================
window.deleteProduct = async (id) => {

  const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
  if (!isConfirm) return;

  try {
    await axios.delete(`${BASE_URL}/${id}`);

    showMessage("✅ Xóa sản phẩm thành công");
    fetchProducts();

  } catch (error) {
    console.log(error);
    showMessage("❌ Có lỗi xảy ra khi xóa sản phẩm", "error");
  }
};

// ================= EDIT =================
window.editProduct = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  const p = res.data;

  state.editingId = id;

  elements.name.value = p.name;
  elements.price.value = p.price;
  elements.img.value = p.img;
  elements.screen.value = p.screen;
  elements.backCamera.value = p.backCamera;
  elements.frontCamera.value = p.frontCamera;
  elements.desc.value = p.desc;
  elements.type.value = p.type;

  elements.btnSave.classList.add("hidden");
  elements.btnUpdate.classList.remove("hidden");
};

// ================= UPDATE =================
export const updateProduct = async () => {
  try {
    const data = getFormData();
    if (!validate(data)) return;

    await axios.put(`${BASE_URL}/${state.editingId}`, data);

    showMessage("✅ Cập nhật thành công");

    elements.btnSave.classList.remove("hidden");
    elements.btnUpdate.classList.add("hidden");

    elements.form.reset();
    fetchProducts();

  } catch (error) {
    console.log(error);
    showMessage("❌ Có lỗi xảy ra khi cập nhật", "error");
  }
};

// ================= SEARCH =================
export const searchProduct = () => {
  const keyword = elements.keyword.value.toLowerCase();
  const filtered = state.productList.filter((p) =>
    p.name.toLowerCase().includes(keyword)
  );
  renderProducts(filtered);
};

// ================= SORT =================
export const sortByPrice = (order) => {
  const sorted = [...state.productList].sort((a, b) =>
    order === "asc" ? a.price - b.price : b.price - a.price
  );
  renderProducts(sorted);
};

// ================= VALIDATION =================
const validate = (p) => {
  if (!p.name || p.price <= 0 || !p.type) {
    showMessage("❌ Vui lòng nhập đầy đủ thông tin", "error");
    return false;
  }
  return true;
};

