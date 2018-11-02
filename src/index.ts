import {IStorageService} from './storage-service.interface';
import Vue, {PluginFunction, VueConstructor} from 'vue';
import {WebStorageManagerService} from './storage-manager.service';
import {StorageServicesEnum} from './storage-service.enum';

declare module "vue/types/vue" {
  interface Vue {
    $webStorage: IStorageService;
  }
}

interface ISafeWebStorageManagerServiceOptions {
  localStorage: Storage;
  sessionStorage: Storage;
  prefix: string;
  testKey: string;
}

const registerInstance = (
  V: VueConstructor<Vue>,
  options: ISafeWebStorageManagerServiceOptions,
) => {
  const {localStorage, sessionStorage, prefix, testKey} = options;
  const instance = new WebStorageManagerService(
    testKey,
    localStorage,
    sessionStorage,
    prefix,
  );

  V.prototype.$webStorage = instance;
};

export interface IWebStorageManagerServiceOptions {
  localStorage?: Storage;
  sessionStorage?: Storage;
  prefix?: string;
  testKey?: string;
}

// tslint:disable-next-line
const WebStorageManagerServicePlugin: PluginFunction<
  IWebStorageManagerServiceOptions
> = (V: VueConstructor<Vue>, options?: IWebStorageManagerServiceOptions) => {
  const safeOptions: ISafeWebStorageManagerServiceOptions = {
    localStorage,
    sessionStorage,
    prefix: 'WebStorageService_',
    testKey: 'WebStorageService_test_key',
    ...options,
  };

  registerInstance(V, safeOptions);
};

export const WebStorage =  WebStorageManagerServicePlugin;

export {
  StorageServicesEnum,
  IStorageService,
};
