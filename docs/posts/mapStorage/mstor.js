// newRefs in mstor.js
// todo removeLast with splice

class nRefs {
  #Xurlbase;
  #asEntry;
  #asPayload; 

//==============================================================================
// CONSTRUCTORs ...

  constructor(arg = "gen1:1") {
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    
    if (typeof arg === 'string') {
      const value = {
        refid: arg,
        Xurl: `${this.#Xurlbase}?param=${arg}`, 
        ts: new Date().toISOString(),
        category: 'biblical' };
      this.#asEntry = [[arg, value]];   
      } else if (Array.isArray(arg)) {
            this.#asEntry = arg;
      } else {
            throw new Error('Invalid argument type');
      }
  } // end of constructor

//==============================================================================
// Getter Setter ...
  
  // Getter for #asEntry
  get asEntry() {
    return Array.from(this.#asEntry);
  }
  
  // Getter of MAP
  get asMap() {
    return new Map(this.#asPayload);
  }
  
  // Getter for Payload
  get asPayload() {
    return Array.from(this.#asPayload);
  }
  
  // Getter for lastEntry 
  get lastPayload() {
    return Array.from(this.#asPayload).slice(-1);
  }
  
  // Getter for a in refMap's random entry as MAP
  get randomPayload() {
    const myload = Array.from(this.#asPayload);
    const randomIndex = Math.floor(Math.random() * myload.length);
    return myload.slice(randomIndex, randomIndex + 1);
  }
  
  // Getter REVERSE array of keys
  get asKeys() {
    const mimap = new Map(this.#asPayload);
    return Array.from(mimap.keys());
  }
  
//==============================================================================
// FETCH payload

  // Method to fetch multiple URLs in parallel
  async fetchParallel() {
  // references is #asEntry;
    const references = this.#asEntry;
    
    const fetchPromises = references.map(async (entry) => {
      // destructure one record being an array[2]
      const [key, value] = entry;

      if (value && value.Xurl) {
        try {
          const response = await fetch(value.Xurl);
          if (response.ok) {
            const payload = await response.json();
            // all properties of value and payload are merged into one object
            return [ key, {...value, ...payload} ];
          } else {
            console.error(`Network response for ${reference} was not ok.`);
            return [ key, null ];
          }
        } catch (error) {
          console.error(`Fetch operation for ${reference} failed:`, error);
          return [key, null ];
        }
      } else {
        return [ key, null ];
      };
    });
    
    // set asPayload when all promises are fulfilled
    this.#asPayload = await Promise.all(fetchPromises);
    return this;

  }; // end of async function
  
} // end of class

//==============================================================================

class mStor {
  #Xurlbase;
  #refSource;
  #refEntries;
  #refUl;

  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    
// =============================================================================
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
      this.#refEntries = JSON.parse(refidArray).map(item => [item.refid, {refid: item.refid, Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: item.ts, category: 'biblical'}]);
      this.refs = new nRefs(this.#refEntries);
    } else {
      // Fallback initialization if refidArray doesn't exist
      this.#refSource = 'refDefault';
      this.#refEntries = new Array([['gen1:1', { refid: 'gen1:1', Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
      this.refs = new nRefs(this.#refEntries);
    }
    // 
    this.addref = new nRefs(this.#refEntries.slice(-1));
    
// =========================================================================
    // CREATE HTML tags
    // Create a new ul element
    const ul = document.createElement('ul');
      ul.innerHTML = "empty"
      this.#refUl = ul;
    
  } // END of constructor
  
// =============================================================================  
// GETTER SETTER methods

  // Getter for #refEntries
  get refEntries() {
    return Array.from(this.#refEntries);
  }
  
// =============================================================================  
// DISPLAY methods  

  mapHTML(refMap = this.refs.asPayload){
    const result = refMap.reverse();
    const anchor = document.getElementById('mainAnchor');
    anchor.innerHTML = '';
    const ul = document.createElement('ul');
    // Clear the existing UL content and ist display
    ul.innerHTML = '';

    const liElements = [];
    
    // Append all the updated LI elements to the UL in one step
      result.forEach(([key,value]) => {
        let content_result = value.content.replace(/^\d+/, '');
        const li = document.createElement('li');
          li.textContent = key + " " +content_result;
          ul.appendChild(li)
        });
    this.#refUl = ul;  
    anchor.appendChild(ul);
    return this.#refUl
  }
  
} // end of class  

// USE CASE  
  
document.addEventListener('DOMContentLoaded', () => {

/*
// single ref
   const nref = new nRefs('ps10:5');
    console.log(nref);
*/    
    const ms = new mStor();

    // fetch refs and display in UI
    ms.refs.fetchParallel().then((res) => {
//      console.log(res.asMap);
      console.log(res.asKeys);
      ms.mapHTML(res.asPayload);
    });

/*
    // fetch addref and display in UI
    ms.addref.fetchParallel().then((res) => {
      ms.mapHTML(res.asPayload);
    });
*/

})  // end of dom listener

    