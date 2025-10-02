export async function getUomCategory(id) {
    const apiUrl = `/api/inventory/uom-categories/${id}/`;
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data;
}
