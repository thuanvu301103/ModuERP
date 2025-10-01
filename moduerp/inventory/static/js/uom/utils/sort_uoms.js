export function sortUom(data) {
    const sortedUom = [...data].sort((a, b) => b.factor - a.factor);
    return sortedUom
}