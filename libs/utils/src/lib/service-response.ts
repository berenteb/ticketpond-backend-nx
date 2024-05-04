import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ServiceResponse } from '@ticketpond-backend-nx/types';

export class CreateServiceResponse {
  static success<T>(data: T): ServiceResponse<T> {
    return {
      success: true,
      data,
    };
  }

  static error<T>(message: string, status = 500): ServiceResponse<T> {
    return {
      success: false,
      error: {
        message,
        status,
      },
    };
  }
}

export function handleServiceResponse<T>(response: ServiceResponse<T>) {
  if ('error' in response) {
    if (response.error.status === 404) {
      throw new NotFoundException(response.error.message);
    } else if (response.error.status === 400) {
      throw new BadRequestException(response.error.message);
    } else if (response.error.status === 401) {
      throw new UnauthorizedException(response.error.message);
    } else if (response.error.status === 403) {
      throw new ForbiddenException(response.error.message);
    } else {
      throw new InternalServerErrorException(response.error.message);
    }
  }
  return response.data;
}
