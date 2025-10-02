export async function renderUomCategoryDetailView(data) {
    const nameInputEle = document.getElementById("uom-category-name-input");
    nameInputEle.value = data.name;

    const referenceUom = document.getElementById("reference-uom");
    const tableBody = document.getElementById("uom-table").querySelector("tbody");
    tableBody.innerHTML = '';
    tableBody.appendChild(referenceUom);
    const rowTemplate = document.getElementById("uom-row-template");

    data.uoms.forEach(uom => {
        if (uom.uom_type == "reference") {
            referenceUom.dataset.uomId = uom.id;
            const uomNameInput = referenceUom.querySelector('[name="uom-name-input"]');
            uomNameInput.value = uom.name;

            const uomDefaultInput = referenceUom.querySelector('[name="uom-default-input"]');
            uomDefaultInput.checked = uom.is_default;
        } else {
            const clone = rowTemplate.content.cloneNode(true);
            const row = clone.querySelector("tr");
            row.dataset.uomId = uom.id;
            clone.querySelector('[name="uom-name-input"]').value = uom.name;
            clone.querySelector('[name="uom-type-select"]').value = uom.uom_type;
            clone.querySelector('[name="uom-ratio-input"]').value = uom.factor;
            clone.querySelector('[name="uom-default-input"]').checked = uom.is_default;
            clone.querySelector(".remove-btn").addEventListener("click", () => {
                row.remove();
            });
            tableBody.appendChild(clone);
        }
    });

    // Make sure only one checkbox is checked at a time
    tableBody.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            tableBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                console.log(cb)
                if (cb !== e.target) cb.checked = false;
            });
        }
    })

    const addBtn = document.getElementById("add-uom-btn");
    const uomTemplate = document.getElementById("uom-row-template");
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
}

export async function registerUomCategoryListViewEvent(eventName, eventFunction) {
    if (eventName == "on select") {
        const table = document.getElementById("uom-category-list-view");
        const selectAll = table.querySelector("#select-all");
        const itemCheckboxes = table.querySelectorAll(".select-item");
    
        if (selectAll) selectAll.addEventListener("change", eventFunction);
        
        itemCheckboxes.forEach(cb => {
            cb.addEventListener("change", eventFunction);
        });
    }
}