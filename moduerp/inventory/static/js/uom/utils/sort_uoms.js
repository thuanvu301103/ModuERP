export function sortUom(data) {
    const sortedUom = [...data].sort((a, b) => b.factor - a.factor);
    return sortedUom
}

export function sortUomCategoryObject(data) {
    return {
        ...data,
        uoms: [...data.uoms].sort((a, b) => {
            if (a.uom_type === "reference" && b.uom_type !== "reference") return -1;
            if (b.uom_type === "reference" && a.uom_type !== "reference") return 1;
            return b.factor - a.factor;
        })
    };
}