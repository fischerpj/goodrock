// storageItem minimalistic KV Storage with cache read-write-through

import { superArray, myRefArray } from "./superArray.js";
import { Dom } from "./dom.js";
import { bibRef } from "./bibRef.js";

export class storageItem {
    #defaultKeyId;
    #initValue;
    #cachedValue;
    #version;

    constructor(defaultKeyId = 'myRefArray', 
                initValue = new Array("gen1:1")) {
        this.#version = '0.0.6'; 

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
        let cached_value = new superArray(this.getItem(this.#defaultKeyId));
        return this.write_storage(cached_value);
    }
    
    // push additional value and write-through cache and storage 
    accumulate_through(value) {
        this.#cachedValue.push(value);
        return this.write_storage(this.#cachedValue);
    }

    // write-through storage via cache
    write_storage(newValue) {
        this.#cachedValue = newValue;
        this.#cachedValue.keepValids();
        this.setItem(this.#defaultKeyId, this.#cachedValue );
        return this.#cachedValue;
    }
    
    setItem(key = this.#defaultKeyId, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem(key = this.#defaultKeyId) {
        return JSON.parse(localStorage.getItem(key));
    }

    // take random element from cache 
    get_random() {
        return this.#cachedValue.getRandomElement();
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

// Instantiate the Dom class with the default argument
const domInstance = new Dom();

// Create an instance of kv
export const storage = new storageItem();

// Access the defaultKeyId
//console.log(storage.defaultKeyId);  // Output: 'newDefaultKey'

// WRITE-THROUGH 
//console.log(storage.read_cache());  
const my_random = storage.get_random()
console.log(my_random);  

// Instantiate bibRef class with a ref argument to add divs to the DOM and set up the button
const bibRefInstance = new bibRef(my_random);

// Use the getter to access the _response property
bibRefInstance.fetchContent().then((resp) => {domInstance.addContent(resp.content);});  

