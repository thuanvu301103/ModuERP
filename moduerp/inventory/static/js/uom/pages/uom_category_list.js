import { getUomCategoryList } from "../api/get_uom_category_list.js";
import { renderUomCategoryListToolbar, registerUomCategoryListToolbarEvent, setUomCategoryListToolbarValue } from "../components/uom_category_list_toolbar.js";
import { renderUomCategoryListView, registerUomCategoryListViewEvent, getUomCategoryListViewValue } from '../components/uom_category_list_view.js';

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

async function registerEvent(currentDomain, currentOrder) {
    await registerUomCategoryListToolbarEvent("previous page", async (prevPage) => {
        const data = await load(currentDomain, currentOrder, prevPage);
        render(data);
        updateCheckedCount(null);
    });
    await registerUomCategoryListToolbarEvent("next page", async (nextPage) => {
        const data = await load(currentDomain, currentOrder, nextPage);
        render(data);
        updateCheckedCount(null);
    });

    await registerUomCategoryListViewEvent("on select", async () => {
        const count = await getUomCategoryListViewValue("count select");
        setUomCategoryListToolbarValue("count select", count);
    });

    await registerUomCategoryListToolbarEvent("filter", async () => {
        const data = await load(currentDomain, currentOrder, 1);
        await render(data);
        console.log("Set count to 0");
        await setUomCategoryListToolbarValue("count select", 0);
        await registerUomCategoryListViewEvent("on select", async () => {
            const count = await getUomCategoryListViewValue("count select");
            await setUomCategoryListToolbarValue("count select", count);
        });
    });
}


document.addEventListener("DOMContentLoaded", async () => {

    let currentDomain = null;
    let currentOrder = null;

    const data = await load(null, null, 1);
    render(data);
    console.log("Call register");
    await registerEvent(currentDomain, currentOrder);
    
    // Filter and Order
    const filterBtn = document.getElementById("filter-btn");
    const filterContainer = document.getElementById("filter-container");
    const orderBtn = document.getElementById("order-btn");
    const orderContainer = document.getElementById("order-container");


    filterBtn.addEventListener("click", async () => {
        if (filterBtn.classList.contains("active")) {
            let domain = [];

            filterContainer.querySelectorAll(".filter-row").forEach(row => {
                let field = row.querySelector('[name="field"]').value;
                let operator = row.querySelector('[name="operator"]').value;
                let value = row.querySelector('[name="value"]').value;

                if (value) {
                    domain.push([field, operator, isNaN(value) ? value : Number(value)]);
                    }
                });

            // Encode domain to JSON string
            let params = new URLSearchParams();
            params.append("domain", JSON.stringify(domain));
            currentDomain = params.toString();
            const data = await load(currentDomain, currentOrder, 1);
            render(data);
        } else {
            currentDomain = null;
            const data = await load(currentDomain, currentOrder, 1);
            render(data);
        }
    });

    orderBtn.addEventListener("click", async () => {
        if (orderBtn.classList.contains("active")) {
            let orderArr = [];

            orderContainer.querySelectorAll(".order-row").forEach(row => {
                let field = row.querySelector('[name="field"]').value;
                let value = row.querySelector('[name="order"]').value;
                const expr = value === "desc" ? `-${field}` : field;
                orderArr.push(expr);
            });
            // Encode order to JSON string
            const params = new URLSearchParams();
            if (orderArr.length) {
                params.append("ordering", orderArr.join(","));
            }
            currentOrder = params.toString();
            const data = await load(currentDomain, currentOrder, 1);
            render(data);
        } else {
            currentOrder = null;
            const data = await load(currentDomain, currentOrder, 1);
            render(data);
        }
    });
});