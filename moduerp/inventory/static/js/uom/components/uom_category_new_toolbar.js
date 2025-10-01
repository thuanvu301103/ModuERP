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