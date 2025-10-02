export function isUomCategoryEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== "object" || obj1 === null ||
        typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length < obj2.length) return false;
    }

    const keys1 = Object.keys(obj1);
    for (let key of keys1) {
        if (!isUomCategoryEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}