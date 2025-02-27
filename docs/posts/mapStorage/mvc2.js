// MVC2.js

//==============================================================================
//==============================================================================
class Model {
  constructor() {
//    this.data = [];
    this.data = new mStor();
  } // end of constructor

// return entire Model after async payload !
async init_load_() {
  const payload = await this.data.refs.fetchParallel();
  return this;
} // end of init_load_

}

//==============================================================================
//==============================================================================
class mStor {
  #Xurlbase;
  #refSource;
  #refEntries;

  constructor() {
    const refEntries = localStorage.getItem('refEntries');
    const refidArray = localStorage.getItem('refidArray');
    this.#Xurlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    this.#refEntries = null;
    
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
      this.#refEntries = new Array([['gen1:1', { refid: 'gen1:1',  Xurl: `${this.#Xurlbase}?param=${'gen1:1'}`,ts: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
      this.refs = new nRefs(this.#refEntries);
    }
  } // END of constructor
  
// =============================================================================  
// GETTER SETTER methods

  // Getter for #refEntries
  get refEntries() {
    return Array.from(this.#refEntries);
  }

  // ADDREF
  async addRef_(item = "Rom5:8") {
    this.addref = new nRefs(item);
    return await this.addref.fetchParallel();
  }
  
  // MERGE
    async XXmergeRefs_() {
      const refs = await this.refs.asPayload();
      console.log(refs);
      const addref = await this.addref.asPayload();
      refs.push(...addref);
    return this.refs.asPayload();
  }
} // end of class mStor

//==============================================================================
//==============================================================================
class nRefs {
  #Xurlbase;
  #asEntry;
////  #dummy_button;

//==============================================================================
// CONSTRUCTORs ...

  constructor(arg = "gen1:1", 
              Xurlbase= 'https://jsfapi.netlify.app/.netlify/functions/bgw') {
    this.#Xurlbase = Xurlbase;
    this.asPayload = [];
////    this.#dummy_button = document.createElement('button'); // supports event firing

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
      
/*
// LISTEN and react to 'payload_ready' signal
      // listener can be implemented in View or preferrably Controller 
      this.#dummy_button.addEventListener('payload_ready', function() {console.log("passed ready")});
*/

  } // end of constructor nRefs

//==============================================================================
// Getter Setter ...
  
  // Getter for #asEntry
  get asEntry() {
    return Array.from(this.#asEntry);
  }
  
   // a mere GETTER returning a PROMISE for Payload
  async XXasPayload() {
      const data = await this.asPayload;
      return Array.from(data).slice();
  }

  // Getter for a in refMap's random entry as MAP
  async randomPayload() {
    const data = await this.asPayload;
    const myload = Array.from(data);
    const randomIndex = Math.floor(Math.random() * myload.length);
    return myload.slice(randomIndex, randomIndex + 1);
  }
  
  // ASYNC for lastEntry 
  async lastPayload() {
    const data = await this.asPayload;
    return Array.from(data).slice(-1);
  }

 
      
//==============================================================================
// FETCH payload

   // Method to fetch multiple URLs in parallel is a strict Model method
   //
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
            console.error(`Network response for ${value.Xurl} was not ok.`);
            return [ key, null ];
          }
        } catch (error) {
          console.error(`Fetch operation for ${value.Xurl} failed:`, error);
          return [key, null ];
        }
      } else {
        return [ key, null ];
      };
    });
    
    // set asPayload when all promises are fulfilled
    this.asPayload = await Promise.all(fetchPromises);
//    console.log(this.asPayload); // is fulfilled value

    // DISPATCH event signalling 'payload_ready'
    // source of firing must be in concerned object becoming ready
////    const data_ready_event = new Event('payload_ready');
////    this.#dummy_button.dispatchEvent(data_ready_event);
    
    return this.asPayload //is optional
  }; // end of async function
  
} // end of class nRefs

//==============================================================================
class View {
  #refUl;
  
  constructor() {
    this.container =  document.getElementById('mainAnchor') 
    this.button = document.createElement('button');
      this.button.textContent = 'Add Item';
    this.list = document.createElement('ul');
    
    this.createMainDiv();
    this.addInputAndButtons();
  }
  
//------------------------------------------------------------------------------  
    createMainDiv() {
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
      this.outputDiv.appendChild(this.resultDiv);

    // assemble the divs into contaner
      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);
      this.container.appendChild(this.mainDiv);
      
    // Create a new ul element
    const ul = document.createElement('ul');
      ul.innerHTML = "empty"
      this.#refUl = ul;
      
    }
  } // createMainDiv
  
  // =========================================================================
    // CREATE HTML tags
 
  
//------------------------------------------------------------------------------
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
  } // addInputAndButtons
//------------------------------------------------------------------------------

  getInputField() {
    return this.inputField.value;
  }

  clearInputField() {
    this.inputField.value = '';
  }

  // =============================================================================  
// DISPLAY methods  in VIEW

  mapHTML(refMap){
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
    this.#refUl = ul;  
    anchor.appendChild(ul);
    return this.#refUl
  }
} // end of VIEW

//==============================================================================
//==============================================================================
class Controller {
  #version;

  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.#version = "2.2.0 ViRaAl reverse";

// ADD the LISTENERS
    this.addEventListeners();
  } // end of constructor

init_display_() {
//  this.model.data.refs.fetchParallel().then((res)=> this.displayParallel(res));
  this.displayParallel();
  alert('controller');  
}

//------------------------------------------------------------------------------
// Getter Setter of ...
  get version() {
    return this.#version;
  }

//------------------------------------------------------------------------------
  addEventListeners() {
    this.view.randomButton.addEventListener('click', this.viewRandom.bind(this));
    this.view.helpButton.addEventListener('click', this.viewLast.bind(this));
    this.view.viewButton.addEventListener('click', this.viewInput.bind(this));
    this.view.allButton.addEventListener('click', this.viewAll.bind(this));
/*    this.view.refButton.addEventListener('click', () => this.refOnly());
    this.view.deleteButton.addEventListener('click', () => this.removeLastRef());
*/
}

//------------------------------------------------------------------------------
// HANDLERS methods
// HELP texts
  async helpme() {
    const ul = document.getElementById('resultList');
      ul.innerHTML = null;
    const liElements = [];
    const li = document.createElement('li');
      li.textContent = this.version; // Initial placeholder text
      ul.appendChild(li);
  }
  
  async viewAll() {
 //   this.model.data.refs.asPayload().then((res) => this.view.mapHTML(res));
    this.view.mapHTML(await this.model.data.refs.asPayload);
  }
  
  async viewRandom() {
    this.model.data.refs.randomPayload().then((res) => this.view.mapHTML(res));
  }
  
  async viewLast() {
    this.model.data.refs.lastPayload().then((res)=> this.view.mapHTML(res));
  }
  
  async viewInput() {
    const inputValue = this.view.getInputField();

    switch(inputValue) {
      case null :
        console.log( "NULL input does nothing");
        break;
      case "" :
        console.log( "empty string input does viewLast");
        this.viewLast();
//        this.model.data.refs.lastPayload().then((res) => this.view.mapHTML(res));
        break;  
      case "?version" :
        console.log( "version: "+ this.version);
        break;
      default:
        console.log( "added NOT null input " + inputValue);
        this.model.data.addRef_(inputValue)
        .then((res) => {
          this.model.data.refs.asPayload.push(...res);
          this.view.mapHTML(res);
          });

//        this.model.data.refs.asPayload.push(...this.model.data.addref.asPayload)
        /*        .then((res)=> this.model.data.mergeRefs_())
        .then((res)=> this.view.mapHTML(res));
*/        
//    this.view.justRenderItems([inputValue,'itsme']);
        this.view.clearInputField();
      }}
  
    // shall be moved to Controller because it interacts with Model.data and View
  displayParallel(refs = this.model.data.refs) {
    try{
      if(!refs.asPayload) {
        refs.fetchParallel();
      }
//      const payload_shallow = refs.asPayload;
      return this.view.mapHTML(refs.asPayload);
    } catch ( error) {
      console.error('Error', error)
    }
  } // end of displayParallel
}  // end of Controller


//==============================================================================
//==============================================================================

//==============================================================================
// LAUNCH the APP
document.addEventListener('DOMContentLoaded', () => {

/*
  const addref = new nRefs('ps10');
//    console.log(addref); // is.null(asPayload)
//    console.log(addref.fetchParallel()); // return value is a Promise of asPayload 

// NB: all LOGIC for payload_ready event is embedded in nRefs class
  addref.fetchParallel()
  .then((res) => {console.log(res);}); // when Promise is fulfilled
*/


// MODEL
  const model = new Model();
//  model.data.refs.fetchParallel().then((res)=> console.log(res));
// OR
    model.init_load_().then((res) => console.log(res)); // is full model 

// VIEW
  const view = new View();

// CONTROLLER
  const controller = new Controller(model, view);
  

}) // end of DOM listener
//==============================================================================
