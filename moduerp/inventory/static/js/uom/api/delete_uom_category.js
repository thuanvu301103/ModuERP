import {getCookie} from '../utils/get_cookie.js';

export async function deleteUomCategory(id) {
    const apiUrl = `/api/inventory/uom-categories/${id}/`;
    const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken')
        },
        credentials: "include"
    });
    return response;
}
