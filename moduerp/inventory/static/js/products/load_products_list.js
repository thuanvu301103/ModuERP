// Load product list view using Fetch API
document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "/api/inventory/products/";
    const container = document.getElementById("product-list-view");
    const template = document.getElementById("product-card-template");
    const current_pageElement = document.getElementById("current-page");
    const num_pagesElement = document.getElementById("num-pages");
    const totalElement = document.getElementById("total");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    async function loadData(page=1) {
        try {
            // Fetch product data from API
            const response = await fetch(`${apiUrl}?page=${page}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
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

            // Generate product list view
            container.innerHTML = "";
            const row = document.createElement("div");
            row.className = "row g-0 p-1";

            products.forEach(p => {
                const clone = template.content.cloneNode(true);
                clone.querySelector(".product-image").src = p.image || "/static/icons/image.svg";
                clone.querySelector(".product-name").textContent = p.name;
                clone.querySelector(".product-price").textContent = `List price: ${p.list_price}`;
                row.appendChild(clone);
            });

            container.appendChild(row);

        } catch (error) {
            console.error("Fetch error:", error);
            container.textContent = "Error loading data.";
        }
    }

    // Event listener cho nút Prev/Next
    prevBtn.addEventListener("click", () => {
        if (!prevBtn.disabled) loadData(parseInt(prevBtn.dataset.page));
    });

    nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) loadData(parseInt(nextBtn.dataset.page));
    });

    loadData(1);
});

