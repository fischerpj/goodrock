// 1.1.3 Refs
// 1.1.2 lastEntry & removeLast
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

class Refs {
  #Xurlbase;
  #asEntry;
  #asPayload; 

  constructor(arg = "gen1:1") {
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    
    if (typeof arg === 'string') {
      const meta = {
        refid: arg,
        Xurl: `${this.#Xurlbase}?param=${arg}`, 
        ts: new Date().toISOString(),
        category: 'biblical' };
      this.#asEntry = [[arg, meta]];   
      } else if (Array.isArray(arg)) {
            this.#asEntry = arg;
      } else {
            throw new Error('Invalid argument type');
      }
   }
   
  // Getter REVERSE array of keys
  get asEntry() {
    return this.#asEntry
  }
  
  // Getter REVERSE array of keys
  get asPayload() {
    return this.#asPayload;
  }
  
  // Function to fetch data from all URLs in parallel
  // input is #asEntry output is #asPayload
  async fetchParallel() {
   const entries = this.#asEntry;  
   try {
    // Create an array of fetch promises
    const fetchPromises = entries.map(([key, value]) => 
      fetch(value.Xurl)
        .then(response => response.json())
        .then(data => ([ key, {...data, ...value} ]))
    );

    // Wait for all fetch promises to resolve
    const results  = await Promise.all(fetchPromises);
    this.#asPayload = results;
    return results; // return a Promise to allow successful chaining
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }; // end of async method
  
  mergePayload(addref = this) {
    const payload = this.#asPayload;
    const second = addref.asPayload;
    // each element of second is pushed onto payload
    const merge = second.map((entry) => {payload.push(entry)});
    this.#asPayload = payload;
  }
}

class MapStor {
  #refSource;
  #refEntries;
  #refUl;
  #Xurlbase;
  refs;
  addref;
  #refPayload; // remove this data logic

  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
//    this.refs = new Refs("gen1:1"); 

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
    
    this.refs = new Refs(this.#refEntries); 
    this.addref = new Refs("Rev4:1");

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

  // Getter REVERSE array of keys
  get keysArray() {
    return Array.from(this.#refPayload.keys()).reverse();
  }
  
  // Getter for source
  get refSource() {
    return this.#refSource;
  }
  
  // Getter for the REVERSE map as ARRAY in full
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
  
  XaddEntry(refid= 'ps116:1') {
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
  async addEntry(key= 'Rev1:1'){
    this.addref = new Refs(key);
    const result = this.addref.fetchParallel();
    return result
/*    
    const lowerCaseKey = key.toLowerCase();
      if (map.has(lowerCaseKey)) {
          const existingValue = map.get(lowerCaseKey);
          map.delete(lowerCaseKey);
          map.set(lowerCaseKey, existingValue);
      } else {
        map.set(lowerCaseKey, key);
      }
      this.#refPayload = map;
*/    
//    return this.refs.fetch();
    }
  
    // Function to add an element with logic for existing keys
  addElementToMap(key) {
      const map = this.#refPayload;
      const lowerCaseKey = key.toLowerCase();
        if (map.has(lowerCaseKey)) {
          const existingValue = map.get(lowerCaseKey);
          map.delete(lowerCaseKey);
          map.set(lowerCaseKey, existingValue);
      } else {
        map.set(lowerCaseKey, key);
      }
      this.#refPayload = map;
    }
  
  // Method to remove the last entry
  removeLast(){
    const lastKey = this.keysArray[0];
    this.#refPayload.delete(lastKey);
  }

  mapHTML(refMap = this.refs.asPayload){
    const result = refMap;
    const anchor = document.getElementById('mainAnchor');
    const ul = document.createElement('ul');
    // Clear the existing UL content
      ul.innerHTML = '';
    const liElements = [];
    
    // Append all the updated LI elements to the UL in one step
      result.forEach(([key,value]) => {
//        console.log(key);
//        console.log(value);
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

}

// Usage example:

document.addEventListener('DOMContentLoaded', () => {
  
// USE CASE create and async payload for ONE REF
  const bibref = new  Refs('ps10:5');
  // transform this into an init method of Refs
  bibref.fetchParallel()
    .then(results => {
        bibref.mergePayload();
        console.log(bibref);
    })
    .catch(error => {
        console.error("Error:", error);
    });

// USE CASE MAPSTOR
  // Create an instance of MapStor, which will initialize based on the conditions provided
  const mapStor = new MapStor();
  
  // FETCH addref single in mapStor
  mapStor.addref.fetchParallel()
    .then(results => {
        console.log(mapStor);
    })
    .catch(error => {
        console.error("Error:", error);
    });

  // FETCH refs multi in mapStor
  mapStor.refs.fetchParallel()
    .then(results => {
        mapStor.refs.mergePayload(mapStor.addref);
        mapStor.mapHTML();
        console.log(mapStor.refs.asPayload);
    })
    .catch(error => {
        console.error("Error:", error);
    });

  // SHOW all   
//  console.log(mapStor);

//  mapStor.addEntry('act4:2').then(()=> {console.log(mapStor)});

/*
// works on addref !
  mapStor.addEntry('act4:2')
  .then(() => {
    console.log(mapStor);
//    mapStor.mapHTML(); 
  });

  mapStor.refs.fetchParallel()
  .then(() => {
    console.log(mapStor);
    mapStor.mapHTML();
  });
*/

}); // end of listener code