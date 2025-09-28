function sortUom(data) {
    return {
        ...data,
        uoms: [...data.uoms].sort((a, b) => {
            if (a.uom_type === "reference" && b.uom_type !== "reference") return -1;
            if (b.uom_type === "reference" && a.uom_type !== "reference") return 1;
            return b.factor - a.factor;
        })
    };
}


function isEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== "object" || obj1 === null ||
        typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length < obj2.length) return false;
    }

    const keys1 = Object.keys(obj1);
    for (let key of keys1) {
        if (!isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}


function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
        const id = parseInt(params.get('id'), 10);
        if (!isNaN(id)) return id;
    }

    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    if (!isNaN(id)) return id;

    return null;
}

async function fetchData(id) {
    const api = `/api/inventory/uom-categories/${id}/`;
    const response = await fetch(api, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
}

let oldData = null;
let currentData = null;

function updateData() {
    const nameInputEle = document.getElementById("uom-category-name-input");
    const tableBody = document.getElementById("uom-table").querySelector("tbody");

    const uoms = [];
    tableBody.querySelectorAll("tr").forEach(row => {
        uoms.push({
            id: parseInt(row.dataset.uomId, 10),
            name: row.querySelector('[name="uom-name-input"]').value,
            uom_type: row.querySelector('[name="uom-type-select"]').value,
            factor: parseFloat(row.querySelector('[name="uom-ratio-input"]').value) || 1,
            is_default: row.querySelector('[name="uom-default-input"]').checked,
        });
    });

    currentData = {
        id: oldData.id,
        name: nameInputEle.value,
        uoms: uoms
    };
    if (!isEqual(currentData, oldData)) { 
        document.getElementById("save-btn").removeAttribute("disabled");
    } else {
        document.getElementById("save-btn").setAttribute("disabled", true);
    }
}

function renderUI(data) {
    const nameInputEle = document.getElementById("uom-category-name-input");
    nameInputEle.value = oldData.name;
    nameInputEle.addEventListener("change", (e) => {
        updateData();
    });
    
    const saveBtn = document.getElementById("save-btn");
    saveBtn.setAttribute("disabled", true);

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
            uomNameInput.addEventListener("change", (e) => {
                updateData();
            });
            const uomDefaultInput = referenceUom.querySelector('[name="uom-default-input"]');
            uomDefaultInput.checked = uom.is_default;
            uomDefaultInput.addEventListener("change", (e) => {
                updateData();
            });
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
                updateData();
            });
            row.addEventListener("change", (e) => {
                updateData();
            });
            tableBody.appendChild(clone);
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data
    const categoryId = getIdFromUrl();
    const data = await fetchData(categoryId);
    oldData = sortUom(data);
    currentData = sortUom(data);

    // Render UI
    const itemTitleEle = document.getElementById("item-title");
    itemTitleEle.innerHTML = oldData.name;
    renderUI(currentData);

    const tableBody = document.querySelector("#uom-table tbody");
    // Make sure only one checkbox is checked at a time
    tableBody.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            tableBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                console.log(cb)
                if (cb !== e.target) cb.checked = false;
            });
        }
        updateData();
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
        updateData();

        appendedRow.querySelector(".remove-btn").addEventListener("click", () => {
            appendedRow.remove();
            updateData();
        });
    });

    const resetBtn = document.getElementById("reset-btn");
    resetBtn.addEventListener("click", async () => {
        const data = await fetchData(categoryId);
        oldData = sortUom(data);
        currentData = sortUom(data);
        itemTitleEle.innerHTML = oldData.name;
        renderUI(currentData);
    });
});

