// fast_mvc.js
// m_things belong to Model
// v_things belong to View
// c_things belong to Controller
// a_things belong to Application

//==============================================================================
// Model aka Data
//==============================================================================

// App
class App {

  constructor() {
    this.m_data = new mStorage();
    this.v_ui = new View();
    this.c_addEventListeners();
    this.version = '0.2.3 write_storage'; 

  } // end of constructor

//------------------------------------------------------------------------------  
// the Payload is gained outside the constructors because of async fetches
  m_init_load_() {
    this.m_data.fetchParallel()
    .then(data => this.v_mapHTML(data)).catch(error => console.error(error));
  }

//------------------------------------------------------------------------------
// display an Array
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
    this.v_ui.refUl = ul;  
    anchor.appendChild(ul);
    return this.v_ui.refUl;
  }
  
  //------------------------------------------------------------------------------
  // this is App
  c_addEventListeners() {
    this.v_ui.helpButton.addEventListener('click', this.v_helpme.bind(this));
    this.v_ui.randomButton.addEventListener('click', this.v_randomPayload.bind(this));
    this.v_ui.viewButton.addEventListener('click', this.v_input.bind(this));
    this.v_ui.allButton.addEventListener('click', this.v_allPayload.bind(this));
    this.v_ui.refButton.addEventListener('click', this.v_getUniqueRefids.bind(this));
/*    this.view.deleteButton.addEventListener('click', () => this.removeLastRef());
*/
}

  async v_input() {
    const inputValue = this.v_ui.v_getInputField();

    switch(inputValue) {
      case null :
        console.log( "NULL input does nothing");
        break;
      case "" :
        console.log( "empty string input does v_lastPayload");
        this.v_lastPayload();
//        this.model.data.refs.lastPayload().then((res) => this.view.mapHTML(res));
        break;  
      case "?version" :
        console.log( "version: "+ this.version);
        break;
      default:
        console.log( "added NOT null input " + inputValue);

        this.m_data.addValue = this.m_data.from_ObjectsArray_(this.m_data.build_ObjectsArray_(inputValue));
        this.m_data.returnFetchParallel(this.m_data.addValue)
        .then(data => {
          this.v_mapHTML(data);
        })
        .catch(error => console.error(error));

        this.v_addPayload()
        .then((res) => {
          this.m_data.cachedValue = res;
          this.m_data.write_storage_();
        })
        
        this.v_ui.v_clearInputField();
      }}

//------------------------------------------------------------------------------
  async v_addPayload() {
    let promArray = [this.m_data.asPayload, this.m_data.addPayload];
    const [merge,add] = await Promise.all(promArray);
    merge.push(...add);
    this.m_data.asPayload = Promise.resolve(merge);
    return this.m_data.asPayload
  }
 
  v_helpme() {
    const ul = document.getElementById('resultDiv');
      ul.innerHTML = null;
    const liElements = [];
    const li = document.createElement('li');
      li.textContent = this.version; // Initial placeholder text
      ul.appendChild(li);
  }
  
  // for lastEntry 
  v_lastPayload() {
    this.m_data.asPayload
    .then(data => {
      const result = Array.from(data).slice(-1);
      this.v_mapHTML(result)})
    .then(() => console.log("lastPayload"))
    .catch(error => console.error(error));
  }
  
    // for lastEntry 
  v_allPayload() {
    this.m_data.asPayload
    .then(data => this.v_mapHTML(data))
    .then(() => console.log("allPayload"))
    .catch(error => console.error(error));
  }
  
  v_randomPayload() {
    this.m_data.asPayload
    .then(data => {
      const myload = Array.from(data);
      const randomIndex = Math.floor(Math.random() * myload.length);
      const result = myload.slice(randomIndex, randomIndex + 1);
      this.v_mapHTML(result)})
    .then(() => console.log("randomPayload"))
    .catch(error => console.error(error));
  }
  
  // Method to retrieve UNIQUE refids
  v_getUniqueRefids() {
      
    this.m_data.asPayload
    .then(data => {
      const refidSet = new Set();
      
      const myload = Array.from(data);
      myload.forEach((element) => {
        const [key,value] = element;
        refidSet.add(key);
      });
    return Array.from(refidSet);
    })
  }
  
} // end of Class App

//------------------------------------------------------------------------------
// mStorage 
class mStorage {
  #version;
  #defaultKeyId;
  #initValue;
  #Xurlbase;
  #refSource;

  constructor(defaultKeyId = 'refidArray', 
              initValue    = "gen1:1") {
    this.#version       = '0.1.5 v_ui, m_init_load_, getPayload, fetchParallel '; 
    this.#defaultKeyId  = defaultKeyId;
    this.#initValue     = initValue;
    this.#Xurlbase      = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
//    this.#Xurlbase      = 'https://bg_worker.pjafischer.workers.dev/bgw/search';
    
    this.asPayload = null;  // Initialize the data property

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

// build an Array of one Object {refid, ts}
  build_ObjectsArray_(arg= this.#initValue){
    const arr = [];
    const record =  new Object({
      refid: arg, 
      ts: new Date().toISOString()});
    arr.push(record);
    return arr;
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
  
// method as mStorage.returnFetchParallel
// ... to fetch multiple URLs in parallel is a strict Model method
  async returnFetchParallel(ref = this.cachedValue) {
  // references is #asEntry;
    const references = ref;

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
            console.error(`Network response for ${value.Xurl} was not ok.`);
            return [ key, null ];
          }
        } catch (error) {
          console.error(`Fetch operation for ${value.Xurl} failed:`, error);
          return [key, null ];
        } finally {}
      } else {
        return [ key, null ];
      };
    });
    
// JUST RETURN the Promise.all, no property is impacted here
    this.addPayload = Promise.all(fetchPromises);
    return this.addPayload;
  }; // end of async function
  
  async fetchParallel() {
  // references is #asEntry;
    const references = this.cachedValue;
    
    // Record the start time
    const startTime = Date.now();

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
            console.error(`Network response for ${value.Xurl} was not ok.`);
            return [ key, null ];
          }
        } catch (error) {
          console.error(`Fetch operation for ${value.Xurl} failed:`, error);
          return [key, null ];
        } finally {}
      } else {
        return [ key, null ];
      };
    });
    
    // set asPayload when all promises are fulfilled
//    this.asPayload = await Promise.all(fetchPromises);
    this.asPayload = Promise.all(fetchPromises);
    
    // Record the end time
    const endTime = Date.now();
    // Calculate the response time
    const responseTime = endTime - startTime;
    console.log(1000*responseTime);
    
    return this.asPayload //is optional
  }; // end of async function
    
//------------------------------------------------------------------------------
// when getPayload finishes, the payload IS returned fulfilled 
async getPayload() {
 // if payload is not available, then fetch it   
 if (this.asPayload !== null) {
          console.log("not null");
          return this.asPayload;
        } else {
           // start fetching if not done
            if (!this.isFetching) {
              await this.fetchParallel();
            } else {
            // Wait for termination of fetch  
                while (this.isFetching) {
                  console.log(new Date().toISOString());
                  await new Promise(resolve => setTimeout(resolve, 100));  // Wait for data fetching to complete
                }
            }
          return this.asPayload;
        }
    }
    
} // end of class  mStor

//==============================================================================
// View
//==============================================================================
//==============================================================================
class View {

  constructor() {
    this.v_container =  document.getElementById('mainAnchor');

    this.v_createMainDiv();
    this.v_addInputAndButtons();
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
      
//      this.ul = document.createElement('ul');
//      this.ul.id = "resultList";
//      this.outputDiv.appendChild(this.ul);
      
      this.resultDiv = document.createElement('div');
      this.resultDiv.id = "resultDiv";
      this.resultDiv.innerHTML = "Waiting for Loading Data...";
      this.outputDiv.appendChild(this.resultDiv);

    // assemble the divs into contaner
      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);
      this.v_container.appendChild(this.mainDiv);
    }
    // Create a new ul element
    const ul = document.createElement('ul');
      ul.innerHTML = "empty"
      this.refUl = ul;
  } // createMainDiv
  
  //------------------------------------------------------------------------------
  v_addInputAndButtons() {
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
//    this.buttonDiv.appendChild(this.deleteButton);
    this.buttonDiv.appendChild(this.helpButton);

  // Appends two divs to the container
    this.inputDiv.appendChild(this.rowDiv);
    this.inputDiv.appendChild(this.buttonDiv);
  } // end of addInputAndButtons
  
  v_getInputField() {
    return this.inputField.value;
  }

  v_clearInputField() {
    this.inputField.value = '';
  }
  
} // end of class View

//==============================================================================
// Controller
//==============================================================================

//==============================================================================
// App
//==============================================================================

document.addEventListener('DOMContentLoaded', () => {

const app = new App();
  app.m_init_load_();
//  app.v_lastPayload();

  console.log(app);


}) // end of DOM listener
