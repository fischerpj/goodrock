class StorageObject extends RefArray {
  constructor(initialArray = ['gen1:1']) {
    super(...initialArray); // Call the parent constructor with initialArray
  }

  // Additional methods specific to StorageObject can be added here if needed
}



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

const storage = new StorageObject();
storage.accumulateValue("ps23:1");
storage.push("rom1:17");
console.log(storage.accu);

/*
class StoreUI {
  constructor() {
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
    this.inputDiv.appendChild(this.addButton);
    
    // Create a div element for output
    this.outputDiv = document.createElement('div');
    this.outputDiv.id = 'storeUIOutput';
    document.body.appendChild(this.outputDiv);
    
    // Add event listener to the button
    this.addButton.addEventListener('click', this.addElement.bind(this));
  }
  
  // Method to add an element and display it
  addElement() {
    const inputValue = this.inputField.value;
    if (inputValue) {
      this.outputDiv.textContent = `Last Element: ${inputValue}`;
      this.inputField.value = ''; // Clear input field
    }
  }
}

// Example usage of the StoreUI class
const storeUI = new StoreUI();
*/
