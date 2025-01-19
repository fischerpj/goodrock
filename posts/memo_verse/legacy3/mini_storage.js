// =============================================================================
// here NEW mini_storage

class miniStorage {
    #version;
    #defaultKeyId;
    #initValue;
    #cachedValue;

    constructor(defaultKeyId = 'myRefArray', 
                initValue    = "gen1:1") {
        this.#version       = '0.0.10'; 
        this.#defaultKeyId  = defaultKeyId;
        this.#initValue     = this.timestamp_(initValue);
        // check if exists
        if (!localStorage.getItem(this.#defaultKeyId)) {
        // Create storage with initValue
          this.#cachedValue = [this.#initValue];
          this.write_storage();
        }
        this.read_cache();
    }
    
     getLast() {
        return this.#cachedValue.slice(-1);
    }
  
    getRandom() {
      const array = this.#cachedValue;
      const randomIndex = Math.floor(Math.random() * array.length);
      return array.slice(randomIndex, randomIndex + 1);
    }

    getReverse() {
      const array = this.#cachedValue;
      return array.slice().reverse();
    }
    
    // add an element to Array
    addElement(refid) {
      const new_array = this.#cachedValue;
      const item = this.timestamp_(refid);
      new_array.push(item);
      this.#cachedValue = new_array;
      this.write_storage();
    }
    
    // add a timestamp to an existing object
    timestamp_(obj = this.initValue) {
      const timestamp = new Date().toISOString();
      return {refid: obj, ts: timestamp}
    }
    
    // write-through storage via cache
    write_storage() {
        this.keepUniqueRefid();
        this.#setItem(this.#defaultKeyId, this.#cachedValue );
    }
    
    // read-through cache from storage with LOGIC of unique refids
    read_cache() {
        this.#cachedValue = this.#getItem(this.#defaultKeyId);
        this.keepUniqueRefid();
    }
    
    // Getter for cachedValue
    get cache() {
        return this.#cachedValue;
    }  
    
    // Setter for cachedValue
    set cache(value) {
       this.#cachedValue = value;
    }  
    
    // Method to keep elements with unique refid in the cache
    keepUniqueRefid() {
      const refidSet = new Set();
      const uniqueArray = [];

      this.#cachedValue.forEach(element => {
        if (!refidSet.has(element.refid)) {
          refidSet.add(element.refid);
          uniqueArray.push(element);
        }
      });

      this.#cachedValue = uniqueArray;
    }
    
    // Method to retrieve UNIQUE refids
    getUniqueRefids() {
    const refidSet = new Set();
    
    this.#cachedValue.forEach(element => {
      refidSet.add(element.refid);
    });
    
    return Array.from(refidSet);
    }
    
    // get RAW storage
    #getItem(key = this.#defaultKeyId) {
        return JSON.parse(localStorage.getItem(key));
    }
    
    // set RAW storage
    #setItem(key = this.#defaultKeyId, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    // Getter for initValue
    get initValue() {
        return this.#initValue;
    } 
 
} // end of class miniStorage

// USE CASES
const mymini = new miniStorage();
console.log(JSON.stringify(mymini.cache));
mymini.addElement("eph2:9");
//console.log(JSON.stringify(mymini.cache));
mymini.addElement("mark7:21");
console.log(mymini.cache);
console.log(mymini.getLast());
console.log(mymini.getRandom());


// =============================================================================
// from xMui.js

class StorageArray {
  constructor() {
    this.key = 'myRefArray';
  }

  getArray() {
    const storedArray = localStorage.getItem(this.key);
    return storedArray ? JSON.parse(storedArray) : [];
  }

  setArray(array) {
    localStorage.setItem(this.key, JSON.stringify(array));
  }

  addItem(refid) {
    const array = this.getArray();
    const item = { refid, TS: new Date().toISOString() };
    array.push(item);
    this.setArray(array);
  }

  removeItem(refid) {
    let array = this.getArray();
    array = array.filter(arrayItem => arrayItem.refid !== refid);
    this.setArray(array);
  }

  clearArray() {
    localStorage.removeItem(this.key);
  }

  getLastItem() {
    const array = this.getArray();
    return array[array.length - 1];
  }

  getRandomItem() {
    const array = this.getArray();
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  getReverseArray() {
    const array = this.getArray();
    return array.slice().reverse();
  }
}

// USE CASES
const mystorage = new StorageArray();
//console.log(mystorage);

// =============================================================================

// from myUI.js

class storageItem {
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

    // take random element from cache 
    get_last() {
        return this.#cachedValue.getLastElement();
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
