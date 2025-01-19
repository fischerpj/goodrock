// new storeUI with storageAPI

class StorageAPI {
  #version;
  #keyId;

  constructor(keyId = 'refArray') {
    this.#version = 1; // Initialize the version property with 1
    this.#keyId = keyId; // Initialize the keyId property

    // Check if localStorage is available
    if (!this.isLocalStorageAvailable()) {
      console.error('localStorage is not available in this browser.');
    } else {
      // Initialize the keyId with an empty array
      this.setItem(this.#keyId, []);
    }
  }

  // Method to check if localStorage is available
  isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Method to set an item in localStorage
  setItem(key, value) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.error('Unable to set item, localStorage not available.');
    }
  }

  // Method to get an item from localStorage
  getItem(key) {
    if (this.isLocalStorageAvailable()) {
      const value = localStorage.getItem(key);
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('JSON parsing error:', e);
        return null;
      }
    } else {
      console.error('Unable to get item, localStorage not available.');
      return null;
    }
  }

  // Method to remove an item from localStorage
  removeItem(key) {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      console.error('Unable to remove item, localStorage not available.');
    }
  }

  // Method to clear all items from localStorage
  clear() {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    } else {
      console.error('Unable to clear items, localStorage not available.');
    }
  }

  // Method to get all keys from localStorage
  getAllKeys() {
    if (this.isLocalStorageAvailable()) {
      return Object.keys(localStorage);
    } else {
      console.error('Unable to get keys, localStorage not available.');
      return [];
    }
  }

  // Method to get the version
  getVersion() {
    return this.#version;
  }

  // Method to get the keyId
  getKeyId() {
    return this.#keyId;
  }
}

// Example usage of the StorageAPI class
const storage = new StorageAPI();
console.log(storage.getVersion()); // Outputs: 1
console.log(storage.getKeyId()); // Outputs: refArray
storage.setItem('name', 'Jean Dupont');
const name = storage.getItem('name');
console.log(name);  // Outputs: Jean Dupont
storage.removeItem('name');
//storage.clear();
const keys = storage.getAllKeys();
console.log(keys);  // Outputs the remaining keys in localStorage
