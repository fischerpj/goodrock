//==============================================================================

class BibRef {
  #version;
  #content;
  
  constructor(ref = "gen1:1") {
    this.ref = ref;
    this.#version = '2.1'; // Initialize the private property version
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw'; // Initialize the urlbase property
    this.fullUrl = `${this.urlbase}?param=${this.ref}`; // Initialize the fullUrl property
    this.#content = null; // Initialize the content property
  }
  
  // Method to get the version
  getVersion() {
    return this.#version;
  }
  
  // Method to get the reference
  getReference() {
    return this.ref;
  }
  
  // Method to set a new reference and update the full URL
  setReference(newRef) {
    this.ref = newRef;
    this.fullUrl = `${this.urlbase}?param=${this.ref}`;
    this.#content = null; // Reset content when reference changes
  }
  
  // Method to get the urlbase
  getUrlBase() {
    return this.urlbase;
  }
  
  // Method to get the full URL
  getFullUrl() {
    return this.fullUrl;
  }
  
  // Method to get the response
  async getResponse() {
    if (this.#content === null) {
        const url = this.getFullUrl();
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.#content = await response.json();
        } catch (error) {
          console.error('Error fetching content:', error);
          return null;
        }
  }
  return this.#content;
}

// Method to get the content attribute of the response
async getContent() {
  const response = await this.getResponse();
  return response ? response.content : null;
}
}

//==============================================================================

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

//==============================================================================

class StorageAPI {
  #version;
  #defaultKeyId;
  #keyValue;

  constructor(defaultKeyId = 'myRefArray', keyValue = new RefArray('gen1:1')) {
    this.#version = '0.0.7'; // Initialize the version property to 0.0.7
    this.#defaultKeyId = defaultKeyId; // Initialize the defaultKeyId property
    this.#keyValue = keyValue; // Initialize the keyValue property

    // Check if localStorage is available
    if (!this.isLocalStorageAvailable()) {
      console.error('localStorage is not available in this browser.');
    } else {
      // Initialize the defaultKeyId with the keyValue
      this.setItem(this.#defaultKeyId, this.#keyValue);
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

  // Method to get the defaultKeyId
  getDefaultKeyId() {
    return this.#defaultKeyId;
  }

  // Method to get the keyValue
  getKeyValue() {
    return this.#keyValue;
  }

  // Method to reinitialize defaultKeyId with the keyValue
  init(keyValue = this.#keyValue) {
    if (this.isLocalStorageAvailable()) {
      this.#keyValue = keyValue;
      this.setItem(this.#defaultKeyId, this.#keyValue);
    } else {
      console.error('Unable to initialize, localStorage not available.');
    }
  }
}

//==============================================================================

// Example usage
const refArray = new RefArray('gen1:1', 'ex2:3');
refArray.push("rom1:17");
refArray.push("gal2:21");
console.log(JSON.stringify(refArray));
//console.log(refArray.getRandomElement());
const lastElement = refArray.getLastElement();
console.log(lastElement);

const storageAPI = new StorageAPI('myRefArray', refArray);
console.log("ver : " + storageAPI.getVersion()); // Outputs: 0.0.7
console.log("defKey : " + storageAPI.getDefaultKeyId()); // Outputs: myRefArray

//storageAPI.setItem('name', 'Jean Dupont');
//console.log("name : " + storageAPI.getItem('name')); // Outputs: Jean Dupont

//storageAPI.init(); // Reinitialize defaultKeyId with a new RefArray
console.log(storageAPI.getItem('myRefArray')); // Outputs: ["gen1:1"]
//storageAPI.removeItem('name');
//storageAPI.clear();
//const keys = storageAPI.getAllKeys();
//console.log(storageAPI.getAllKeys()); // Outputs the remaining keys in localStorage

//==========================================

// Example usage
const bibRef = new BibRef();
console.log(bibRef.getReference()); // Outputs: gen1:1
//console.log(bibRef.getVersion()); // Outputs: 2.1
//console.log(bibRef.getUrlBase()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw
//console.log(bibRef.getFullUrl()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw?param=gen1:1

// Fetching and logging content asynchronously
/*
bibRef.getContent().then(content => {
  if (content) {
    console.log('Content:', content);
  } else {
    console.log('Failed to fetch content.');
  }
});
*/

bibRef.setReference(lastElement);
//console.log(bibRef.getReference()); // Outputs: ex2:3
console.log(bibRef.getFullUrl()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw?param=ex2:3

// Fetching and logging updated content asynchronously
bibRef.getContent().then(content => {
  if (content) {
    console.log('Updated content:', content);
  } else {
    console.log('Failed to fetch updated content.');
  }
});
