export function generateSerialNumber(): string {
  const randomPart = generateRandomString(6);
  return `TP-${randomPart}`;
}

export function generateDateBasedSerialNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const characters = '0123456789';
  let randomPart = `${year}.${month}.${day}.`;
  for (let i = 0; i < 6; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomPart;
}

export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < length; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomPart;
}
