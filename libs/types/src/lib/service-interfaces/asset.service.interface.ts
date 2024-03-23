export abstract class AssetServiceInterface {
  abstract uploadFile(file: unknown): Promise<string>;
  abstract deleteFile(fileName: string): Promise<void>;
}
