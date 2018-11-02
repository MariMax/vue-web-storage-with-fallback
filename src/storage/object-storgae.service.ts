export class ObjectStorage implements Storage {
    private store: Map<string, string> = new Map();

    /**
     * Returns the number of key/value pairs currently present in the list associated with the
     * object.
     */
    get length(): number {
      return this.store.size;
    }
    /**
     * Empties the list associated with the object of all key/value pairs, if there are any.
     */
    public clear(): void {
      this.store = new Map();
    }
    /**
     * value = storage[key]
     */
    public getItem(key: string): string | null {
      const value = this.store.get(key);
      if (value) {
        return value;
      }
      return null;
    }
    /**
     * Returns the name of the nth key in the list, or null if n is greater
     * than or equal to the number of key/value pairs in the object.
     */
    public key(index: number): string | null {
      if (index > this.store.size) {
        return null;
      }
      const [key] = Array.from(this.store)[index];
      return key;
    }
    /**
     * delete storage[key]
     */
    public removeItem(key: string): void {
      this.store.delete(key);
    }
    /**
     * storage[key] = value
     */
    public setItem(key: string, value: string): void {
      this.store.set(key, value);
    }

    public getKeys(): string[] {
      return Array.from(this.store).map(([key]) => key);
    }
}
