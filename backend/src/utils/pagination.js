// ==========================================
// PAGINATION HELPERS
// ==========================================

export const DEFAULT_PAGE  = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT     = 100;


/**
 * Parse pagination query params from a request.
 * Returns { page, limit, skip }
 */
export const parsePagination = (query = {}) => {

    const page  = Math.max(1, parseInt(query.page)  || DEFAULT_PAGE);
    const limit = Math.min(
        MAX_LIMIT,
        Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT)
    );
    const skip  = (page - 1) * limit;

    return { page, limit, skip };
};


/**
 * Build the meta object returned with paginated responses.
 */
export const buildPaginationMeta = ({ total, page, limit }) => ({
    total,
    page,
    limit,
    totalPages : Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
});
