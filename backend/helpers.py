from schemas.utils import PaginationQuery


def generate_slug(name: str):
    raw_slug = "-".join(part for part in name.lower().strip().split() if part)
    return raw_slug or "product"


def calculate_pagination(query: PaginationQuery) -> PaginationQuery:
    page, limit = query

    if not page:
        query.page = 1
    if not limit:
        query.limit = 1

    query.skip = page-1*limit
    return query
