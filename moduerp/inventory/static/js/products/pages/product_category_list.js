import {get_product_category_list} from '../api/get_product_category_list.js';

let currentOrder = null;
let currentDomain = null;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
    const data = await get_product_category_list(currentDomain, currentOrder, currentPage);
});