
interface RetryOptions {
    max: number;
    backoff: number;
}

interface MinimalResponse {
    statusCode: number;
};

interface ServiceCallResponse<TResponse> {
    res: MinimalResponse;
    body: TResponse;
}

type ServiceCallRequest<TResponse> = (
    payload: {},
    opts?: {},
) => Promise<ServiceCallResponse<TResponse>>;

interface ServiceCallBuilder {
    get<TResponse>(path: string): ServiceCallRequest<TResponse>;
    post<TResponse>(path: string): ServiceCallRequest<TResponse>;
}

export function serviceCall(
    hostname: string,
    retryOptions?: RetryOptions,
): ServiceCallBuilder;
