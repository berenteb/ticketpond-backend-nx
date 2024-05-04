export const KafkaMock = {
  send: jest.fn().mockResolvedValue({}),
  emit: jest.fn(),
};
