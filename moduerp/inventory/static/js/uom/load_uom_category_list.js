function sortUom(data) {
    const sortedUom = [...data].sort((a, b) => b.factor - a.factor);
    return sortedUom
}

// Load uom categroy using Fetch API
document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "/api/inventory/uom-categories/";
    const container = document.getElementById("product-list-view");
    const rowTemplate = document.getElementById("uom-category-row-template");
    const current_pageElement = document.getElementById("current-page");
    const num_pagesElement = document.getElementById("num-pages");
    const totalElement = document.getElementById("total");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const checkedCount = document.getElementById("selected-count");
    // Filter and Order
    const filterBtn = document.getElementById("filter-btn");
    const filterContainer = document.getElementById("filter-container");
    const orderBtn = document.getElementById("order-btn");
    const orderContainer = document.getElementById("order-container");

    let currentDomain = null;
    let currentOrder = null;

    async function fetchData(domain, order, page = 1) {
        let url = `${apiUrl}?page=${page}`;
        if (domain) url += `&${domain}`;
        if (order) url += `&${order}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return data;
    }

    function updateCheckedCount(itemCheckboxes) {
        let count = 0
        if (!itemCheckboxes) count = 0;
        else count = [...itemCheckboxes].filter(cb => cb.checked).length;
        checkedCount.textContent = count;
    }

    function renderData(data) {
        const uomCategorys = data.results || [];

        // Update toolbar
        if (!data.meta.has_previous) prevBtn.classList.add("disabled");
        else prevBtn.classList.remove("disabled");
        if (!data.meta.has_next) nextBtn.classList.add("disabled");
        else nextBtn.classList.remove("disabled");
        prevBtn.dataset.page = data.meta.previous_page_number || 1;
        nextBtn.dataset.page = data.meta.next_page_number || data.meta.num_pages;

        current_pageElement.textContent = data.meta.current_page || "0";
        num_pagesElement.textContent = data.meta.num_pages || "0";
        totalElement.textContent = data.meta.total || "0";

        // Render UI
        if (uomCategorys.length == 0) {
            container.innerHTML = "Not found";
            return;
        }

        container.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.className = "";
        wrapper.style.overflowY = "auto";
        wrapper.style.maxHeight = "83vh";

        const table = document.createElement("table");
        table.className = "table table-dark table-hover table-striped align-middle";

        table.innerHTML = `
            <thead style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="text-center" style="width: 5%;">
                        <input type="checkbox" id="select-all" class="form-check-input bg-dark border-indigo-5">
                    </th>
                    <th class="text-start px-3" style="width: 25%;">Name</th>
                    <th class="text-start px-3" style="width: 70%;">Units of Measure</th>
                </tr>
            </thead>
        `;

        const tbody = document.createElement("tbody");
        tbody.className = "table-group-divider";

        uomCategorys.forEach(p => {
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
                console.log("click row");
                // Avoid trigger when click on input
                if (e.target.tagName.toLowerCase() !== 'input') {
                    const currentPath = window.location.pathname;
                    const basePath = currentPath.endsWith('/') ? currentPath : currentPath + '/';
                    window.location.href = `${basePath}${p.id}/`;
                }
            });

            tbody.appendChild(clone);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);

        // Add listener to checkboxs
        const selectAll = wrapper.querySelector("#select-all");
        const itemCheckboxes = wrapper.querySelectorAll(".select-item");

            if (selectAll) {
                selectAll.addEventListener("change", function () {
                    itemCheckboxes.forEach(cb => cb.checked = this.checked);
                    updateCheckedCount(itemCheckboxes);
                });
            }
            itemCheckboxes.forEach(cb => {
                cb.addEventListener("change", function () {
                    if (!this.checked) selectAll.checked = false;
                    else if ([...itemCheckboxes].every(cb => cb.checked)) selectAll.checked = true;
                    updateCheckedCount(itemCheckboxes);
                });
            });

        container.appendChild(wrapper);
    }

    async function loadData(domain, order, page = 1) {
        try {
            const data = await fetchData(domain, order, page);
            renderData(data);
        } catch (error) {
            console.error("Fetch error:", error);
            container.textContent = "Error loading data.";
        }
    }

    // Prev/Next
    prevBtn.addEventListener("click", () => {
        if (!prevBtn.disabled) loadData(currentDomain, currentOrder, parseInt(prevBtn.dataset.page));
        updateCheckedCount(null);
    });

    nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) loadData(currentDomain, currentOrder, parseInt(nextBtn.dataset.page));
        updateCheckedCount(null);
    });

    
    filterBtn.addEventListener("click", () => {
        if (filterBtn.classList.contains("active")) {
            let domain = [];

            filterContainer.querySelectorAll(".filter-row").forEach(row => {
                let field = row.querySelector('[name="field"]').value;
                let operator = row.querySelector('[name="operator"]').value;
                let value = row.querySelector('[name="value"]').value;

                if (value) {
                    domain.push([field, operator, isNaN(value) ? value : Number(value)]);
                    }
                });

            // Encode domain to JSON string
            let params = new URLSearchParams();
            params.append("domain", JSON.stringify(domain));
            currentDomain = params.toString();
                
            loadData(currentDomain, currentOrder, 1);
        } else {
            currentDomain = null;
            loadData(currentDomain, currentOrder, 1);
        }
    });

    orderBtn.addEventListener("click", () => {
        if (orderBtn.classList.contains("active")) {
            let orderArr = [];

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
            currentOrder = params.toString();
            loadData(currentDomain, currentOrder, 1);
        } else {
            currentOrder = null;
            loadData(currentDomain, currentOrder, 1);
        }
    });
    
    loadData(currentDomain, currentOrder, 1);
});

