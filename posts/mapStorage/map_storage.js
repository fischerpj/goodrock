// 1.0.7 Xurl
// 1.0.6 mapHTML
// 1.0.5 refSource
// 1.0.3 refEntries item
// 1.0.2 MapStor class

/*
[
  {"refid":"gen1:1","ts":"2024-12-27T18:40:00.554Z"},
  {"refid":"ps40:7-8","ts":"2025-01-19T19:17:23.028Z"},
  {"refid":"eph2:9","ts":"2025-01-19T19:36:49.160Z"},
  {"refid":"mark7:21","ts":"2025-01-19T19:36:49.160Z"},
  {"refid":"matt6:33","ts":"2025-01-19T19:36:49.160Z"},
  {"refid":"is40:1","ts":"2025-01-23T16:01:11.949Z"},
  {"refid":"matt7:8","ts":"2025-01-24T17:20:43.800Z"}
]
*/

class MapStor {
  #refMap;
  #refSource;
  #refUl;
  #Xurlbase;
  
  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');
    
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
//    const url = `${this.#Xurlbase}?param=${ref}`;

    // =========================================================================
    // LOAD from localStorage
    /*
    if (refEntries) {
      const entriesArray = JSON.parse(refEntries);
      this.#refSource = 'refEntries';
      this.#refMap = new Map(entriesArray);
    } else
    */
    if (refidArray) {
      const entriesArray = JSON.parse(refidArray);
      this.#refSource = 'refidArray';
      const refMap = new Map(entriesArray.map(item => [item.refid, {Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: item.ts, category: 'biblical'}]));
      this.#refMap = refMap;
      this.storeRefEntries();
    } else {
      // Fallback initialization if refidArray doesn't exist
      this.#refSource = 'refDefault';
      this.#refMap = new Map([['gen1:1', { Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
      this.storeRefEntries();
    }
    // Store refEntries corresponding to refMap happens not for refEntries
    
    // =========================================================================
    // CREATE HTML tags
    // Create a new ul element
    const ul = document.createElement('ul');
      ul.innerHTML = "empty"
      this.#refUl = ul;
  
  }

// =============================================================================
// GETTER methods

  // Getter for refMap
  get refMap() {
    return this.#refMap;
  }
  
   // Getter for source
  get refSource() {
    return this.#refSource;
  }
  
  // Getter for refEntries ARRAY
  get refEntries() {
    return Array.from(this.#refMap.entries());
  }
  
  // Getter for refKeys ARRAY
  get refKeys() {
    return Array.from(this.#refMap.keys());
  }
  
  // Getter for refMap's lastEntry as MAP
  get lastEntry() {
    const keys = Array.from(this.#refMap.keys());
    const lastKey = keys[keys.length - 1];
    return new Map([[lastKey, this.#refMap.get(lastKey)]]);
  }

  // Getter for a in refMap's random entry as MAP
  get randomEntry() {
    const keys = Array.from(this.#refMap.keys());
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return new Map([[randomKey, this.#refMap.get(randomKey)]]);
  }
  
  // Getter for refKeys reversed ARRAY
  get refKeysReversed() {
    return Array.from(this.#refMap.keys()).reverse();
  }

  // Getter for refMap in reversed order a MAP
  get refMapReversed() {
    const reversedEntries = Array.from(this.#refMap.entries()).reverse();
    return new Map(reversedEntries);
  }

  // Getter for a UL tag
  get refUl() {
    return this.#refUl;
  }
  
// =============================================================================
// IO methods

  // Method to store entries in local storage as refidArray
  storeRefidArray() {
    const refidArray = JSON.stringify(Array.from(this.#refMap.entries()).map(([key, value]) => ({ ref: key, timestamp: value.timestamp, category: value.category })));
    localStorage.setItem('refidArray', refidArray);
  }

  // Method to store entries in local storage as refEntries
  storeRefEntries() {
    const refEntries = JSON.stringify(Array.from(this.#refMap.entries()));
    localStorage.setItem('refEntries', refEntries);
  }

// =============================================================================
// MAP methods

  // Method to add an entry
  addEntry(key, value) {
    if (this.#refMap.has(key)) {
      const existingValue = this.#refMap.get(key);
      this.#refMap.delete(key);
      this.#refMap.set(key, existingValue);
    } else {
      this.#refMap.set(key, value);
      }
    this.storeRefEntries();
  }

  // Method to remove the last entry
  removeLast() {
    const keys = Array.from(this.#refMap.keys());
    const lastKey = keys[keys.length - 1];
    this.#refMap.delete(lastKey);
    this.storeRefEntries();
  }
  
  async mapHTML(){
    const anchor = document.getElementById('mainAnchor');

    const result = await this.fetchResults();
    
    const ul = document.createElement('ul');
    // Clear the existing UL content
      ul.innerHTML = '';
    const liElements = [];
    // Append all the updated LI elements to the UL in one step
      result.forEach((value, key) => {
        const valobject = JSON.parse(value);
        const li = document.createElement('li');
//          li.textContent = ref[0] + JSON.stringify(ref[1]);
//          li.textContent = key + JSON.stringify(value);
          li.textContent = key + " " +valobject.content;
          ul.appendChild(li)
        });
    this.#refUl = ul;  
    
    anchor.appendChild(ul);
  }
  
  // =============================================================================
  // Xmethods
  
  async fetchResults() {
    const resultMap = new Map();
    
    const fetchPromises =  Array.from(this.refMap).map(async ([key, value]) => {
      try {
            const response = await fetch(value.Xurl);
            if (response.ok) {
                const data = await response.text();
                resultMap.set(key, data);
            } else {
                resultMap.set(key, `Error: ${response.statusText}`);
            }
        } catch (error) {
            resultMap.set(key, `Error: ${error.message}`);
        }
      });
      
      await Promise.all(fetchPromises);
      return resultMap;
//      return([key, value.Xurl, value.ts])
      }
}

// Example usage
/*
const exampleMap = new Map([
  ['gen1:1', { timestamp: '2025-01-20T09:28:00Z', category: 'biblical' }],
  ['rom1:17', { timestamp: '2025-01-19T10:45:00Z', category: 'biblical' }],
  ['gal2:21', { timestamp: '2025-01-18T11:15:00Z', category: 'biblical' }],
  ['matt6:33', { timestamp: '2025-01-21T08:00:00Z', category: 'biblical' }]
]);

localStorage.setItem('refidArray', JSON.stringify([
  { ref: 'gen1:1', timestamp: '2025-01-20T09:28:00Z', category: 'biblical' },
  { ref: 'rom1:17', timestamp: '2025-01-19T10:45:00Z', category: 'biblical' },
  { ref: 'gal2:21', timestamp: '2025-01-18T11:15:00Z', category: 'biblical' },
  { ref: 'matt6:33', timestamp: '2025-01-21T08:00:00Z', category: 'biblical' }
]));
*/

// Create an instance of MapStor, which will initialize based on the conditions provided
const mapStor = new MapStor();
console.log(mapStor.refSource); // Log the refSource

// Verify the stored result
//const storedEntries = localStorage.getItem('refEntries');
console.log(mapStor.refMap);
//console.log(mapStor.refEntries);
//console.log(mapStor.refKeys);
//console.log(mapStor.lastEntry);
mapStor.mapHTML();
//console.log(mapStor.refUl);
//mapStor.fetchResults().then(res => console.log(res.entries()));
mapStor.fetchResults().then(res => console.log(res));
//mapStor.fetchResults().then(res => console.log(res));

// Add a new entry
//mapStor.addEntry('john3:16', { timestamp: '2025-01-25T16:58:00Z', category: 'biblical' });
//mapStor.addEntry('gen1:1', { timestamp: '2025-01-25T16:58:00Z', category: 'biblical' });
//console.log(mapStor.refMap); // Log the refMap

/*
// Remove the last entry
mapStor.removeLast();
console.log(mapStor.refMap); // Log the refMap
*/