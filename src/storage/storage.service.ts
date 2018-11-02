import { IStorageService } from '../storage-service.interface';

export class StorageService implements IStorageService {
  constructor(private storage: Storage) {}

  get length(): number {
    return this.storage.length;
  }

  public key(index: number): string | null {
    return this.storage.key(index);
  }

  public getKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  }

  public setItem(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string): any {
    const value = this.storage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  }

  public clear(): void {
    try {
      this.storage.clear();
    } catch (exception) {
      //
    }
  }

  public removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (exception) {
      //
    }
  }
}
