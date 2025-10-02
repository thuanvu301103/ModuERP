import { sortUomCategoryObject } from '../utils/sort_uoms.js';
import { getUomCategory } from "../api/get_uom_category.js";
import { getIdFromUrl } from '../utils/get_id_from_url.js';
import { renderUomCategoryDetailToolbar, registerUomCategoryDetailToolbarEvent } from "../components/uom_category_detail_toolbar.js";
import { renderUomCategoryDetailView } from '../components/uom_category_detail_view.js';

async function load(id) {
    try {
        const data = await getUomCategory(id);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function render(data) {
    renderUomCategoryDetailToolbar(data);
    renderUomCategoryDetailView(data);
}

async function registerEvent(state) {
    registerUomCategoryDetailToolbarEvent("reset", async () => {
        const data = await load(state.id);
        await render(data);
        state.oldData = sortUomCategoryObject(data);
        state.currentData = sortUomCategoryObject(data);
    });
}


document.addEventListener("DOMContentLoaded", async () => {

    let state = {
        id: getIdFromUrl(),
        oldData: null,
        currentData: null
    }
    
    const data = await load(state.id);
    state.oldData = await sortUomCategoryObject(data);
    state.currentData = await sortUomCategoryObject(data);
    await render(data);
    await registerEvent(state);
});