export {};

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: Record<string, any> | FormData | null;
    queryParams?: any;
    headers?: any;
    nextOption?: any;
  }

  interface IFieldError {
    path: string;
    message: string;
    code?: string;
  }

  interface IBackendRes<T = unknown> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string | string[] | IFieldError[];
  }
}
