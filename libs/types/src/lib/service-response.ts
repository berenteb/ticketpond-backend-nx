export type ServiceResponse<T> =
  | {
      success: false;
      error: {
        status?: number;
        message: string;
      };
    }
  | {
      success: true;
      data: T;
    };
