// MVC_store.js
// DO mapHTML !!

//==============================================================================
class Model {
  constructor() {
//    this.data = [];
    this.data = new mStor();
  }

// INITIAL PAYLOAD with fetch
  async load_init_() {
    return await this.data.refs.fetchParallel()
  }
  
  addItem(item) {
    this.data.push(item);
  }

  getAllItems() {
//    return this.data;
    return this.data.refs.asPayload();
  }
}

// =============================================================================
// =============================================================================
class mStor {
  #Xurlbase;
  #refSource;
  #refEntries;

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
      this.#refEntries = new Array([['gen1:1', { refid: 'gen1:1',  Xurl: `${this.#Xurlbase}?param=${'gen1:1'}`,ts: '2025-01-20T09:28:00Z', category: 'biblical' }]]);
      this.refs = new nRefs(this.#refEntries);
    }
    // 
//    this.addref = new nRefs('matt1:1');
    
  } // END of constructor
  
// =============================================================================  
// GETTER SETTER methods

  // Getter for #refEntries
  get refEntries() {
    return Array.from(this.#refEntries);
  }
  
  async addRef_(item = "Rom5:8") {
    this.addref = new nRefs(item);
    return await this.addref.fetchParallel();
  }
  
  async mergeRefs_() {
    const refs = await this.refs.asPayload();
    const addref = await this.addref.asPayload();
    const merge = [...refs, ...addref];
    this.refs.setPayload(merge);
    return merge
  }
} // end of class mStor


//==============================================================================
class nRefs {
  #Xurlbase;
  #asEntry;
  #asPayload; 

//==============================================================================
// CONSTRUCTORs ...

  constructor(arg = "gen1:1", 
              Xurlbase= 'https://jsfapi.netlify.app/.netlify/functions/bgw') {
    this.#Xurlbase = Xurlbase;
    
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
  } // end of constructor nRefs

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
  
  // a mere GETTER retruning a PROMISE for Payload
  async asPayload() {
      const data = await this.#asPayload;
      console.log(data);
      return Array.from(data);
      }
  
   // ASYNC for Payload
  setPayload(arg) {
    this.#asPayload = arg;
  }
  
  // ASYNC for lastEntry 
  async lastPayload() {
    const data = await this.#asPayload;
    return Array.from(data).slice(-1);
  }
  
  // Getter for a in refMap's random entry as MAP
  async randomPayload() {
    const data = await this.#asPayload;
    const myload = Array.from(data);
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
    this.#asPayload = await Promise.all(fetchPromises);
    return this.#asPayload;

  }; // end of async function
  
} // end of class nRefs

//==============================================================================
class View {
  #refUl;
  
  constructor() {
    this.container =  document.getElementById('mainAnchor') 
//    this.input = document.createElement('input');
    this.button = document.createElement('button');
      this.button.textContent = 'Add Item';
    this.list = document.createElement('ul');
    
//    this.container.append(this.input, this.button, this.list);
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
/*      
      this.ul = document.createElement('ul');
      this.ul.id = "resultList";
      this.outputDiv.appendChild(this.ul);
*/      
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

/*  
  getInput() {
    return this.input.value;
  }
*/

  clearInputField() {
    this.inputField.value = '';
  }

  
  // =============================================================================  
// DISPLAY methods  in VIEW

  justRenderItems(items = ['otto','titit']){
    const anchor = document.getElementById('resultDiv');
    anchor.innerHTML = '';
    
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      anchor.appendChild(li);
    });
  }

  async mapHTML(refMap){
    // the DATA
    const result = refMap<reverse();
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
}

//==============================================================================
//==============================================================================
class Controller {
  #version;

  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.#version = "2.0.2 init_ +ViRaAl";

// ADD the LISTENERS
    this.addEventListeners();
  }

 // Initialisation of Controller
  init_() {
    this.model.load_init_()
    .then((res)=> {
      this.view.mapHTML(res);
      console.log("done init_")});
    }
  
//------------------------------------------------------------------------------
// Getter Setter of ...
  get version() {
    return this.#version;
  }

//------------------------------------------------------------------------------
/*
  handleAddItem() {
    const item = this.view.getInput();
    if (item) {
      this.model.addItem(item);
      this.view.clearInput();
      this.view.renderItems(this.model.getAllItems());
    }
  }
*/

  addEventListeners() {
    this.view.randomButton.addEventListener('click', this.viewRandom.bind(this));
    this.view.helpButton.addEventListener('click', this.helpme.bind(this));
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
    this.model.data.refs.asPayload().then((res)=> this.view.mapHTML(res));
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
        console.log( "added NOT null input" + inputValue);
        this.model.data.addRef_(inputValue).then((res)=> this.view.mapHTML(res));

/*
        this.storageArray.addElement(inputValue);
        const result = await this.augmentAndPopulateArray(this.storageArray.getLast());
        console.log(this.storageArray.getLast().toString());
*/
    }
//    this.view.justRenderItems([inputValue,'itsme']);
    this.view.clearInputField();
  }
}  

//==============================================================================
// LAUNCH the APP
document.addEventListener('DOMContentLoaded', () => {
  const model = new Model();
  // fetchParallel  returns the Promise for #asPayload
  // then executes as soon as fetchParallel is fulfilled
//  model.data.refs.fetchParallel().then((res)=>console.log(res));
// equivalent to 

  const view = new View();

  const controller = new Controller(model, view);
    controller.init_();

/*  
  // nb. load_init_ returns the promise of #asPayload retruned by fetchParallel 
  model.load_init_()
  .then(model.data.addRef_('Rev4:1'))
  .then((res) => {
    console.log(res);
    model.data.mergeRefs_()})
  .then((res) => {
      console.log(res);
      view.justRenderItems();
      controller.viewAll()
      });
*/
});

//==============================================================================
