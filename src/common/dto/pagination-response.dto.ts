export class PaginationResponseDto<T> {
    data: T[];
    total: number;
    take?: number;
    page?: number;
}

export class CachePaginationResponseDto<T> extends PaginationResponseDto<T> {
    constructor(data?: Partial<CachePaginationResponseDto<T>>) {
        super();
        if (data) {
            Object.assign(this, data);
        }
    }
}
