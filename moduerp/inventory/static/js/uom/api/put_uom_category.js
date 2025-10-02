import {getCookie} from '../utils/get_cookie.js';

export async function putUomCategory(id, data) {
    const apiUrl = `/api/inventory/uom-categories/${id}/`;
    const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken')
        },
        credentials: "include",
        body: JSON.stringify(data)
    });
    return response;
}
