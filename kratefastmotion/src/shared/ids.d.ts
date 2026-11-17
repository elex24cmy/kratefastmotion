/** Branded id helpers (string-based; ulid-like for ordering). */
export type ProjectId = string & {
    readonly __brand: "ProjectId";
};
export type ComponentId = string & {
    readonly __brand: "ComponentId";
};
export type SkillId = string & {
    readonly __brand: "SkillId";
};
export type TemplateId = string & {
    readonly __brand: "TemplateId";
};
/** Time-prefixed sortable id: ms-since-epoch + random. */
export declare function createId(prefix?: string): string;
//# sourceMappingURL=ids.d.ts.map