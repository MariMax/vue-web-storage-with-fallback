import { StorageServicesEnum } from './storage-service.enum';
import { IStorageService } from './storage-service.interface';
import { ObjectStorage } from './storage/object-storgae.service';
import { StorageService } from './storage/storage.service';

export class WebStorageManagerService implements IStorageService {
  private static insance: WebStorageManagerService;
  private failedStorages: Set<StorageServicesEnum> = new Set();
  private local: IStorageService = new StorageService(new ObjectStorage());
  private session: IStorageService = new StorageService(new ObjectStorage());
  private objectStorage: IStorageService = new StorageService(new ObjectStorage());
  private activeStorage: Storage = this.local;

  constructor(private testStorageName = 'StorageManagerService_test_key',
              local: Storage,
              session: Storage,
              private prefix = 'StorageManagerService_') {
    if (WebStorageManagerService.insance) {
      return WebStorageManagerService.insance;
    }

    WebStorageManagerService.insance = this;
    this.local = new StorageService(local);
    this.session = new StorageService(session);
    this.objectStorage = new StorageService(new ObjectStorage());
  }

  public get length(): number {
    if (this.activeStorage) {
      return this.activeStorage.length;
    }

    return 0;
  }

  public key(index: number): string | null {
    return this.activeStorage.key(index);
  }

  public getKeys(storageType = StorageServicesEnum.LOCAL_STORAGE): string[] {
    const storage = this.getWorkingStorage(storageType);
    return storage.getKeys();
  }

  public setItem(
    key: string,
    value: any,
    storageType = StorageServicesEnum.LOCAL_STORAGE,
  ): void {
    const storage = this.getWorkingStorage(storageType);
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    storage.setItem(this.getKey(key), value);
  }

  public getItem(
    key: string,
    storageType = StorageServicesEnum.LOCAL_STORAGE,
  ): string | null {
    const storage = this.getWorkingStorage(storageType);
    return storage.getItem(this.getKey(key));
  }

  public clear(storageType = StorageServicesEnum.LOCAL_STORAGE): void {
    const storage = this.getWorkingStorage(storageType);
    storage.clear();
  }

  public removeItem(
    key: string,
    storageType = StorageServicesEnum.LOCAL_STORAGE,
  ): void {
    const storage = this.getWorkingStorage(storageType);
    storage.removeItem(this.getKey(key));
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private getStorageByType(storageType: StorageServicesEnum): IStorageService {
    switch (storageType) {
      case StorageServicesEnum.LOCAL_STORAGE:
        return this.local;
      case StorageServicesEnum.SESSION_STORAGE:
        return this.session;
      case StorageServicesEnum.OBJECT_STORAGE:
        return this.objectStorage;
    }
  }

  private getWorkingStorage(storageType: StorageServicesEnum): IStorageService {
    let storage = this.getStorageByType(storageType);
    try {
      storage.setItem(this.testStorageName, '');
      storage.removeItem(this.testStorageName);
    } catch (e) {
      this.failedStorages.add(storageType);
    }
    if (this.failedStorages.has(storageType)) {
      storage = this.objectStorage;
    }
    this.activeStorage = storage;
    return storage;
  }
}
