
  const container = document.getElementById("filter-container");
  const template = document.getElementById("filter-template");
  const addBtn = document.getElementById("add-filter");

  const operators = {
    string: [
      { value: "=", label: "=" },
      { value: "!=", label: "≠" },
      { value: "ilike", label: "contains" },
      { value: "not ilike", label: "not contains" }
    ],
    number: [
      { value: "=", label: "=" },
      { value: "!=", label: "≠" },
      { value: ">", label: ">" },
      { value: "<", label: "<" },
      { value: ">=", label: "≥" },
      { value: "<=", label: "≤" }
    ],
    choice: [
      { value: "=", label: "=" },
      { value: "!=", label: "≠" }
    ],
    boolean: [
      { value: "=", label: "=" }
    ]
  };

  
  function updateOperators(row) {
    const fieldSelect = row.querySelector(".field-select");
    const operatorSelect = row.querySelector(".operator-select");

    const selected = fieldSelect.options[fieldSelect.selectedIndex];
    const type = selected.getAttribute("data-type");
    const ops = operators[type] || [];

    operatorSelect.innerHTML = "";
    ops.forEach(op => {
      const option = document.createElement("option");
      option.value = op.value;
      option.textContent = op.label;
      operatorSelect.appendChild(option);
    });
  }

  // Event delegation
  container.addEventListener("change", (e) => {
    if (e.target.classList.contains("field-select")) {
      const row = e.target.closest(".filter-row");
      updateOperators(row);
    }
  });

  container.addEventListener("click", (e) => {
    if (e.target.closest(".delete-filter")) {
      e.target.closest(".filter-row").remove();
    }
  });

  addBtn.addEventListener("click", () => {
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
    const newRow = container.lastElementChild;
    updateOperators(newRow);
  });