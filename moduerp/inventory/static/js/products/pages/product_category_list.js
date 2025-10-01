import {get_list} from '../api/get_list.js';

let currentOrder = null;
let currentDomain = null;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
    const data = await get_list(currentDomain, currentOrder, currentPage);
    console.log(data);
});