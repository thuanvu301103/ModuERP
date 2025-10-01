import {sortUom} from '../utils/sort_uoms.js';

export async function renderUomCategoryListView(data) {
    const table = document.getElementById("uom-category-list-view");
    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = '';
    const rowTemplate = document.getElementById("uom-category-row-template");

    data.forEach(p => {
        const sortedUoms = sortUom(p.uoms); 
        const clone = rowTemplate.content.cloneNode(true);
            
        clone.querySelector(".select-item").value = p.id;
        clone.querySelector(".uom-category-name").textContent = p.name;
            
        const uomListEl = clone.querySelector(".uom-list");
        uomListEl.innerHTML = "";
        sortedUoms.forEach(uom => {
            const badge = document.createElement("span");
            badge.classList.add("badge", "me-1");
            badge.textContent = uom.name;

            if (uom.is_default) badge.classList.add("bg-success");
            else badge.classList.add("bg-indigo-5");

            uomListEl.appendChild(badge);
        });

        const tr = clone.querySelector('tr');
        tr.addEventListener('click', (e) => {
            // Avoid trigger when click on input
            if (e.target.tagName.toLowerCase() !== 'input') {
                const currentPath = window.location.pathname;
                const basePath = currentPath.endsWith('/') ? currentPath : currentPath + '/';
                window.location.href = `${basePath}${p.id}/`;
            }
        });

        tableBody.appendChild(clone);
    });

    // Add listener to checkboxs
    const selectAll = table.querySelector("#select-all");
    const itemCheckboxes = table.querySelectorAll(".select-item");
    
    if (selectAll) {
        selectAll.checked = false;
        selectAll.addEventListener("change", function () {
            itemCheckboxes.forEach(cb => cb.checked = this.checked);
        });
    }
    itemCheckboxes.forEach(cb => {
        cb.checked = false;
        cb.addEventListener("change", function () {
            if (!this.checked) selectAll.checked = false;
            else if ([...itemCheckboxes].every(cb => cb.checked)) selectAll.checked = true;
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

export async function getUomCategoryListViewValue(name) {
    if (name == "count select") {
        const table = document.getElementById("uom-category-list-view");
        const itemCheckboxes = table.querySelectorAll(".select-item");
        let count = 0
        if (!itemCheckboxes) count = 0;
        else count = [...itemCheckboxes].filter(cb => cb.checked).length;
        return count
    }
}