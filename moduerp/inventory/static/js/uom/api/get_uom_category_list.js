export async function getUomCategoryList(domain, order, page = 1) {
    const apiUrl = "/api/inventory/uom-categories/";
    let url = `${apiUrl}?page=${page}`;
    if (domain) url += `&${domain}`;
    if (order) url += `&${order}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data;
}
