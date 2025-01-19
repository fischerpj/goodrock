// superStorage coerces storageItem.cache to superArray offering methods: [get_random, accumulate_through]

import { superArray } from "./superArray.js";

/*
// minimalistic extension of Array
class superArray extends Array {

  constructor(...args) {
        // Check if there's only one argument and it's an array
        if (args.length === 1 && Array.isArray(args[0])) {
            // If the single argument is an array, use spread syntax to initialize the Array
            super(...args[0]);
        } else {
            // Otherwise, treat args as the elements of the array
            super(...args);
        }
    }
  
  // Method to accumulate an element at end of array
  accumulate(value) {
    return this.push(value);
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

/*
console.log(new superArray("gen2:1"));
console.log(new superArray(["gen2:2"]));
console.log(new superArray("gen2:1","rom1:17"));
console.log(new superArray(["gen2:1","rom1:17"]));
*/

*/

// storageItem minimalistic KV Storage with cache read-write-through

export class storageItem {
    #defaultKeyId;
    #initValue;
    #cachedValue;

    constructor(defaultKeyId = 'myRefArray', 
                initValue = new Array("gen1:1")) {
        this.#defaultKeyId = defaultKeyId;
        this.#initValue = new superArray(initValue);
        // Check if the item identified by defaultKeyId is not present
        if (!localStorage.getItem(this.#defaultKeyId)) {
        // Create storage with initValue
          this.setItem(this.#defaultKeyId, this.#initValue);
        }
        // Initialize cachedValue with the storage item
        this.read_cache();
//        this.#cachedValue = this.getItem(this.#defaultKeyId);
    }
    
    // Getter for defaultKeyId
    get defaultKeyId() {
        return this.#defaultKeyId;
    }

    // reinit to initial value
    reinit() {
        return this.write_storage(this.#initValue);
    }

    // read-through cache from storage and coerce to superArray
    read_cache() {
        this.#cachedValue = new superArray(this.getItem(this.#defaultKeyId));
        return this.#cachedValue;
    }
    
    // push additional value and write-through cache and storage 
    accumulate_through(value) {
        this.#cachedValue.push(value);
        return this.write_storage(this.#cachedValue);
    }

    // take random element from cache 
    get_random() {
        return this.#cachedValue.getRandomElement();
    }

    // write-through storage via cache
    write_storage(newValue = this.#cachedValue) {
        this.#cachedValue = newValue;
        this.setItem(this.#defaultKeyId, this.#cachedValue );
        return this.#cachedValue;
    }
    
    setItem(key = this.#defaultKeyId, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem(key = this.#defaultKeyId) {
        return JSON.parse(localStorage.getItem(key));
    }

    // Method to get all keys from localStorage
    getAllKeys() {
        return Object.keys(localStorage);
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }

    // Method to clear all items in localStorage
    clear() {
        localStorage.clear();
    }
}

// Create an instance of kv
const storage = new storageItem(undefined, ["gen1:1","gen50:2"]);
console.log(storage.reinit());

// 0. Access the defaultKeyId
//console.log(storage.defaultKeyId);  // Output: 'newDefaultKey'

// 1. READ-THROUGH 
//console.log(storage.read_cache().toString());  

// 2.
console.log(storage.accumulate_through('gal2:22').toString());  

// 3.
console.log(storage.get_random().toString());  

// Check the updated value in localStorage
//console.log(storage.getItem());  // Output: 'newCachedValue'

