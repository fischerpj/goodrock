// =============================================================================
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
    keepValids() {
        // Filter function to get not empty
        const valids = new Set(this.filter(num => num != ""));
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

// =============================================================================
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

// =============================================================================
class myUI {
    constructor(storage) {
        this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
        this.storageItem = storage;
        this.divId = 'mainDiv';
        this.createMainDiv();
        this.addInputAndButton();
        this.fetchAndDisplayData(this.storageItem.get_last());
    }
    
    addEventListeners() {
        const echoButton = document.getElementById('echoButton');
        echoButton.addEventListener('click', this.echoInput.bind(this));
    }

    // Method to get the full URL with ?param=$ref
    getFullUrl(ref) {
        const url = `${this.urlbase}?param=${ref}`;
//        console.log('Generated URL:', url);
        return url;
    }

    createMainDiv() {
        let mainDiv = document.getElementById(this.divId);
        if (!mainDiv) {
            mainDiv = document.createElement('div');
            mainDiv.id = this.divId;
            document.body.appendChild(mainDiv);
        }
      this.mainDiv = mainDiv;
//      console.log('we passed createMainDiv');
      }

    addInputAndButton() {
        // Create inputDiv
        const inputDiv = document.createElement('div');
        inputDiv.id = 'inputDiv';

        // Create INPUT field
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter text';
        input.id = 'inputField';
        
        // Create button to fetch and VIEW data
        const buttonView = document.createElement('button');
        buttonView.innerText = 'View';
        buttonView.onclick = () => {
////            this.storageItem.setRef(document.getElementById('inputField').value);
            this.fetchAndDisplayData(document.getElementById('inputField').value);
                   // Empty the input field after updating outputDiv
//        inputField.value = '';
        };
        

        // Create button to display random element
        const buttonRandom = document.createElement('button');
        buttonRandom.innerText = 'Random';
        buttonRandom.onclick = () => {
            const random_ref = this.storageItem.get_random();
//            this.updateOutputDiv(randomElement);
            this.fetchAndDisplayData(random_ref);
        };

        // Create outputDiv
        const outputDiv = document.createElement('div');
        outputDiv.id = 'outputDiv';

        // Append input and buttons to inputDiv
        inputDiv.appendChild(input);
        inputDiv.appendChild(buttonView);
        inputDiv.appendChild(buttonRandom);

        // Append inputDiv and outputDiv to mainDiv
        this.mainDiv.appendChild(inputDiv);
        this.mainDiv.appendChild(outputDiv);
        console.log('we passed addInputAndButton');
    }

    async fetchAndDisplayData(ref) {
        const url = this.getFullUrl(ref);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.updateOutputDiv(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            this.updateOutputDiv({ error: 'Error fetching data' });
        }
        console.log('fetchAndDisplayData for '+ url);
        
    }

    updateOutputDiv(data) {
        const outputDiv = document.getElementById('outputDiv');
        outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        // Empty the input field after updating outputDiv
//        inputField.value = '';
    }
}


// =============================================================================
// Initialize myUI instance
/*
const myStorage = new storageItem();
console.log(myStorage);
const uiInstance = new myUI(myStorage); // Uses default ref value 'gen1:1'
//console.log(uiInstance.mainDiv);
console.log(uiInstance);
*/

// =============================================================================
// =============================================================================
class Bref {
  constructor(ref = 'gen1:1') {
    this.ref = ref;
    this.baseUrl = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
  }

  // Method to turn ref into a URL with concatenation
  turnRefIntoUrl() {
    return `${this.baseUrl}?param=${encodeURIComponent(this.ref)}`;
  }

  // Method to fetch data from the URL
  async fetchUrl() {
    const url = this.turnRefIntoUrl();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

    // Method to fetch the URL and merge its data result with item
  async fetchAndMerge(item) {
    try {
      const response = await fetch(this.turnRefIntoUrl(item.refid));
      const fetchedData = await response.json();
      return { ...item, ...fetchedData };
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

class MUI {
  constructor() {
    this.container = document.body;

    this.createMainDiv();
    this.addInputAndButtons();
    this.addEventListeners();
  }

  createMainDiv() {
    // Check if mainDiv already exists
    if (!document.getElementById('mainDiv')) {
      this.mainDiv = document.createElement('div');
      this.mainDiv.id = 'mainDiv';

      this.inputDiv = document.createElement('div');
      this.inputDiv.id = 'inputDiv';

      this.outputDiv = document.createElement('div');
      this.outputDiv.id = 'outputDiv';

      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);

      this.container.appendChild(this.mainDiv);
    }
  }

  addInputAndButtons() {
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.placeholder = 'Enter text here';

    this.viewButton = document.createElement('button');
    this.viewButton.textContent = 'View';

    this.randomButton = document.createElement('button');
    this.randomButton.textContent = 'Random';

    this.allButton = document.createElement('button');
    this.allButton.textContent = 'All';

    this.inputDiv.appendChild(this.inputField);
    this.inputDiv.appendChild(this.viewButton);
    this.inputDiv.appendChild(this.randomButton);
    this.inputDiv.appendChild(this.allButton);
  }

  addEventListeners() {
    this.viewButton.addEventListener('click', () => this.viewInput());
    this.randomButton.addEventListener('click', () => this.viewRandom());
    this.allButton.addEventListener('click', () => this.viewAll());
  }

  getRandomRef() {
    const myRefArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
    if (myRefArray.length > 0) {
      return myRefArray[Math.floor(Math.random() * myRefArray.length)].refid;
    } else {
      this.outputDiv.textContent = 'No references found in localStorage';
      return null;
    }
  }

  getRandomItem() {
    const myRefArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
    if (myRefArray.length > 0) {
      return myRefArray[Math.floor(Math.random() * myRefArray.length)];
    } else {
      this.outputDiv.textContent = 'No references found in localStorage';
      return null;
    }
  }

  async fetchUrlData(refid) {
    const brefInstance = new Bref(refid);
//    const data = await brefInstance.fetchUrl();
    const data = await brefInstance.fetchAndMerge();
    
    return JSON.stringify(data, null, 2); // Convert fetched data to JSON string and format it for display
  }

  async fetchItemData(item) {
    const brefInstance = new Bref(item.refid);
//    const data = await brefInstance.fetchUrl();
    const data = await brefInstance.fetchAndMerge(item);
    
//    return JSON.stringify(data, null, 2); // Convert fetched data to JSON string and format it for display
    return data; // Convert fetched data to JSON string and format it for display
  }  

  displayLiHtml(li, responseObject) {
//    li.innerHTML = `Ref: ${responseObject.ref} <br> Content: ${responseObject.content} <br> Timestamp: ${responseObject.timestamp}`;
    li.innerHTML = `Refid: ${responseObject.refid} <br> Content: ${responseObject.content} <br> Timestamp: ${responseObject.timestamp}`;
  }
  
  async viewInput() {
    const inputValue = this.inputField.value;
    const myRefArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
    const timestamp = new Date().toISOString();

// if input is not null, then store it
    if (inputValue) {
      myRefArray.push({ refid: inputValue, timestamp });
      localStorage.setItem('myRefArray', JSON.stringify(myRefArray));
    }
    
    const  item = myRefArray.length > 0 ? myRefArray[myRefArray.length - 1] : {refid: 'gen1:1', timestamp: timestamp};
    const responseData = await this.fetchItemData(item);

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    this.displayLiHtml(li, responseData);
    ul.appendChild(li);

    this.outputDiv.innerHTML = ''; // Clear any existing content
    this.outputDiv.appendChild(ul);

    // Clear the input field after updating the view
    this.inputField.value = '';
  }

  async viewRandom() {
    const item = this.getRandomItem();
    console.log(item); //OK
    if (item) {
      const responseData = await this.fetchItemData(item);
      console.log(responseData);
      
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      this.displayLiHtml(li, responseData);
      ul.appendChild(li);

      this.outputDiv.innerHTML = ''; // Clear any existing content
      this.outputDiv.appendChild(ul);
    }
  }

  async viewAll() {
    const myRefArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
    if (myRefArray.length > 0) {
      const ul = document.createElement('ul');
      const reversedArray = [...myRefArray].reverse();
      const promises = reversedArray.map(async ref => {
        const li = document.createElement('li');
        const responseData = await this.fetchItemData(ref);
        this.displayLiHtml(li, responseData);
        ul.appendChild(li);
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      this.outputDiv.innerHTML = ''; // Clear any existing content
      this.outputDiv.appendChild(ul);
       // Apply reverseUL method
//      this.reverseUL(ul);
    } else {
      this.outputDiv.textContent = 'No references found in localStorage';
    }
  }

/*  
  reverseUL(ul) {
    const items = Array.from(ul.children);
    items.reverse().forEach(item => ul.appendChild(item));
  }
*/

} /// end of class MUI

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
  const muiInstance = new MUI();
});

// =============================================================================
// =============================================================================
class Xref {
  constructor(baseUrl = 'https://jsfapi.netlify.app/.netlify/functions/bgw', refid = 'gen1:1') {
    this.baseUrl = baseUrl;
    this.refid = refid;
  }

  // Method to get the baseUrl
  getBaseUrl() {
    return this.baseUrl;
  }

  // Method to set a new baseUrl
  setBaseUrl(newUrl) {
    this.baseUrl = newUrl;
  }

  // Method to get the refid
  getRefid() {
    return this.refid;
  }

  // Method to set a new refid
  setRefid(newRefid) {
    this.refid = newRefid;
  }

  // Method to turn refid into a URL with concatenation
  turnRefIntoUrl() {
    return `${this.baseUrl}?param=${encodeURIComponent(this.refid)}`;
  }

  // Property to get the item composed of refid and a timestamp
  get item() {
    const TS = new Date().toISOString();
    return { refid: this.refid, TS: TS };
  }

  // Method to fetch the URL and merge its data result with item
  async fetchAndMerge() {
    try {
      const response = await fetch(this.turnRefIntoUrl());
      const fetchedData = await response.json();
      return { ...this.item, ...fetchedData };
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

// Example usage
const myXref = new Xref();
console.log(myXref.item); // Output: { refid: 'gen1:1', TS: '2024-12-17T21:20:00.000Z' }

myXref.fetchAndMerge().then((e) => {console.log(e)});

// =============================================================================
/*
class StorageArray {
  constructor() {
    this.key = 'myRefArray';
  }

  // Method to get the array from localStorage
  getArray() {
    const storedArray = localStorage.getItem(this.key);
    return storedArray ? JSON.parse(storedArray) : [];
  }

  // Method to set the array to localStorage
  setArray(array) {
    localStorage.setItem(this.key, JSON.stringify(array));
  }

  // Method to add an item to the array
  addItem(refid) {
    const array = this.getArray();
    const item = { refid, TS: new Date().toISOString() };
    array.push(item);
    this.setArray(array);
  }

  // Method to remove an item from the array by refid
  removeItem(refid) {
    let array = this.getArray();
    array = array.filter(arrayItem => arrayItem.refid !== refid);
    this.setArray(array);
  }

  // Method to clear the array from localStorage
  clearArray() {
    localStorage.removeItem(this.key);
  }

  // Method to get the last item in the array
  getLastItem() {
    const array = this.getArray();
    return array[array.length - 1];
  }

  // Method to get a random item from the array
  getRandomItem() {
    const array = this.getArray();
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  // Method to get all items in strict reverse order
  getReverseArray() {
    const array = this.getArray();
    return array.slice().reverse();
  }
}

// Example usage
const storageArray = new StorageArray();

// Adding items to the array
storageArray.addItem('gen1:1');
storageArray.addItem('ps116');
storageArray.addItem('heb11:6');

console.log(storageArray.getArray());
// Output: [
//   { refid: 'example1', TS: '2024-12-19T15:21:00.000Z' },
//   { refid: 'example2', TS: '2024-12-19T15:22:00.000Z' },
//   { refid: 'example3', TS: '2024-12-19T15:23:00.000Z' }
// ]

console.log(storageArray.getLastItem());
// Output: { refid: 'example3', TS: '2024-12-19T15:23:00.000Z' }

console.log(storageArray.getRandomItem());
// Output: Randomly selected item from the array, e.g., { refid: 'example1', TS: '2024-12-19T15:21:00.000Z' }

console.log(storageArray.getReverseArray());
// Output: [
//   { refid: 'example3', TS: '2024-12-19T15:23:00.000Z' },
//   { refid: 'example2', TS: '2024-12-19T15:22:00.000Z' },
//   { refid: 'example1', TS: '2024-12-19T15:21:00.000Z' }
// ]

// Clearing the array
console.log(storageArray.getArray()); // Output: []
*/

// ============================================================================
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

class Xmui {
  constructor() {
    this.storageArray = new StorageArray();
    this.showAllButton = document.getElementById('All');
    this.storageItemsContainer = document.getElementById('storageItems');

    this.showAllButton.addEventListener('click', () => this.showAllItems());
  }

  showAllItems() {
    const items = this.storageArray.getArray();
    this.storageItemsContainer.innerHTML = ''; // Clear previous items

    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.textContent = `RefID: ${item.refid}, Timestamp: ${item.TS}`;
      this.storageItemsContainer.appendChild(itemElement);
    });
  }
}

// Initialize Xmui class
document.addEventListener('DOMContentLoaded', () => {
  new Xmui();
});