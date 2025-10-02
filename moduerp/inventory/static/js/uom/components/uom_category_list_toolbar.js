export async function renderUomCategoryListToolbar(data) {
    
    const prevBtn = document.getElementById("toolbar-prev-btn");
    if (!data.has_previous) prevBtn.classList.add("disabled");
    else prevBtn.classList.remove("disabled");
    
    const nextBtn = document.getElementById("toolbar-next-btn");    
    if (!data.has_next) nextBtn.classList.add("disabled");
    else nextBtn.classList.remove("disabled");

    prevBtn.dataset.page = data.previous_page_number || 1;
    nextBtn.dataset.page = data.next_page_number || data.num_pages;

    const currentPageEle = document.getElementById("toolbar-current-page");
    currentPageEle.textContent = data.current_page || "0";

    const numPagesElement = document.getElementById("toolbar-num-pages");
    numPagesElement.textContent = data.num_pages || "0";

    const totalElement = document.getElementById("toolbar-total");
    totalElement.textContent = data.total || "0";

    const checkedCount = document.getElementById("selected-count");
    checkedCount.textContent = 0;
}

export async function registerUomCategoryListToolbarEvent(eventName, eventFunction) {
    if (eventName == "previous page") {
        const prevBtn = document.getElementById("toolbar-prev-btn");
        prevBtn.addEventListener("click", () => {
            if (!prevBtn.disabled) eventFunction(parseInt(prevBtn.dataset.page));
        });
    } else if (eventName == "next page") {
        const nextBtn = document.getElementById("toolbar-next-btn");
        nextBtn.addEventListener("click", () => {
            if (!nextBtn.disabled) eventFunction(parseInt(nextBtn.dataset.page));
        });
    } else if (eventName == "filter") {
        const filterBtn = document.getElementById("filter-btn");
        filterBtn.addEventListener("click", async () => await eventFunction());
    } else if (eventName == "order") {
        const orderBtn = document.getElementById("order-btn");
        orderBtn.addEventListener("click", async () => await eventFunction());
    }
}

export async function setUomCategoryListToolbarValue(name, value) {
    if (name == "count select") {
        const checkedCount = document.getElementById("selected-count");
        checkedCount.textContent = value;
    }
}

export async function getUomCategoryListToolbarValue(name) {
    if (name == "is filter active") {
        const filterBtn = document.getElementById("filter-btn");
        return filterBtn.classList.contains("active")
    } else if (name == "is order active") {
        const orderBtn = document.getElementById("order-btn");
        return orderBtn.classList.contains("active")
    }
}