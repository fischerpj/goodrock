class StorageObject {
  #accu;

  constructor(initialArray) {
    this.#accu = Array.isArray(initialArray) ? initialArray : ['gen1:1'];
  }

  // Getter for accu
  getAccu() {
    return this.#accu;
  }

  // Setter for accu
  setAccu(newArray) {
    if (Array.isArray(newArray) && newArray.length > 0) {
      this.#accu = newArray;
    } else {
      this.#accu = ['gen1:1'];
    }
  }

  // Method to accumulate a new value
  accumulateValue(additionalValue) {
    this.#accu.push(additionalValue);
  }

  // Method to clear the accumulated values and initialize with 'gen1:1'
  clearValues() {
    this.#accu = ['gen1:1'];
  }

  // Method to select a random element from the array
  getRandom() {
    const randomIndex = Math.floor(Math.random() * this.#accu.length);
    return this.#accu[randomIndex];
  }

  // Method to get the last element of the array
  getLastElement() {
    return this.#accu[this.#accu.length - 1];
  }
  
}


class RefArray extends Array {
  #version;

  constructor(...args) {
    super(...args);
    this.#version = '2.0'; // Initialize the private property version
  }

  // Method to get the version
  getVersion() {
    return this.#version;
  }

  // Method to get the last element of the array
  getLastElement() {
    return this[this.length - 1];
  }

  // Method to get a random element from the array
  getRandomElement() {
    const randomIndex = Math.floor(Math.random() * this.length);
    return this[randomIndex];
  }

  // Method to clear the array and reset to initial value
  clearArray() {
    this.length = 0;
    this.push('gen1:1');
  }

  // Method to add an element to the array
  addElement(element) {
    this.push(element);
  }
}

class StorageAPI {
  #version;
  #defaultKey;
  #initialValue;
  #isAvailable;
  #accu;
  
  constructor(defaultKeyId = 'myRefArray', 
              keyValue = new RefArray('gen1:1')) {
    this.#version = '0.0.7'; // Initialize the version property to 0.0.7
    this.#defaultKey = defaultKeyId; // Initialize the defaultKeyId property
    this.#initialValue = keyValue; // Initialize the keyValue property
 

    // Check if localStorage is available
    if (!this.isLocalStorageAvailable()) {
      this.#isAvailable = false; 
//      console.error('localStorage IS NOT available in this browser.');
    } else {
      this.#isAvailable = true; 
//      this.#accu = Array.isArray(keyValue) ? keyValue : ['gen1:1'];
      this.#accu = this.getItem(this.#defaultKey);
    
      this.#accu = Array.isArray(initialArray) ? initialArray : ['gen1:1'];


//      console.log('localStorage IS available in this browser.');
//      this.init();
      // Initialize the defaultKeyId with the keyValue
//      this.setItem(this.#defaultKey, this.#initialValue);
    }
  }
  
  // Getter method for isAvailable status
  get isAvailable() {
    return this.#isAvailable;
  }
  
  // Getter for accu
  getAccu() {
    return this.#accu;
  }

 // Method to get the version
  getVersion() {
    return this.#version;
  }

  // Method to get the defaultKeyId
  getDefaultKey() {
    return this.#defaultKey;
  }

  // Method to get the #initialValue;
  getInitialValue() {
    return this.#initialValue;
  }
  
    // Method to reinitialize defaultKeyId with the keyValue
  init() {
      const storedValue = this.getItem(this.getDefaultKey());
      if ( storedValue == null ) {
        this.setItem(this.getDefaultKey(), this.getInitialValue()); 
      } else {
      console.error('Unable to initialize, localStorage not available.');
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
    if (this.isAvailable) {
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
}

// Example usage
const refArray = new RefArray('gen1:1');
refArray.push("rom1:17");
refArray.push("gal2:21");
console.log("refArray : " +JSON.stringify(refArray));
/*
console.log(refArray.getRandomElement());
console.log(refArray.getLastElement());
*/

const storageAPI = new StorageAPI('myRefArray', new RefArray('gen1:2'));
console.log("isAvailable : " + storageAPI.isAvailable);
console.log("accu : " + storageAPI.getAccu());
storageAPI.setItem('myRefArray', refArray);
//storageAPI.init();
console.log(storageAPI.getItem('myRefArray')); // Outputs: ["gen1:1"]
//storageAPI.clear();
//console.log("ver : " + storageAPI.getVersion()); // Outputs: 0.0.7
console.log("defKey : " + storageAPI.getDefaultKey()); // Outputs: myRefArray
console.log("iniValue : " + storageAPI.getInitialValue()); // Outputs: myRefArray

//storageAPI.setItem('name', 'Jean Dupont');
//console.log("name : " + storageAPI.getItem('name')); // Outputs: Jean Dupont

//storageAPI.init(); // Reinitialize defaultKeyId with a new RefArray
//storageAPI.removeItem('name');
//const keys = storageAPI.getAllKeys();
//console.log(storageAPI.getAllKeys()); // Outputs the remaining keys in localStorage

/*
class StorageAPI {
  #version;
  #keyId;
  
  constructor(keyId = 'myRefArray') {
    this.#version = '0.0.4'; // Initialize the version property to 0.0.4
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

//usage
const myStorage = new StorageAPI();
myStorage.setItem("toto","itsme");

console.log(myStorage.getAllKeys());
console.log(myStorage.getItem('toto'));
*/