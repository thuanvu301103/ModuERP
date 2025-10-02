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
    } else if (eventName == "save") {
        const saveBtn = document.getElementById("save-btn");
        saveBtn.addEventListener("click", async () => await eventFunction());
    }
}

export async function setUomCategoryDetailToolbarValue(name, value) {
    if (name == "save active") {
        const saveBtn = document.getElementById("save-btn");
        if (value) saveBtn.removeAttribute("disabled");
        else saveBtn.setAttribute("disabled", true);
    }
}

export async function getUomCategoryListToolbarValue(name) {}