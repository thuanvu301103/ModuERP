export async function getUomCategoryNewFormValue(name) {
    if (name == "data") {
        const uomCategoryNameInputElement = document.getElementById("uom-category-name-input");
        const uomCategoryName = uomCategoryNameInputElement.value;
        if (!uomCategoryName) {
            uomCategoryNameInputElement.focus();
            return null;
        }

        // Check if all field in uom table have been filled
        const tableBody = document.querySelector("#uom-table tbody");
        const rows = tableBody.querySelectorAll("tr");
        for (const row of rows) {
            const inputs = row.querySelectorAll("input[type='text'], input[type='number']");
            for (const input of inputs) {
                if (!input.value.trim()) {
                    input.focus();
                    return null;
                }
            }
        }
  
        // Get uoms
        const uoms = [];
        rows.forEach(row => {
            const name = row.querySelector('input[name="uom-name-input"]').value.trim();
            const uom_type = row.querySelector('select[name="uom-type-select"]').value;
            const factor = parseFloat(row.querySelector('input[name="uom-ratio-input"]').value);
            const is_default = row.querySelector('input[name="uom-default-input"]').checked;

            uoms.push({name, uom_type, factor, is_default});
        });
        return {"name": uomCategoryName.trim(), "uoms": uoms};
    }
}

export async function resetUomCategoryNewFormValue() {
    const uomCategoryNameInputElement = document.getElementById("uom-category-name-input");
    uomCategoryNameInputElement.value = "";

    const tableBody = document.querySelector("#uom-table tbody");
    tableBody.innerHTML = `
    <!-- Reference UoM -->
    <tr class="border-bottom border-bottom-1 border-blue-grey-5">
      <td class="text-start p-1">
        <input type="text" name="uom-name-input"
          class="form-control form-control-sm bg-dark text-white fw-light placeholder-blue-grey-5 border-0" 
          placeholder="Unit of Measure">
      </td>
      <td class="text-start p-1">
        <select name="uom-type-select" class="form-select form-select-sm bg-dark text-white border-0" disabled>
          <option value="reference" selected>Reference Unit</option>
          <option value="bigger">Bigger than Reference</option>
          <option value="smaller">Smaller than Reference</option>
        </select>
      </td>
      <td class="text-end p-1">
        <input type="number" name="uom-ratio-input"
          class="form-control form-control-sm bg-dark text-white placeholder-blue-grey-5 border-0"
          placeholder="Ratio" style="text-align: right;" value="1.0" readonly>
      </td>
      <td class="text-center p-1"><input name="uom-default-input" type="checkbox" class="form-check-input bg-dark" checked></td>
      <td class="text-center p-1"></td>
    </tr>
  `
}

document.addEventListener("DOMContentLoaded", async () => {
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
});