export async function registerUomCategoryNewToolbarEvent(eventName, eventFunction) {
    if (eventName == "save") {
        const saveBtn = document.getElementById("save-btn");
        saveBtn.addEventListener("click", () => eventFunction() );
    }
}