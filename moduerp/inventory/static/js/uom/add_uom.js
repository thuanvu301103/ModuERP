const tableBody = document.querySelector("#uom-table tbody");
const addBtn = document.getElementById("add-uom-btn");
const uomTemplate = document.getElementById("uom-row-template");

// Make sure only one checkbox is checked at a time
tableBody.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    tableBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb !== e.target) cb.checked = false;
    });
  }
})

// Add new UOM row
addBtn.addEventListener("click", () => {
  
    // Check all input before add new row
    const rows = tableBody.querySelectorAll("tr");
    for (const row of rows) {
        const inputs = row.querySelectorAll("input[type='text'], input[type='number']");
        for (const input of inputs) {
            if (!input.value.trim()) {
                input.focus();
                return; // Stop
            }
        }
    }
  
    const newRow = uomTemplate.content.cloneNode(true);
    const appendedRow = newRow.querySelector("tr");
    tableBody.appendChild(appendedRow);

    appendedRow.querySelector(".remove-btn").addEventListener("click", () => {
        appendedRow.remove();
    });
});

