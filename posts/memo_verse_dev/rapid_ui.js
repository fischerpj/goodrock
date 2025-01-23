// 2502 keep unique in reverse order
// 0.0.15 help button + display
// 0.0.14 refOnlyKeys + ?version
// 0.0.13 getUniqueKeys 
// 0.0.12 no mymini.add 
// =============================================================================
// here NEW mini_storage

class miniStorage {
    #version;
    #defaultKeyId;
    #initValue;
    #cachedValue; // an Array
    #mappedValue; // a Map

    constructor(defaultKeyId = 'refidArray', 
                initValue    = "gen1:1") {
        this.#version       = '0.0.14 refOnlyKeys'; 
        this.#defaultKeyId  = defaultKeyId;
        this.#initValue     = this.timestamp_(initValue);
        // check if exists
        if (!localStorage.getItem(this.#defaultKeyId)) {
        // Create storage with initValue
          this.#cachedValue = [this.#initValue];
          this.write_storage();
        }
        // R1
  //      this.read_cache();
        this.read_map();
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
    
    // Function to add an element with logic for existing keys
    addElementToMap(key) {
      const map = this.#mappedValue;
      const lowerCaseKey = key.toLowerCase();
        if (map.has(lowerCaseKey)) {
          const existingValue = map.get(lowerCaseKey);
          map.delete(lowerCaseKey);
          map.set(lowerCaseKey, existingValue);
      } else {
        map.set(lowerCaseKey, timestamp_(key));
      }
      this.#mappedValue = map;
    }
    
    // remove an element to Array
    removeLastElement() {
      const new_array = this.#cachedValue;
      if (new_array.length > 0) {
        new_array.pop();
      }
      this.#cachedValue = new_array;
      this.write_storage();
    }
    
    // add a timestamp to an existing object
    timestamp_(obj = this.initValue) {
      const timestamp = new Date().toISOString();
      return {refid: obj, ts: timestamp}
    }
    
    // ======================================================================
    // STORAGE IOs
    
    // write-through storage via cache
    write_storage() {
        this.keepUniqueRefid();
        this.#setItem(this.#defaultKeyId, this.#cachedValue );
    }
    
    // R1  read-through cache from storage with LOGIC of unique refids
    read_cache() {
        this.#cachedValue = this.#getItem(this.#defaultKeyId);
        this.keepUniqueRefid();
    }
    
    // R2  read-through cache from storage with LOGIC of unique refids
    read_map() {
        this.read_cache();
        const miArray = this.#cachedValue;
    // Transform the array into a Map with ref as the key
        const miMap = new Map(miArray.map(item => [item.refid, { ts: item.ts}]));
        console.log(miMap);
        this.#mappedValue = miMap;
    }
    
    // R4  Getter for mappedValue
    get map() {
        return this.#mappedValue;
    }  
    
    // R3  Getter for cachedValue
    get cache() {
        return this.#cachedValue;
    }  
    
    //  Getter for version
    get version() {
        return this.#version;
    }  
    
    // Setter for cachedValue
    set cache(value) {
       this.#cachedValue = value;
    }  
    
    // Method to keep elements with unique refid in the cache
    keepUniqueRefid() {
      const refidSet = new Set();
      const uniqueArray = [];
      
      // work in reverse order
//      const reverseCache = this.getReverse();
//      console.log("reverseCache in 93" + reverseCache.toString());

//      this.#cachedValue.forEach(element => {
     this.getReverse().forEach(element => {
        if (!refidSet.has(element.refid) && element.refid !== "") {
          refidSet.add(element.refid);
          uniqueArray.push(element);
        }
      });

//      this.#cachedValue = uniqueArray;
      this.#cachedValue = uniqueArray.slice().reverse();
    }
    
    // Method to retrieve UNIQUE refids
    getUniqueRefids() {
      const refidSet = new Set();
      this.#cachedValue.forEach(element => {
      refidSet.add(element.refid);
      });
    return Array.from(refidSet);
    }
    
    // Method to return KEYSie unique from MAP UNIQUE
    // is a subsitute to getUniqueRefids
    getUniqueKeys() {
      console.log(this.#mappedValue.keys());
      return this.#mappedValue.keys();
    }
    
    // get RAW storage
    #getItem(key = this.#defaultKeyId) {
        return JSON.parse(localStorage.getItem(key));
    }
    
       // get RAW storage
    #getItemReverse(key = this.#defaultKeyId) {
        return JSON.parse(localStorage.getItem(key)).slice().reverse();
    }
    
    // set RAW storage
    #setItem(key = this.#defaultKeyId, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
      // set RAW storage
    #setItemReverse(key = this.#defaultKeyId, value) {
        localStorage.setItem(key, JSON.stringify(value.slice().reverse()));
    }
    
    // Getter for initValue
    get initValue() {
        return this.#initValue;
    } 
    
    // Function to return stringified object of Map keys
    refstring_() {
      const map = this.#mappedValue;
      const keys = Array.from(map.keys());
      console.log(keys);
      return JSON.stringify(keys);
}

} // end of class miniStorage

// USE CASES
const mymini = new miniStorage();
//console.log(JSON.stringify(mymini.cache));
//mymini.addElement("eph2:9");
//console.log(JSON.stringify(mymini.cache));
//mymini.addElement("mark7:21");
//mymini.addElement("matt6:33");
//mymini.addElement("matt7:1");
//console.log("R3" + mymini.cache);
//console.log("R4" + mymini.map);
//console.log(mymini.getRandom());
//console.log(mymini.getLast());
//console.log(mymini.getUniqueRefids());
//console.log(mymini.getReverse());
//mymini.read_cache_map();
console.log(mymini.version);

// =============================================================================

class MUI {
  constructor(stor = new miniStorage()) {
//    this.container = document.body;
    this.container =  document.getElementById('mainAnchor') 

    this.createMainDiv();
    this.addInputAndButtons();
    this.addEventListeners();
    
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    this.storageArray = stor;
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
      
      this.ul = document.createElement('ul');
      this.ul.id = "resultList";
      this.outputDiv.appendChild(this.ul);

      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);

      this.container.appendChild(this.mainDiv);
    }
  }

  addInputAndButtons() {
  // 1. Create the .row, .container div
    this.rowDiv = document.createElement('div');
    this.rowDiv.classList.add('row', 'container');

  // 2. Create the image
    const image = document.createElement('img');
    image.src = 'brain.jpg';
    image.alt = 'Brain Image';
    image.width = 100;
    image.className = 'image';        

  // 3. Create the input field
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.placeholder = 'ref here';
    this.inputField.classList.add("form-control");
    this.inputField.style.width = '200px'; // Adjust the width as needed
    
  // 4. Append the input field and image to the rowDiv container
    this.rowDiv.appendChild(this.inputField);
    this.rowDiv.appendChild(image);

// ALL BUTTONS otherwise

    this.viewButton = document.createElement('button');
    this.viewButton.textContent = 'View';
    this.viewButton.classList.add("btn", "btn-primary");

    this.randomButton = document.createElement('button');
    this.randomButton.textContent = 'Random';
    this.randomButton.classList.add("btn", "btn-warning");

    this.allButton = document.createElement('button');
    this.allButton.innerHTML = '&nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;';
    this.allButton.classList.add("btn", "btn-success");

    this.refButton = document.createElement('button');
    this.refButton.textContent = 'Refs';
    this.refButton.classList.add("btn", "btn-info");
    
    this.deleteButton = document.createElement('button');
    this.deleteButton.textContent = 'Del';
    this.deleteButton.classList.add("btn", "btn-danger");
 
    this.helpButton = document.createElement('button');
    this.helpButton.textContent = 'H';
    this.helpButton.classList.add("btn", "btn-primary");
    
    this.buttonDiv = document.createElement('div');
    this.buttonDiv.id = 'buttonDiv';
    this.buttonDiv.classList.add("button-row");

    this.buttonDiv.appendChild(this.viewButton);
    this.buttonDiv.appendChild(this.randomButton);
    this.buttonDiv.appendChild(this.allButton);
    this.buttonDiv.appendChild(this.refButton);
    this.buttonDiv.appendChild(this.deleteButton);
    this.buttonDiv.appendChild(this.helpButton);

  // Appends two divs to the container
    this.inputDiv.appendChild(this.rowDiv);
    this.inputDiv.appendChild(this.buttonDiv);
  }

  addEventListeners() {
    this.viewButton.addEventListener('click', () => this.viewInput());
    this.randomButton.addEventListener('click', () => this.viewRandom());
    this.allButton.addEventListener('click', () => this.viewAll());
    this.refButton.addEventListener('click', () => this.refOnly());
//    this.refButton.addEventListener('click', () => this.refOnlyKeys());
    this.deleteButton.addEventListener('click', () => this.removeLastRef());
    this.helpButton.addEventListener('click', () => this.helpme());
  }

  async viewInput() {
    
 //   console.log(this.storageArray.getLast().toString());
//    this.storageArray.addElement("rev4:22");
    
    const inputValue = this.inputField.value;
    
    switch(inputValue) {
      case null :
        console.log( "NULL input does nothing");
        break;
      case "?version" :
        console.log( "version: "+ this.storageArray.version);
        break;
      default:
        console.log( "added NOT null input");
        this.storageArray.addElement(inputValue);
        const result = await this.augmentAndPopulateArray(this.storageArray.getLast());
        console.log(this.storageArray.getLast().toString());
    } 
    
//    const refidArray = JSON.parse(localStorage.getItem('refidArray')) || [];
//    const timestamp = new Date().toISOString();
    // Empty the input field after updating outputDiv
    this.inputField.value = null;
  }

  async helpme() {
  //  
    alert("H;");  
  }
  
  async viewRandom() {
  //  
    const result = await this.augmentAndPopulateArray(this.storageArray.getRandom());
  }

  async viewAll() {
//     const result = await this.augmentAndPopulateArray_progressive();
     const result = await this.augmentAndPopulateArray( this.storageArray.getReverse());
  }
  
  async refOnly() {
     const result = JSON.stringify(this.storageArray.getUniqueRefids());
     this.ul = document.getElementById('resultList');  
     const li = document.createElement('li');
     li.innerHTML = result;
     this.ul.innerHTML = null;
     this.ul.appendChild(li);
     console.log(result);
  }
  
    async refOnlyKeys() {
     const result = JSON.stringify(this.storageArray.refstring_());
     this.ul = document.getElementById('resultList');  
     const li = document.createElement('li');
     li.innerHTML = result;
     this.ul.innerHTML = null;
     this.ul.appendChild(li);
     console.log(result);
  }
  
  removeLastRef() {
    this.storageArray.removeLastElement()
  }
  
   // Method to retrieve unique refids
  XgetUniqueRefids() {
    const refidSet = new Set();

    this.storageArray.forEach(element => {
      refidSet.add(element.refid);
    });

    return Array.from(refidSet);
  }
  
  // Method to get the full URL with ?param=$ref
  getFullUrl(ref) {
        const url = `${this.urlbase}?param=${ref}`;
        console.log('Generated URL:', url);
        return url;
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
  
    displayLiHtml(li, responseObject) {
//      li.innerHTML = `Refid: ${responseObject.refid} <br> Content: ${responseObject.content} <br> Timestamp: ${responseObject.ts}`;
      let content_result = responseObject.content.replace(/^\d+/, '');
      li.innerHTML = `<p><b>${responseObject.refid}</b> ${content_result}`;
    }
  
  async augmentAndPopulateArray(arr = this.storageArray.getRandom()) {
  //          const arr = this.storageArray.cache;
            const ul = document.getElementById('resultList');
            const liElements = [];                                  // li array
 
            // Fetch data in parallel and update LI elements as promises resolve
            const fetchPromises = arr.map(async (obj, index) => {
              // Generate URL from refid property
              const url = this.getFullUrl(obj.refid);
              try {
                const response = await fetch(url);
                const data = await response.json(); // Assuming the response is in JSON format
                const xtd_response =  { ...obj, ...data };
                
                // Augment the object with the fetched data
//                obj.xtd_response = xtd_response;
                
               // Create and return a LI element for this object
                const li = document.createElement('li');
                  this.displayLiHtml(li, xtd_response) 
                return li;
                
              } catch (error) {
                console.error(`Failed to fetch data from ${url}:`, error);
                liElements[index].textContent = `Error loading ${url}`;
              }
            });
            
            // Wait for all fetch promises to complete
///            await Promise.all(fetchPromises);
            // Wait for all fetch promises to complete and get the updated LI elements
            const updatedLiElements = await Promise.all(fetchPromises);
            
            // Clear the existing UL content
            ul.innerHTML = '';
            // Append all the updated LI elements to the UL in one step
            updatedLiElements.forEach(li => ul.appendChild(li));
          }

  async augmentAndPopulateArray_progressive() {
            const arr = this.storageArray;
            const ul = document.getElementById('resultList');
            const liElements = [];                                  // li array
 
            // Create LI elements and keep references in an array
            arr.forEach(obj => {
              const li = document.createElement('li');
              li.textContent = 'Loading...' + obj.refid; // Initial placeholder text
              ul.appendChild(li);
              liElements.push(li);
            });

            // Fetch data in parallel and update LI elements as promises resolve
            const fetchPromises = arr.map(async (obj, index) => {
              // Generate URL from refid property
              const url = this.getFullUrl(obj.refid);
              try {
                const response = await fetch(url);
                const data = await response.json(); // Assuming the response is in JSON format
                console.log(data);
                const xtd_response =  { ...obj, ...data };
                
                // Augment the object with the fetched data
                obj.xtd_response = xtd_response;
                
                // Update the corresponding LI element
//                liElements[index].textContent = JSON.stringify(xtd_response); 
                this.displayLiHtml(liElements[index], xtd_response) 
                
              } catch (error) {
                console.error(`Failed to fetch data from ${url}:`, error);
                liElements[index].textContent = `Error loading ${url}`;
              }
              return obj.xtd_response;
            });
            
      // Wait for all fetch promises to complete
      const updatedLiElements = await Promise.all(fetchPromises);
      // Log the result of Promise.all
      console.log(updatedLiElements);
 
/*      
      // Clear the existing UL content
      ul.innerHTML = '';

      // Append all the updated LI elements to the UL in one step
      updatedLiElements.forEach(li => ul.appendChild(li));
      }
*/
}
} /// end of class MUI

// Retrieve array from localStorage and parse it
//const myArray = JSON.parse(localStorage.getItem('refidArray')) || [];
//console.log(myArray);

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
  const muiInstance = new MUI(mymini);
  console.log(muiInstance);
});