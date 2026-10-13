export interface CursorPageRequest {
    take?: number;
    beforeCreationDate?: string;
    beforePublicId?: string;
}

/**
 * Same cursor as the consumer search: newest first, then public id, and the next page starts
 * strictly before the last row the client already has.
 */
export function pageByCursor<T extends { creationDate: string; publicId: string }>(
    items: T[],
    request: CursorPageRequest,
): { items: T[]; hasMore: boolean } {
    const take = request.take != null && request.take > 0 ? Math.min(request.take, 50) : 20;
    const sorted = [...items].sort((left, right) => {
        const byDate = Date.parse(right.creationDate) - Date.parse(left.creationDate);
        if (byDate !== 0) {
            return byDate;
        }
        return right.publicId < left.publicId ? -1 : right.publicId > left.publicId ? 1 : 0;
    });

    const beforeDate = request.beforeCreationDate ? Date.parse(request.beforeCreationDate) : Number.NaN;
    const beforeId = request.beforePublicId;
    const visible =
        Number.isFinite(beforeDate) && beforeId
            ? sorted.filter((item) => {
                  const at = Date.parse(item.creationDate);
                  return at < beforeDate || (at === beforeDate && item.publicId < beforeId);
              })
            : sorted;

    return { items: visible.slice(0, take), hasMore: visible.length > take };
}
