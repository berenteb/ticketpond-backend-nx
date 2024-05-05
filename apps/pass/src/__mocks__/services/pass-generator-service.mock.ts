import { PassGeneratorInterface } from '../../pass-generator.interface';

export const AppleGeneratorServiceMock: PassGeneratorInterface = {
  generatePass: jest.fn(),
};

export const ImageServiceMock: PassGeneratorInterface = {
  generatePass: jest.fn(),
};
