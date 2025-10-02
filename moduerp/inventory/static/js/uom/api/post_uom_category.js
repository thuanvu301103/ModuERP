import {getCookie} from '../utils/get_cookie.js';

export async function postUomCategory(data) {
    const apiUrl = "/api/inventory/uom-categories/";
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken')
        },
        credentials: "include",
        body: JSON.stringify(data)
    });
    return response;
}
