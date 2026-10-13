/** A result the page can jump to directly when typing a full handle. */
export interface SearchHit {
    kind: "team" | "player";
    publicId: string;
}
