export type ServiceResponse<T> =
  | ServiceErrorResponse
  | ServiceSuccessResponse<T>;

type ServiceErrorResponse = {
  success: false;
  error: {
    status?: number;
    message: string;
  };
};

type ServiceSuccessResponse<T> = {
  success: true;
  data: T;
};
