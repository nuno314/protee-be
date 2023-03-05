export interface ResponseDto<T> {
    data: T;
    isSuccess: boolean;
    errors: string[] | string;
}
