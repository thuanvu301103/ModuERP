import { sortUomCategoryObject } from '../utils/sort_uoms.js';
import { isUomCategoryEqual } from '../utils/is_uom_category_equal.js';
import { getIdFromUrl } from '../utils/get_id_from_url.js';
import { getUomCategory } from "../api/get_uom_category.js";
import { putUomCategory } from '../api/put_uom_category.js';
import { showToast } from '../../components/toast.js'
import { 
    renderUomCategoryDetailToolbar, registerUomCategoryDetailToolbarEvent, 
    setUomCategoryDetailToolbarValue 
} from "../components/uom_category_detail_toolbar.js";
import { 
    renderUomCategoryDetailView, registerUomCategoryDetailViewEvent,
    getUomCategoryDetailViewValue 
} from '../components/uom_category_detail_view.js';

async function load(id) {
    try {
        const data = await getUomCategory(id);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function update(id, data) {
    try {
        const response = await putUomCategory(id, data);
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        showToast({
          title: "Success",
          message: `Units of Measure Category "${data.name}" updated successfully`,
          type: "success",
          delay: 5000
        });
        const returnData = await response.json();
        return returnData;
    } catch (error) {
      console.log(error);
        showToast({
          title: "Error",
          message: error || "Something went wrong while creating category",
          type: "danger",
          delay: 5000
        });
    }
}

async function render(data) {
    renderUomCategoryDetailToolbar(data);
    renderUomCategoryDetailView(data);
}

async function registerEvent(state) {
    registerUomCategoryDetailToolbarEvent("reset", async () => {
        const data = await load(state.id);
        state.oldData = sortUomCategoryObject(data);
        state.currentData = sortUomCategoryObject(data);
        await render(state.oldData);
    });
    registerUomCategoryDetailToolbarEvent("save", async () => {
        const data = await update(state.id, state.currentData);
        state.oldData = await sortUomCategoryObject(data);
        state.currentData = await sortUomCategoryObject(data);
        await render(state.oldData);
    });
    registerUomCategoryDetailViewEvent("on change", async () => {
        // Get current data
        state.currentData = await getUomCategoryDetailViewValue("data");
        // Compare old and current Data
        if (!isUomCategoryEqual(state.currentData, state.oldData)) {
            await setUomCategoryDetailToolbarValue("save active", true);
        } else {
            await setUomCategoryDetailToolbarValue("save active", false);
        }
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
    await render(state.oldData);
    await registerEvent(state);
});