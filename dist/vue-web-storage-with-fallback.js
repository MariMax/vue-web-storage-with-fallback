(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.WebStorageWithFallback = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var IStorageService = /** @class */ (function (_super) {
        __extends(IStorageService, _super);
        function IStorageService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IStorageService;
    }(Storage));

    (function (StorageServicesEnum) {
        StorageServicesEnum[StorageServicesEnum["LOCAL_STORAGE"] = 0] = "LOCAL_STORAGE";
        StorageServicesEnum[StorageServicesEnum["SESSION_STORAGE"] = 1] = "SESSION_STORAGE";
        StorageServicesEnum[StorageServicesEnum["OBJECT_STORAGE"] = 2] = "OBJECT_STORAGE";
    })(exports.StorageServicesEnum || (exports.StorageServicesEnum = {}));

    var ObjectStorage = /** @class */ (function () {
        function ObjectStorage() {
            this.store = new Map();
        }
        Object.defineProperty(ObjectStorage.prototype, "length", {
            /**
             * Returns the number of key/value pairs currently present in the list associated with the
             * object.
             */
            get: function () {
                return this.store.size;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Empties the list associated with the object of all key/value pairs, if there are any.
         */
        ObjectStorage.prototype.clear = function () {
            this.store = new Map();
        };
        /**
         * value = storage[key]
         */
        ObjectStorage.prototype.getItem = function (key) {
            var value = this.store.get(key);
            if (value) {
                return value;
            }
            return null;
        };
        /**
         * Returns the name of the nth key in the list, or null if n is greater
         * than or equal to the number of key/value pairs in the object.
         */
        ObjectStorage.prototype.key = function (index) {
            if (index > this.store.size) {
                return null;
            }
            var key = Array.from(this.store)[index][0];
            return key;
        };
        /**
         * delete storage[key]
         */
        ObjectStorage.prototype.removeItem = function (key) {
            this.store.delete(key);
        };
        /**
         * storage[key] = value
         */
        ObjectStorage.prototype.setItem = function (key, value) {
            this.store.set(key, value);
        };
        ObjectStorage.prototype.getKeys = function () {
            return Array.from(this.store).map(function (_a) {
                var key = _a[0];
                return key;
            });
        };
        return ObjectStorage;
    }());

    var StorageService = /** @class */ (function () {
        function StorageService(storage) {
            this.storage = storage;
        }
        Object.defineProperty(StorageService.prototype, "length", {
            get: function () {
                return this.storage.length;
            },
            enumerable: true,
            configurable: true
        });
        StorageService.prototype.key = function (index) {
            return this.storage.key(index);
        };
        StorageService.prototype.getKeys = function () {
            var keys = [];
            for (var i = 0; i < this.storage.length; i++) {
                var key = this.storage.key(i);
                if (key !== null) {
                    keys.push(key);
                }
            }
            return keys;
        };
        StorageService.prototype.setItem = function (key, value) {
            this.storage.setItem(key, JSON.stringify(value));
        };
        StorageService.prototype.getItem = function (key) {
            var value = this.storage.getItem(key);
            if (value !== null) {
                return JSON.parse(value);
            }
        };
        StorageService.prototype.clear = function () {
            try {
                this.storage.clear();
            }
            catch (exception) {
                //
            }
        };
        StorageService.prototype.removeItem = function (key) {
            try {
                this.storage.removeItem(key);
            }
            catch (exception) {
                //
            }
        };
        return StorageService;
    }());

    var WebStorageManagerService = /** @class */ (function () {
        function WebStorageManagerService(testStorageName, local, session, prefix) {
            if (testStorageName === void 0) { testStorageName = 'StorageManagerService_test_key'; }
            if (prefix === void 0) { prefix = 'StorageManagerService_'; }
            this.testStorageName = testStorageName;
            this.prefix = prefix;
            this.failedStorages = new Set();
            this.local = new StorageService(new ObjectStorage());
            this.session = new StorageService(new ObjectStorage());
            this.objectStorage = new StorageService(new ObjectStorage());
            this.activeStorage = this.local;
            if (WebStorageManagerService.insance) {
                return WebStorageManagerService.insance;
            }
            WebStorageManagerService.insance = this;
            this.local = new StorageService(local);
            this.session = new StorageService(session);
            this.objectStorage = new StorageService(new ObjectStorage());
        }
        Object.defineProperty(WebStorageManagerService.prototype, "length", {
            get: function () {
                if (this.activeStorage) {
                    return this.activeStorage.length;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        WebStorageManagerService.prototype.key = function (index) {
            return this.activeStorage.key(index);
        };
        WebStorageManagerService.prototype.getKeys = function (storageType) {
            if (storageType === void 0) { storageType = exports.StorageServicesEnum.LOCAL_STORAGE; }
            var storage = this.getWorkingStorage(storageType);
            return storage.getKeys();
        };
        WebStorageManagerService.prototype.setItem = function (key, value, storageType) {
            if (storageType === void 0) { storageType = exports.StorageServicesEnum.LOCAL_STORAGE; }
            var storage = this.getWorkingStorage(storageType);
            storage.setItem(this.getKey(key), JSON.stringify(value));
        };
        WebStorageManagerService.prototype.getItem = function (key, storageType) {
            if (storageType === void 0) { storageType = exports.StorageServicesEnum.LOCAL_STORAGE; }
            var storage = this.getWorkingStorage(storageType);
            return storage.getItem(this.getKey(key));
        };
        WebStorageManagerService.prototype.clear = function (storageType) {
            if (storageType === void 0) { storageType = exports.StorageServicesEnum.LOCAL_STORAGE; }
            var storage = this.getWorkingStorage(storageType);
            storage.clear();
        };
        WebStorageManagerService.prototype.removeItem = function (key, storageType) {
            if (storageType === void 0) { storageType = exports.StorageServicesEnum.LOCAL_STORAGE; }
            var storage = this.getWorkingStorage(storageType);
            storage.removeItem(this.getKey(key));
        };
        WebStorageManagerService.prototype.getKey = function (key) {
            return "" + this.prefix + key;
        };
        WebStorageManagerService.prototype.getStorageByType = function (storageType) {
            switch (storageType) {
                case exports.StorageServicesEnum.LOCAL_STORAGE:
                    return this.local;
                case exports.StorageServicesEnum.SESSION_STORAGE:
                    return this.session;
                case exports.StorageServicesEnum.OBJECT_STORAGE:
                    return this.objectStorage;
            }
        };
        WebStorageManagerService.prototype.getWorkingStorage = function (storageType) {
            var storage = this.getStorageByType(storageType);
            try {
                storage.setItem(this.testStorageName, '');
                storage.removeItem(this.testStorageName);
            }
            catch (e) {
                this.failedStorages.add(storageType);
            }
            if (this.failedStorages.has(storageType)) {
                storage = this.objectStorage;
            }
            this.activeStorage = storage;
            return storage;
        };
        return WebStorageManagerService;
    }());

    var registerInstance = function (V, options) {
        var localStorage = options.localStorage, sessionStorage = options.sessionStorage, prefix = options.prefix, testKey = options.testKey;
        var instance = new WebStorageManagerService(testKey, localStorage, sessionStorage, prefix);
        V.prototype.$webStorage = instance;
    };
    // tslint:disable-next-line
    var WebStorageManagerServicePlugin = function (V, options) {
        var safeOptions = __assign({ localStorage: localStorage,
            sessionStorage: sessionStorage, prefix: 'WebStorageService_', testKey: 'WebStorageService_test_key' }, options);
        registerInstance(V, safeOptions);
    };
    var WebStorage = WebStorageManagerServicePlugin;

    exports.WebStorage = WebStorage;
    exports.IStorageService = IStorageService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
