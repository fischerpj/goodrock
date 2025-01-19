class RefArray extends Array {
  constructor(...args) {
    super(...args);
  }

  // Method to get the last element of the array
  getLastElement() {
    return this[this.length - 1];
  }

  // Method to select a random element from the array
  random() {
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

class StorageObject extends RefArray {
  constructor(initialArray = ['gen1:1']) {
    super(...initialArray); // Call the parent constructor with initialArray
  }

  // Additional methods specific to StorageObject can be added here if needed
}

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

class StorageKey extends StorageAPI {
  constructor(keyId = 'myRefArray', refArray = new StorageObject(['gen1:1'])) {
    super(keyId); // Call parent constructor with keyId

    // Check if localStorage is available
    if (this.isLocalStorageAvailable()) {
      // Initialize the keyId with an initial value of refArray
      this.setItem(keyId, refArray);
    }
  }

  // Method to add an element to the refArray
  addElement(element) {
    const refArray = new StorageObject(...(this.getItem(this.getKeyId()) || []));
    refArray.addElement(element);
    this.setItem(this.getKeyId(), refArray);
  }

  // Method to get the refArray
  getRefArray() {
    return new StorageObject(...(this.getItem(this.getKeyId()) || []));
  }

  // Method to get a random element from the refArray
  getRandomElement() {
    const refArray = this.getRefArray();
    return refArray.random();
  }

  // Method to get the last element of the refArray
  getLastElement() {
    const refArray = this.getRefArray();
    return refArray.getLastElement();
  }
}

class StoreUI {
  constructor(storageKey) {
    this.storageKey = storageKey;

    // Create a div element for input
    this.inputDiv = document.createElement('div');
    this.inputDiv.id = 'storeUIInput';
    document.body.appendChild(this.inputDiv);

    // Create a text input field
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.id = 'inputField';
    this.inputDiv.appendChild(this.inputField);

    // Create a button to add elements
    this.addButton = document.createElement('button');
    this.addButton.textContent = 'Add Element';
    this.addButton.addEventListener('click', this.addElement.bind(this));
    this.inputDiv.appendChild(this.addButton);

    // Create a div element for output
    this.outputDiv = document.createElement('div');
    this.outputDiv.id = 'storeUIOutput';
    document.body.appendChild(this.outputDiv);

    // Display the last element of the array
    this.displayLastElement();
  }

  // Method to add an element to the storageKey
  addElement() {
    const inputValue = this.inputField.value;
    if (inputValue) {
      this.storageKey.addElement(inputValue);
      this.inputField.value = ''; // Clear input field
      this.displayLastElement(); // Update output
    }
  }

  // Method to display the last element of the array
  displayLastElement() {
    const lastElement = this.storageKey.getLastElement();
    this.outputDiv.textContent = `Last Element: ${lastElement}`;
  }
}

// Example usage of the StoreUI class
const storageKey = new StorageKey();
const storeUI = new StoreUI(storageKey);
console.log(storeUI.outputDiv.textContent); // Outputs: Last Element: gen1:1
