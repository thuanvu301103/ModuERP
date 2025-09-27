
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