// superStorage coerces storageItem.cache to superArray offering methods: [get_random, accumulate_through]


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
*/

/*
console.log(new superArray("gen2:1"));
console.log(new superArray(["gen2:2"]));
console.log(new superArray("gen2:1","rom1:17"));
console.log(new superArray(["gen2:1","rom1:17"]));
*/

// storageItem minimalistic KV Storage with cache read-write-through
/*
class storageItem {
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
//const storage = new storageItem(undefined, ["gen1:1","gen50:2"]);
const storage = new storageItem(undefined, "gen1:1");
//console.log(storage.reinit());
*/

/*
// 0. Access the defaultKeyId
console.log(storage.defaultKeyId);  // Output: 'newDefaultKey'

// 1. READ-THROUGH 
console.log(storage.read_cache().toString());  

// 2.
console.log(storage.accumulate_through('gal2:22').toString());  

// 3.
console.log(storage.get_random().toString());  

// Check the updated value in localStorage
//console.log(storage.getItem());  // Output: 'newCachedValue'
*/

class miniUI {
    constructor(storageItem) {
        // Store the storageItem argument as a property of the instance
        this.storageItem = storageItem;

        // Create mainDiv
        this.mainDiv = document.createElement('div');
        this.mainDiv.id = 'mainDiv';

        // Create inputDiv
        this.inputDiv = document.createElement('div');
        this.inputDiv.id = 'inputDiv';
        this.inputDiv.innerHTML = `
            <input type="text" id="inputField" placeholder="Enter text here">
            <button id="echoButton">Store</button>
            <button id="randomButton">Random</button>
            <button id="allButton">All</button>
        `;
        
        // Create outputDiv
        this.outputDiv = document.createElement('div');
        this.outputDiv.id = 'outputDiv';
        this.outputDiv.innerHTML = 'Output will be displayed here';

        // Create randomDiv
        this.randomDiv = document.createElement('div');
        this.randomDiv.id = 'randomDiv';
        this.initializeRandomDiv(); // Initialize at build time

        // Append inputDiv, outputDiv, and randomDiv to mainDiv
        this.mainDiv.appendChild(this.inputDiv);
        this.mainDiv.appendChild(this.outputDiv);
        this.mainDiv.appendChild(this.randomDiv);

        // Append mainDiv to the body
        document.body.appendChild(this.mainDiv);

        // Add event listeners to the buttons using bind
        this.addEventListeners();
    }
    
    addEventListeners() {
        const echoButton = document.getElementById('echoButton');
        echoButton.addEventListener('click', this.echoInput.bind(this));

        const randomButton = document.getElementById('randomButton');
        randomButton.addEventListener('click', this.initializeRandomDiv.bind(this));

        const allButton = document.getElementById('allButton');
        allButton.addEventListener('click', this.showAllKeys.bind(this));
    }
    
    echoInput() {
        const inputField = document.getElementById('inputField');
        const outputDiv = document.getElementById('outputDiv');
        const discard_this = this.storageItem.accumulate_through(inputField.value);
        outputDiv.innerHTML = inputField.value;
        // for memozy this.storageItem.getLastElement();
        // Empty the input field after updating outputDiv
        inputField.value = '';
    }

/*
    echoInput() {
        const inputField = document.getElementById('inputField');
        const outputDiv = document.getElementById('outputDiv');
        outputDiv.innerHTML = inputField.value;
        // Call accumulate_through with the input field value
        if (this.storageItem && typeof this.storageItem.accumulate_through === 'function') {
            this.storageItem.accumulate_through(inputField.value);
        }
        // Empty the input field after updating outputDiv
        inputField.value = '';
    }
*/

    initializeRandomDiv() {
        if (this.storageItem && typeof this.storageItem.get_random === 'function') {
            this.randomDiv.innerHTML = this.storageItem.get_random().toString();
        } else {
            this.randomDiv.innerHTML = 'Storage item does not have a get_random method';
        }
    }
    
    showAllKeys() {
        const outputDiv = document.getElementById('outputDiv');
        if (this.storageItem && typeof this.storageItem.getAllKeys === 'function') {
//            outputDiv.innerHTML = this.storageItem.getAllKeys().join(', ');
            this.randomDiv.innerHTML = this.storageItem.read_cache().toString();
        } else {
            outputDiv.innerHTML = 'Storage item does not have a getAllKeys method';
        }
    }
}


// Instantiate miniUI class to add divs to the DOM and pass a storageItem
const uiInstance = new miniUI(storage);
console.log(uiInstance.storageItem.get_random().toString()); // Output: { key: 'value' }

