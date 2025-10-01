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
    }
}