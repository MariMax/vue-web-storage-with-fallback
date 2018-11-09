import { StorageServicesEnum } from './storage-service.enum';

export abstract class IStorageService extends Storage {
  public abstract getKeys(storageType?: StorageServicesEnum): string[];
  public abstract setItem(key: string, value: any, storageType?: StorageServicesEnum): void;
  public abstract getItem(key: string, storageType?: StorageServicesEnum): string | null;
  public abstract clear(storageType?: StorageServicesEnum): void;
  public abstract removeItem(key: string, storageType?: StorageServicesEnum): void;
}
