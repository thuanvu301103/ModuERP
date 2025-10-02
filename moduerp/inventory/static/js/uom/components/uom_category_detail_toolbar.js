export async function renderUomCategoryDetailToolbar(data) {
    const saveBtn = document.getElementById("save-btn");
    saveBtn.setAttribute("disabled", true);

    const itemTitleEle = document.getElementById("item-title");
    itemTitleEle.innerHTML = data.name;
}

export async function registerUomCategoryDetailToolbarEvent(eventName, eventFunction) {
    if (eventName == "reset") {
        const resetBtn = document.getElementById("reset-btn");
        resetBtn.addEventListener("click", async () => await eventFunction());
    }
}

export async function setUomCategoryListToolbarValue(name, value) {}

export async function getUomCategoryListToolbarValue(name) {}