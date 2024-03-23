export abstract class AssetServiceInterface {
  abstract uploadFile(file: any): Promise<string>;
  abstract deleteFile(fileName: string): Promise<void>;
}
