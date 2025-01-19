// minimalistic extension of Array
export class superArray extends Array {
    #version;

  constructor(...args) {
        
        // Check if there's only one argument and it's an array
        if (args.length === 1 && Array.isArray(args[0])) {
            // If the single argument is an array, use spread syntax to initialize the Array
            super(...args[0]);
        } else {
            // Otherwise, treat args as the elements of the array
            super(...args);
        }
        
        this.#version = '0.0.6'; 
    }
  
    // keep all non null, non empty elements
    keepValids(){
          // Original Set of numbers
 //         const numbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
          // Filter function to get even numbers
      const valids = new Set(this.filter(num => num != "" ));
      this.length = 0;  // Clear the array
      this.push(...valids);  // Add unique elements back to the array
    }    
    
    // Method to accumulate an element at end of array
    accumulate(element) {
        // leave 'this' untouched
        if (element !== null && element !== '') {
            this.push(element);
        }
    }
  
  // Method to get the version
  get version() {
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
}


//
export const myRefArray = new superArray(["gen1:1","","","ex1:2",undefined]);

console.log(myRefArray.version);
console.log(myRefArray.toString());
