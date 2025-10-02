document.addEventListener("DOMContentLoaded", async () => {
  const orderContainer = document.getElementById("order-container");
  const orderTemplate = document.getElementById("order-template");
  const addOrderBtn = document.getElementById("add-order");

  orderContainer.addEventListener("click", (e) => {
    if (e.target.closest(".delete-order")) {
      e.target.closest(".order-row").remove();
    }
  });

  addOrderBtn.addEventListener("click", () => {
    const clone = orderTemplate.content.cloneNode(true);
    orderContainer.appendChild(clone);
  });
});

export async function getUomCategoryListModalOrderValue(name) {
  if (name == "ordering") {
    let orderArr = [];
    const orderContainer = document.getElementById("order-container");
    orderContainer.querySelectorAll(".order-row").forEach(row => {
      let field = row.querySelector('[name="field"]').value;
      let value = row.querySelector('[name="order"]').value;
      const expr = value === "desc" ? `-${field}` : field;
      orderArr.push(expr);
    });
    // Encode order to JSON string
    const params = new URLSearchParams();
    if (orderArr.length) {
      params.append("ordering", orderArr.join(","));
    }
    return params.toString();
  }
}