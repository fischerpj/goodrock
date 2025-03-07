// fast_mvc.js
// m_things belong to Model
// v_things belong to View
// c_things belong to Controller
// a_things belong to Application

//==============================================================================
// Model aka Data
//==============================================================================

// Model
class Model {
  #v_refUl;
  
  constructor() {
//    this.data = [];
    this.m_data = new mStorage();
    
    this.v_container =  document.getElementById('mainAnchor');
    this.v_createMainDiv();

  } // end of constructor
  
  // the Payload is gained outside the constructors because of async fetches
  m_init_load_() {
    this.m_data.getPayload().then(data => this.v_mapHTML(data)).catch(error => console.error(error));
  }
  
  //------------------------------------------------------------------------------  
  v_createMainDiv() {
    // mainDiv : check if it already exists
    if (!document.getElementById('mainDiv')) {
      this.mainDiv = document.createElement('div');
      this.mainDiv.id = 'mainDiv';

    // inputDiv
      this.inputDiv = document.createElement('div');
      this.inputDiv.id = 'inputDiv';

    // outputDiv and ul
      this.outputDiv = document.createElement('div');
      this.outputDiv.id = 'outputDiv';
      
      this.ul = document.createElement('ul');
      this.ul.id = "resultList";
      this.outputDiv.appendChild(this.ul);
      
      this.resultDiv = document.createElement('div');
      this.resultDiv.id = "resultDiv";
      this.resultDiv.innerHTML = "Waiting for Data...";
      this.outputDiv.appendChild(this.resultDiv);

    // assemble the divs into contaner
      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);
      this.v_container.appendChild(this.mainDiv);
    }
       // Create a new ul element
    const ul = document.createElement('ul');
      ul.innerHTML = "empty"
      this.#v_refUl = ul;
  } // createMainDiv
  
  v_mapHTML(refMap){
    // the DATA
    const result = [...refMap].reverse();
    // the DOM
    const anchor = document.getElementById('resultDiv');
      anchor.innerHTML = '';
    const ul = document.createElement('ul');
    // Clear the existing UL content and list display
      ul.innerHTML = '';

    const liElements = [];
    
    // Append all the updated LI elements to the UL in one step
      result.forEach(([key,value]) => {
        let content_result = value.content.replace(/^\d+/, '');
        const li = document.createElement('li');
          li.textContent = key + " " +content_result;
          ul.appendChild(li)
        });
    this.#v_refUl = ul;  
    anchor.appendChild(ul);
    return this.#v_refUl;
  }
  
} // end of Class

// mStorage 
class mStorage {
  #version;
  #defaultKeyId;
  #initValue;
  #Xurlbase;
  #refSource;

  constructor(defaultKeyId = 'refidArray', 
              initValue    = "gen1:1") {
    this.#version       = '0.1.4 m_init_load_, getPayload, fetchParallel '; 
    this.#defaultKeyId  = defaultKeyId;
    this.#initValue     = initValue;
    this.#Xurlbase      = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    
    this.asPayload = null;  // Initialize the data property
    this.isFetching = false;  // To track if data fetching is in progress
    
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');
    

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
      // convert Array of Objects to Array of Array[2]
      this.read_cache_();
    } else {
      // Fallback initialization if refidArray doesn't exist
      this.#refSource = 'refDefault';
      this.cachedValue = new Array([[`${this.#initValue}`, { refid: 'gen1:1', Xurl: `${this.#Xurlbase}?param=${item.refid}`, ts: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
    }
  } // END of constructor
  
// =============================================================================  
// GETTER SETTER methods

  // R3  Getter for cachedValue
  get cache() {
        return this.cachedValue;
  }  
  
  // R1  read-through cache from storage with LOGIC of unique refids
  read_cache_() {
    if (this.#refSource == 'refidArray') {  
      this.cachedValue = this.from_ObjectsArray_(this.getItem_(this.#defaultKeyId));
    } else {
      this.cachedValue = this.getItem_(this.#defaultKeyId)
    }
  }
 
  // write-through storage via cache
  write_storage_() {
    if (this.#defaultKeyId == 'refidArray') { 
      const out = this.to_ObjectsArray_(this.cachedValue);
      this.setItem_(this.#defaultKeyId, out);
    }
  }
  
  // get RAW storage
  getItem_(key = this.#defaultKeyId) {
        return JSON.parse(localStorage.getItem(key));
  }
    
  // set RAW storage
  setItem_(key = this.#defaultKeyId, value) {
        localStorage.setItem(key, JSON.stringify(value));
  }

  // convert ArrayofObjects to ArrayOfArray[2]
  from_ObjectsArray_(arr = this.getItem_(this.#defaultKeyId)) {
    const result = arr.map(item => [
      item.refid, 
      { refid: item.refid, 
        Xurl: `${this.#Xurlbase}?param=${item.refid}`, 
        ts: item.ts, 
        category: 'biblical'}
      ]);
    return result;
  }
  
  // convert ArrayOfArray[2] to ArrayofObjects 
  to_ObjectsArray_(arr = this.cachedValue){
    return arr.map( (item) => {
        const [key,value] = item;
        return new Object({
          refid: value.refid, 
          ts: value.ts});
      })
  }   
  
//==============================================================================
// FETCH payload
// Method to fetch multiple URLs in parallel is a strict Model method

  async fetchParallel() {
  // references is #asEntry;
    const references = this.cachedValue;
    
    const fetchPromises = references.map(async (entry) => {
      // destructure one record being an array[2]
      const [key, value] = entry;

      if (value && value.Xurl) {
        try {
          this.isFetching = true;
          const response = await fetch(value.Xurl);
          if (response.ok) {
            const payload = await response.json();
            // all properties of value and payload are merged into one object
            return [ key, {...value, ...payload} ];
          } else {
            console.error(`Network response for ${value.Xurl} was not ok.`);
            return [ key, null ];
          }
        } catch (error) {
          console.error(`Fetch operation for ${value.Xurl} failed:`, error);
          return [key, null ];
        } finally {
            this.isFetching = false;
        }
      } else {
        return [ key, null ];
      };
    });
    
    // set asPayload when all promises are fulfilled
    this.asPayload = await Promise.all(fetchPromises);
    return this.asPayload //is optional
  }; // end of async function
  
  async getPayload() {
        if (this.asPayload !== null) {
            return this.asPayload;
        } else {
            if (!this.isFetching) {
                await this.fetchParallel();
            }
            while (this.isFetching) {
                await new Promise(resolve => setTimeout(resolve, 100));  // Wait for data fetching to complete
            }
            if (this.asPayload !== null) {
                return this.asPayload;
            } else {
                throw new Error('Failed to fetch data');
            }
        }
    }

} // end of class  mStor

//==============================================================================
// View
//==============================================================================

//==============================================================================
// Controller
//==============================================================================

//==============================================================================
// App
//==============================================================================

document.addEventListener('DOMContentLoaded', () => {

const model = new Model();
  model.m_init_load_();
  console.log(model);
//model.m_data.fetchParallel().then((res)=>console.log(res));  
//model.m_data.getPayload().then(data => console.log(data)).catch(error => console.error(error));


}) // end of DOM listener
