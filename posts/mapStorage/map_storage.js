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

  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');

    if (refEntries) {
      const entriesArray = JSON.parse(refEntries);
      console.log(entriesArray);
      this.#refMap = new Map(entriesArray);
    } else if (refidArray) {
      const entriesArray = JSON.parse(refidArray);
      console.log(entriesArray);
      const refMap = new Map(entriesArray.map(item => [item.refid, {ts: item.ts, category: 'biblical'}]));
      this.#refMap = refMap;
    } else {
      // Fallback initialization if refidArray doesn't exist
      this.#refMap = new Map([['gen1:1', { timestamp: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
    }
  }

  // Getter for refMap
  get refMap() {
    return this.#refMap;
  }

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

  // Method to add an entry
  addEntry(key, value) {
    if (this.#refMap.has(key)) {
      this.#refMap.delete(key);
    }
    this.#refMap.set(key, value);
    this.storeRefEntries();
  }

  // Method to remove the last entry
  removeLast() {
    const keys = Array.from(this.#refMap.keys());
    const lastKey = keys[keys.length - 1];
    this.#refMap.delete(lastKey);
    this.storeRefEntries();
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
console.log(mapStor.refMap); // Log the refMap

// Store the refMap to local storage as refEntries
mapStor.storeRefEntries();

// Verify the stored result
const storedEntries = localStorage.getItem('refEntries');
console.log(JSON.parse(storedEntries));

// Add a new entry
mapStor.addEntry('john3:16', { timestamp: '2025-01-25T16:58:00Z', category: 'biblical' });
console.log(mapStor.refMap); // Log the refMap

/*
// Remove the last entry
mapStor.removeLast();
console.log(mapStor.refMap); // Log the refMap
*/