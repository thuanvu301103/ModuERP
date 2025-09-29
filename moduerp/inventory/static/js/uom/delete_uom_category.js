function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
        const id = parseInt(params.get('id'), 10);
        if (!isNaN(id)) return id;
    }

    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    if (!isNaN(id)) return id;

    return null;
}

async function deleteData(id) {
    const csrftoken = getCookie('csrftoken');
    const api = `/api/inventory/uom-categories/${id}/`;
    const response = await fetch(api, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken 
        },
        credentials: "include",
    });
    if (!response.ok) {
        showToast({
            title: "Error",
            message: error.message || "Something went wrong while creating category",
            type: "danger",
            delay: 5000
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    window.location.href = "/inventory/uom-categories/";
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", async () => {
    const categoryId = getIdFromUrl();
    const deleteBtn = document.getElementById("delete-btn");
    deleteBtn.addEventListener("click", async () => {
        console.log("Delete Button clicked");
        await deleteData(categoryId);
    });
});

