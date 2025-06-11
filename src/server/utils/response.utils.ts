// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export function createApiResponse<T>(
  options:
    | {
        success: true;
        message: string;
        data: T;
      }
    | {
        success: false;
        message: string;
        error: string;
      },
): ApiResponse<T> {
  if (options.success) {
    return {
      success: true,
      message: options.message,
      data: options.data,
    };
  } else {
    return {
      success: false,
      message: options.message,
      error: options.error,
    };
  }
}
