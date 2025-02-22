// newRefs in mstor.js
// todo removeLast with splice

//==============================================================================
// the UI ...

class MUI {
  #version;
  storageArray;

  constructor() {
    this.#version = "2.0.0";
    this.container =  document.getElementById('mainAnchor') 

    this.createMainDiv();
    this.addInputAndButtons();
    this.addEventListeners();
    
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    this.storageArray = new mStor();
  }

//==============================================================================
// Getter Setter ...
  
  // Getter for #version
  get version() {
    return this.#version;
  }
  
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

    // assemble the divs into contaner
      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);
      this.container.appendChild(this.mainDiv);
      
    }
  } // createMainDiv

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

  addEventListeners() {
    this.helpButton.addEventListener('click', () => this.helpme());
    this.randomButton.addEventListener('click', () => this.viewRandom());
    this.viewButton.addEventListener('click', () => this.viewInput());
    this.allButton.addEventListener('click', () => this.viewAll());
    this.refButton.addEventListener('click', () => this.refOnly());
    this.deleteButton.addEventListener('click', () => this.removeLastRef());
  }

//==============================================================================
// HANDLERS

// HELP texts
  async helpme() {
    const ul = document.getElementById('resultList');
      ul.innerHTML = null;
    const liElements = [];
    const li = document.createElement('li');
      li.textContent = this.version; // Initial placeholder text
      ul.appendChild(li);
  }
  
  async viewRandom() {
//    const result = await this.augmentAndPopulateArray(this.storageArray.getRandom());
  }
  
  async viewInput() {
    const inputValue = this.inputField.value;
    
    switch(inputValue) {
      case null :
        console.log( "NULL input does nothing");
        break;
      case "?version" :
        console.log( "version: "+ this.storageArray.version);
        break;
      default:
        console.log( "added NOT null input" + inputValue);
/*
        this.storageArray.addElement(inputValue);
        const result = await this.augmentAndPopulateArray(this.storageArray.getLast());
        console.log(this.storageArray.getLast().toString());
*/
} 
    
//    const refidArray = JSON.parse(localStorage.getItem('refidArray')) || [];
//    const timestamp = new Date().toISOString();
    // Empty the input field after updating outputDiv
    this.inputField.value = null;
  }
  


  async viewAll() {
//     const result = await this.augmentAndPopulateArray( this.storageArray.getReverse());
  }
  
} /// end of class MUI


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
    const anchor = document.getElementById('resultList');
//    anchor.innerHTML = '';
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
  const ms = new mStor();
  // fetch refs and display in UI
  ms.refs.fetchParallel().then((res) => {
    console.log(res.asKeys);
//      ms.mapHTML(res.asPayload);
    });
*/    
  const muiInstance = new MUI();
//  console.log(muiInstance);
  
  // fetch refs and display in UI
  muiInstance.storageArray.refs.fetchParallel().then((res) => {
//      console.log(res.asMap);
//      console.log(res.asKeys);
      muiInstance.storageArray.mapHTML(res.asPayload);
    });

/*
// single ref
   const nref = new nRefs('ps10:5');
    console.log(nref);
*/    

/*
    // fetch refs and display in UI
    ms.refs.fetchParallel().then((res) => {
//      console.log(res.asMap);
      console.log(res.asKeys);
      ms.mapHTML(res.asPayload);
    });
*/

/*
    // fetch addref and display in UI
    ms.addref.fetchParallel().then((res) => {
      ms.mapHTML(res.asPayload);
    });
*/

})  // end of dom listener

    