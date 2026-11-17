/** Time-prefixed sortable id: ms-since-epoch + random. */
export function createId(prefix = "") {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 10);
    return `${prefix}${ts}${rand}`;
}
//# sourceMappingURL=ids.js.map