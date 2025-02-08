// 1.1.2 lastEntry
// 1.1.1 refPayload
// 1.1.0 refEntries
// 1.0.8 XfetchDataInParallel
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
  #refSource;
  #refEntries;
  #refPayload;
  #refUl;
  #Xurlbase;
  
  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');
    
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    
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
      this.#refSource = 'refidArray';
      this.#refEntries = JSON.parse(refidArray).map(item => [item.refid, {Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: item.ts, category: 'biblical'}]);
      this.storeRefEntries();
    } else {
      // Fallback initialization if refidArray doesn't exist
      this.#refSource = 'refDefault';
      this.#refEntries = new Array([['gen1:1', { Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
      this.storeRefEntries();
    }
    // Store refEntries corresponding to refMap happens not for refEntries
    
    // =========================================================================
    // CREATE HTML tags
    // Create a new ul element
    const ul = document.createElement('ul');
      ul.innerHTML = "empty"
      this.#refUl = ul;

  } // END of constructor

// =============================================================================
// GETTER methods

  // Getter for source
  get keysArray() {
    return Array.from(this.#refPayload.keys());
  }
  
  // Getter for source
  get refSource() {
    return this.#refSource;
  }
  
  // Getter for the map as ARRAY in full
  get asEntries() {
    return Array.from(this.#refPayload.entries()).reverse();
  }
  
  // Getter for refPayload
  get refPayload() {
    return  this.#refPayload;
  }
  
  // Getter for lastEntry 
  get lastEntry() {
    return Array.from(this.#refPayload.entries()).slice(-1);
  }

  // Getter for a in refMap's random entry as MAP
  get randomEntry() {
    const myload = Array.from(this.#refPayload.entries());
    const randomIndex = Math.floor(Math.random() * myload.length);
    return myload.slice(randomIndex, randomIndex + 1);
  }
  
  // Getter for a UL tag
  get refUl() {
    return this.#refUl;
  }
  
// =============================================================================
// IO methods

  // Method to store entries in local storage as refEntries
  storeRefEntries() {
    localStorage.setItem('refEntries', JSON.stringify(this.#refEntries));
  }
  
  addEntry(refid= 'ps116:1') {
    const new_entries = this.#refEntries;

    // create a value timestamped
    const objvalue = {Xurl: `${this.#Xurlbase}?param=${refid}`};
      objvalue['ts'] = new Date().toISOString();
      objvalue['category'] = 'biblical';
    
    new_entries.push([refid, objvalue]);
    this.#refEntries = new_entries;
  }
  
// =============================================================================
// MAP methods

  // Method to remove the last entry

  mapHTML(refMap = this.asEntries){
    const result = refMap;
    const anchor = document.getElementById('mainAnchor');
    const ul = document.createElement('ul');
    // Clear the existing UL content
      ul.innerHTML = '';
    const liElements = [];
    
    // Append all the updated LI elements to the UL in one step
      result.forEach(([key,value]) => {
        console.log(key);
        console.log(value);
        let content_result = value.content.replace(/^\d+/, '');
//        let content_result = value.content;
        const li = document.createElement('li');
          li.textContent = key + " " +content_result;
          ul.appendChild(li)
        });
    this.#refUl = ul;  
    anchor.appendChild(ul);
  }
  
  // =============================================================================
  // Xmethods
  
  // Function to fetch data from all URLs in parallel
  async XfetchParallel() {
   try {
    // Create an array of fetch promises
    const fetchPromises = this.#refEntries.map(([key, value]) => 
      fetch(value.Xurl)
        .then(response => response.json())
        .then(data => ([ key, {...data, ...value} ]))
    );

    // Wait for all fetch promises to resolve
    const results  = await Promise.all(fetchPromises);
    this.#refPayload = new Map(results);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
}

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
  // Create an instance of MapStor, which will initialize based on the conditions provided
  const mapStor = new MapStor();
  console.log(mapStor.refSource); // Log the refSource
  mapStor.addEntry('ps118:1'); // 

  mapStor.XfetchParallel()
  .then(() => {
    const keys = [['refKeys',{content: JSON.stringify(mapStor.keysArray)}]];
    console.log(mapStor.keysArray);
//    console.log(mapStor.asEntries);
//    console.log(mapStor.refPayload);
    console.log(mapStor.lastEntry);
    console.log(JSON.stringify(mapStor.randomEntry));
    mapStor.mapHTML(this.asEntries);
//    mapStor.mapHTML(keys);
  });
  
});