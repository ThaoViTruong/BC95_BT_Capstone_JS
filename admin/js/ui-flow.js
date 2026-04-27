// js/admin/ui-flow.js

import { elements } from "./core.js";

export const renderProducts = (list) => {

  if (!list || list.length === 0) {
    elements.tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-10 text-slate-400">
          Chưa có sản phẩm
        </td>
      </tr>
    `;
    return;
  }

  elements.tableBody.innerHTML = list
    .map(
      (p) => `
        <tr class="border-b hover:bg-slate-50 transition">
          <td class="py-2">${p.id}</td>
          <td>${p.name}</td>
          <td class="font-semibold text-slate-900">$
            ${Number(p.price).toLocaleString()}
          </td>
          <td>${p.type}</td>
          <td class="space-x-2">
            <button onclick="window.editProduct('${p.id}')"
              class="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white transition">
              Sửa
            </button>
            <button onclick="window.deleteProduct('${p.id}')"
              class="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition">
              Xóa
            </button>
          </td>
        </tr>
      `
    )
    .join("");
};

export const showMessage = (text, type = "success") => {
  elements.message.innerText = text;
  elements.message.className =
    type === "error" ? "text-red-600 mt-2" : "text-green-600 mt-2";
};