import {
  generateDateBasedSerialNumber,
  generateRandomString,
  generateSerialNumber,
} from './generators';

describe('generateRandomString', () => {
  it('should give back empty string', () => {
    const randomString = generateRandomString(0);
    expect(randomString).toBe('');
  });
  it('should generate a random string of the given length', () => {
    const randomString = generateRandomString(10);
    expect(randomString.length).toBe(10);
  });
  it('should give back different strings on three runs', () => {
    const randomString1 = generateRandomString(10);
    const randomString2 = generateRandomString(10);
    const randomString3 = generateRandomString(10);
    expect(randomString1).not.toBe(randomString2);
    expect(randomString1).not.toBe(randomString3);
    expect(randomString2).not.toBe(randomString3);
  });
});

describe('generateDateBasedSerialNumber', () => {
  it('should generate a date based serial number', () => {
    const dateBasedSerialNumber = generateDateBasedSerialNumber();
    expect(dateBasedSerialNumber).toMatch(/\d{4}\.\d{1,2}\.\d{1,2}\.\d{6}/);
  });

  it('should give back different serial numbers on three runs', () => {
    const serialNumber1 = generateDateBasedSerialNumber();
    const serialNumber2 = generateDateBasedSerialNumber();
    const serialNumber3 = generateDateBasedSerialNumber();
    expect(serialNumber1).not.toBe(serialNumber2);
    expect(serialNumber1).not.toBe(serialNumber3);
    expect(serialNumber2).not.toBe(serialNumber3);
  });
});

describe('generateSerialNumber', () => {
  it('should generate a serial number', () => {
    const serialNumber = generateSerialNumber();
    expect(serialNumber).toMatch(/TP-\w{6}/);
  });

  it('should give back different serial numbers on three runs', () => {
    const serialNumber1 = generateSerialNumber();
    const serialNumber2 = generateSerialNumber();
    const serialNumber3 = generateSerialNumber();
    expect(serialNumber1).not.toBe(serialNumber2);
    expect(serialNumber1).not.toBe(serialNumber3);
    expect(serialNumber2).not.toBe(serialNumber3);
  });
});
