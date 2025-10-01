export async function get_product_category_list(domain, order, page = 1) {
    const apiUrl = "/api/inventory/product-categories/";
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
