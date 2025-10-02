import { getUomCategoryList } from "../api/get_uom_category_list.js";
import { 
    renderUomCategoryListToolbar, registerUomCategoryListToolbarEvent, 
    setUomCategoryListToolbarValue, getUomCategoryListToolbarValue,
} from "../components/uom_category_list_toolbar.js";
import { renderUomCategoryListView, registerUomCategoryListViewEvent, getUomCategoryListViewValue } from '../components/uom_category_list_view.js';
import { getUomCategoryListModalFilterValue } from '../components/uom_category_list_modal_filter.js';
import { getUomCategoryListModalOrderValue } from '../components/uom_category_list_modal_order.js';


async function load(domain, order, page) {
    try {
        const data = await getUomCategoryList(domain, order, page);
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function render(data) {
    renderUomCategoryListToolbar(data.meta);
    renderUomCategoryListView(data.results);
}

async function registerEvent(state) {
    await registerUomCategoryListToolbarEvent("previous page", async (prevPage) => {
        const data = await load(state.currentDomain, state.currentOrder, prevPage);
        render(data);
        await registerUomCategoryListViewEvent("on select", async () => {
            const count = await getUomCategoryListViewValue("count select");
            await setUomCategoryListToolbarValue("count select", count);
        });
    });
    await registerUomCategoryListToolbarEvent("next page", async (nextPage) => {
        const data = await load(state.currentDomain, state.currentOrder, nextPage);
        render(data);
        await registerUomCategoryListViewEvent("on select", async () => {
            const count = await getUomCategoryListViewValue("count select");
            await setUomCategoryListToolbarValue("count select", count);
        });
    });

    await registerUomCategoryListViewEvent("on select", async () => {
        const count = await getUomCategoryListViewValue("count select");
        setUomCategoryListToolbarValue("count select", count);
    });

    await registerUomCategoryListToolbarEvent("filter", async () => {
        if (await getUomCategoryListToolbarValue("is filter active")) {
            state.currentDomain = await getUomCategoryListModalFilterValue("domain");
        } else {
            state.currentDomain = null;
        }

        const data = await load(state.currentDomain, state.currentOrder, 1);
        await render(data);
        await registerUomCategoryListViewEvent("on select", async () => {
            const count = await getUomCategoryListViewValue("count select");
            await setUomCategoryListToolbarValue("count select", count);
        });
    });

    await registerUomCategoryListToolbarEvent("order", async () => {
        if (await getUomCategoryListToolbarValue("is order active")) {
            state.currentOrder = await getUomCategoryListModalOrderValue("ordering");
        } else {
            state.currentOrder = null;
        }

        const data = await load(state.currentDomain, state.currentOrder, 1);
        await render(data);
        await registerUomCategoryListViewEvent("on select", async () => {
            const count = await getUomCategoryListViewValue("count select");
            await setUomCategoryListToolbarValue("count select", count);
        });
    });
}


document.addEventListener("DOMContentLoaded", async () => {

    let state = {
        currentDomain: null,
        currentOrder: null
    }

    const data = await load(null, null, 1);
    await render(data);
    await registerEvent(state);
});