// Load product list view using Fetch API
document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "/api/inventory/products/";
    const container = document.getElementById("product-list-view");
    const template = document.getElementById("product-card-template");
    const rowTemplate = document.getElementById("product-row-template");
    const current_pageElement = document.getElementById("current-page");
    const num_pagesElement = document.getElementById("num-pages");
    const totalElement = document.getElementById("total");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const galleryRadio = document.getElementById("gallery-view");
    const listRadio = document.getElementById("list-view");
    const checkedCount = document.getElementById("selected-count");
    const filterBtn = document.getElementById("filter-btn");
    const filterContainer = document.getElementById("filter-container");
    const filterApplyBtn = document.getElementById("apply-filter");

    let currentData = null;
    let currentView = "gallery";
    let currentDomain = null;

    async function fetchData(domain, page = 1) {
        let url = `${apiUrl}?page=${page}`;
        if (domain) url += `&${domain}`;
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
        const products = data.results || [];

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
        if (products.length == 0) {
            container.innerHTML = "Not found";
            return;
        }

        container.innerHTML = "";
        const wrapper = document.createElement("div");
        // Gallery View
        if (currentView === "gallery") {
            wrapper.className = "row g-0 p-1";
            products.forEach(p => {
                const clone = template.content.cloneNode(true);
                clone.querySelector(".product-image").src = p.image || "/static/icons/image.svg";
                clone.querySelector(".product-name").textContent = p.name;
                clone.querySelector(".product-price").textContent = `List price: ${p.list_price}`;
                wrapper.appendChild(clone);
            });

            updateCheckedCount(null);
        // List View
        } else if (currentView === "list") {
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
                        <th class="text-start px-3" style="width: 10%;">Code</th>
                        <th class="text-start px-3" style="width: 15%;">Type</th>
                        <th class="text-start px-3" style="width: 15%;">Category</th>
                        <th class="text-end px-3" style="width: 15%;">List Price</th>
                        <th class="text-end px-3" style="width: 15%;">Standard Price</th>
                    </tr>
                </thead>
            `;

            const tbody = document.createElement("tbody");
            tbody.className = "table-group-divider";

            products.forEach(p => {
                const clone = rowTemplate.content.cloneNode(true);

                clone.querySelector(".select-item").value = p.id;
                clone.querySelector(".product-name").textContent = p.name;
                clone.querySelector(".product-code").textContent = p.default_code || "";
                clone.querySelector(".product-type").textContent = p.product_type || "";
                clone.querySelector(".product-category").textContent = p.category || "";
                clone.querySelector(".product-list-price").textContent = p.list_price;
                clone.querySelector(".product-standard-price").textContent = p.standard_price || "";

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
        }

        container.appendChild(wrapper);
    }

    async function loadData(domain, page = 1) {
        try {
            const data = await fetchData(domain, page);
            currentData = data;
            renderData(currentData);
        } catch (error) {
            console.error("Fetch error:", error);
            container.textContent = "Error loading data.";
        }
    }

    // Prev/Next
    prevBtn.addEventListener("click", () => {
        if (!prevBtn.disabled) loadData(currentDomain, parseInt(prevBtn.dataset.page));
        updateCheckedCount(null);
    });

    nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) loadData(currentDomain, parseInt(nextBtn.dataset.page));
        updateCheckedCount(null);
    });

    // View Radio
    galleryRadio.addEventListener("change", () => {
        currentView = "gallery";
        if (currentData) renderData(currentData);
    });
    listRadio.addEventListener("change", () => {
        currentView = "list";
        if (currentData) renderData(currentData);
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
                // Call htmx load product list
                loadData(currentDomain, 1);
        } else {
            currentDomain = null;
            loadData(currentDomain, 1);
        }
    });

    loadData(currentDomain, 1);
});

