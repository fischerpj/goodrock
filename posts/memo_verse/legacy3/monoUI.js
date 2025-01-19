// monoUI incorporates all js code into one file [superArray, storageItem, bibRef]

// =============================================================================
// minimalistic extension of Array

class superArray extends Array {
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
      // Filter function to get not empty
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

/*
// USE CASES
const myRefArray = new superArray(["gen1:1","","","ex1:2",undefined]);
console.log(myRefArray.toString());
*/

// =============================================================================
// storageItem minimalistic KV Storage with cache read-write-through

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
const storage = new storageItem();
console.log(storage.read_cache());  
const random_ref = storage.get_random()
console.log(random_ref);  

// =============================================================================
// bibRef

class bibRef {
    constructor(ref = "gen1:1") {
        this.ref = ref;
        this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
        // Build the urlfull using the urlbase and ref argument
        this.urlfull = this.getFullUrl();
}
    
  // Method to get the full URL with ?param=$ref
  getFullUrl() {
    return `${this.urlbase}?param=${this.ref}`;
  }
    
  // Getter for ref
    get reference() {
      return this.ref;
    }

  // Setter for ref
    set reference(newRef) {
      this.ref = newRef;
    }
    
  // Getter for _response
    get response() {
        return this._response;
    }

    fetchContent() {
        return fetch(this.urlfull)
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
                this.asyncData = data;
                return data;  // Ensure the promise resolves with the data
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                return 'Error fetching data';
            });
    }
}

// USE CASES

// Instantiate bibRef class with a ref argument to add divs to the DOM and set up the button
const bibRefInstance = new bibRef(random_ref);

// Use the getter to access the _response property
bibRefInstance.fetchContent().then((resp) => {console.log(resp.content);});  
