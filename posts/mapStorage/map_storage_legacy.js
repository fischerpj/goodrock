// 1.0.1 mapStorage

class MapStorage {
  #refMap;

  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refArray = localStorage.getItem('refidArray');
    console.log(refEntries);
    console.log(refArray);

/*
    if (refEntries) {
      const entriesArray = JSON.parse(refEntries);
      this.#refMap = new Map(entriesArray);
    } else if (refArray) {
      const convertedMap = MapStorage.convertFromRefArray().refMap;
      this.#refMap = convertedMap;
      this.storeToLocalStorage(); // Store the converted map
    } else {
      // Fallback initialization
      this.#refMap = new Map([['gen1:1', { timestamp: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
      this.storeToLocalStorage(); // Store the fallback map
    }
*/

  }

  // Getter for refMap
  get refMap() {
    return this.#refMap;
  }

  // Getter for refEntries
  get refEntries() {
    return JSON.stringify(Array.from(this.#refMap.entries()));
  }

  // Getter for refArray
  get refArray() {
    return JSON.stringify(Array.from(this.#refMap.entries()).map(([key, value]) => ({ ref: key, timestamp: value.timestamp, category: value.category })));
  }

  // Getter for refKeys
  get refKeys() {
    return Array.from(this.#refMap.keys());
  }

  // Getter for the last entry in refMap
  get lastEntry() {
    const keys = Array.from(this.#refMap.keys());
    const lastKey = keys[keys.length - 1];
    return new Map([[lastKey, this.#refMap.get(lastKey)]]);
  }

  // Getter for a random entry in refMap
  get randomEntry() {
    const keys = Array.from(this.#refMap.keys());
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return new Map([[randomKey, this.#refMap.get(randomKey)]]);
  }

  // Getter for refKeys reversed
  get refKeysReversed() {
    return Array.from(this.#refMap.keys()).reverse();
  }

  // Getter for refMap in reversed order
  get refMapReversed() {
    const reversedEntries = Array.from(this.#refMap.entries()).reverse();
    return new Map(reversedEntries);
  }

  // Method to store Map entries in local storage
  storeToLocalStorage() {
    const jsonString = this.refEntries;
    localStorage.setItem('refEntries', jsonString);
  }

  // Method to add an entry to refMap
  addEntry(key, value) {
    if (this.#refMap.has(key)) {
      // Remove existing entry
      this.#refMap.delete(key);
    }
    // Add entry at the end
    this.#refMap.set(key, value);
    this.storeToLocalStorage(); // Store updated map
  }

  // Method to remove the last entry from refMap
  removeLast() {
    const keys = Array.from(this.#refMap.keys());
    const lastKey = keys[keys.length - 1];
    this.#refMap.delete(lastKey);
    this.storeToLocalStorage(); // Store updated map
  }

  // Static method to retrieve Map entries from local storage
  static readFromLocalStorage() {
    const jsonString = localStorage.getItem('refEntries');
    if (jsonString) {
      const entriesArray = JSON.parse(jsonString);
      const refMap = new Map(entriesArray);
      return refMap;
    } else {
      return new Map();
    }
  }

  // Static method to read refArray from local storage and convert it
  static convertFromRefArray() {
    const jsonString = localStorage.getItem('refidArray');
    if (jsonString) {
      const refArray = JSON.parse(jsonString);
      this.#refMap = new Map(refArray.map(item => [item.ref, { timestamp: item.timestamp, category: item.category }]));
      return new MapStorage(refMap);
    } else {
      // Return an empty MapStorage if refArray does not exist
      return new MapStorage(new Map());
    }
  }

  // Static method to read refArray and write the converted result to refEntries
  static writeConvertedToRefEntries() {
    const entryStorage = MapStorage.convertFromRefArray();
    entryStorage.storeToLocalStorage();
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

localStorage.setItem('refArray', JSON.stringify([
  { ref: 'gen1:1', timestamp: '2025-01-20T09:28:00Z', category: 'biblical' },
  { ref: 'rom1:17', timestamp: '2025-01-19T10:45:00Z', category: 'biblical' },
  { ref: 'gal2:21', timestamp: '2025-01-18T11:15:00Z', category: 'biblical' },
  { ref: 'matt6:33', timestamp: '2025-01-21T08:00:00Z', category: 'biblical' }
]));
*/

// Create an instance of MapStorage, which will initialize based on the conditions provided
const mapStorage = new MapStorage();
//console.log(mapStorage.refMap);

/*
// Store the refMap to local storage
mapStorage.storeToLocalStorage();

// Verify the stored result
const storedEntries = MapStorage.readFromLocalStorage();
console.log(storedEntries);

// Log the refKeys
console.log(mapStorage.refKeys);

// Log the last entry
console.log(mapStorage.lastEntry);

// Log a random entry
console.log(mapStorage.randomEntry);

// Log the refKeys reversed
console.log(mapStorage.refKeysReversed);

// Log the refMap in reversed order
console.log(mapStorage.refMapReversed);

// Add a new entry
mapStorage.addEntry('john3:16', { timestamp: '2025-01-25T16:58:00Z', category: 'biblical' });
console.log(mapStorage.refMap);

// Remove the last entry
mapStorage.removeLast();
console.log(mapStorage.refMap);
*/
