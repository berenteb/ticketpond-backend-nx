import { CreateCustomerDto, CustomerDto, UpdateCustomerDto } from '../dtos';

export abstract class CustomerServiceInterface {
  abstract getCustomers(): Promise<CustomerDto[]>;

  abstract getCustomerById(id: string): Promise<CustomerDto>;
  abstract getCustomerByAuthId(authId: string): Promise<CustomerDto>;

  abstract createCustomer(
    customer: CreateCustomerDto,
    authId?: string,
  ): Promise<CustomerDto>;

  abstract updateCustomer(
    id: string,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto>;

  abstract updateCustomerByAuthId(
    authId: string,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto>;

  abstract deleteCustomer(id: string): Promise<void>;
}
