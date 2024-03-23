export interface IsOwnProperty {
  isOwnProperty: (itemId: string, ownerId: string) => Promise<boolean>;
}
