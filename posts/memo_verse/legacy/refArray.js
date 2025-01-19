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

// Example usage
const refArray = new RefArray('gen1:1', 'ex2:3');
refArray.addElement('psalm23:1');
console.log(refArray.getLastElement()); // Outputs: psalm23:1
console.log(refArray.getRandomElement()); // Outputs a random element from the array
refArray.clearArray();
console.log(refArray); // Outputs: ['gen1:1']
console.log(refArray.getVersion()); // Outputs: 2.0


/*
class RefArray extends Array {
  #version;

  constructor(initialElement = "gen1:1") {
    super();
    this.#version = "1.3";
    this.push(initialElement);
  }

  getVersion() {
    return this.#version;
  }

  setVersion(newVersion) {
    this.#version = newVersion;
  }
  
  // Method to get the last element of the array 
  getLastElement() { 
    return this[this.length - 1]
  }

  // getter Method to select a random element from the array 
  getRandomElement() { 
    const randomIndex = Math.floor(Math.random() * this.length); 
    return this[randomIndex]; 
  }
  
}

// Example usage:
const myArray = new RefArray('ex2:1');
console.log(myArray.getVersion()); // Output: 1
myArray.push("rom1:17");
myArray.push("eph2:8");
myArray.push("gal2:21");
console.log(myArray.length); // Output: ["gen1:1"]
console.log(myArray); // Output: ["gen1:1"]
console.log(myArray.getRandomElement()) // Output: ["gen1:1"]
console.log(myArray.getLastElement()) // Output: ["gen1:1"]
*/