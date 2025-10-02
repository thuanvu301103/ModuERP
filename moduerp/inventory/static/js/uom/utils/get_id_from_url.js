export function getIdFromUrl() {
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