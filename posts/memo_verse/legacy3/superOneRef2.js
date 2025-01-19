// superOneRef combines bibRef awith superOne
// superStorage coerces storageItem.cache to superArray offering methods: [get_random, accumulate_through]

import { storageItem } from './storageItem.js';
import { bibRef } from './bibgw.js';
import { miniUI } from './miniUI.js';

class miniUI {
    constructor(storageItem) {
        // Store the storageItem argument as a property of the instance
        this.storageItem = storageItem;

        // Create mainDiv
        this.mainDiv = document.createElement('div');
        this.mainDiv.id = 'mainDiv';

        // Create inputDiv
        this.inputDiv = document.createElement('div');
        this.inputDiv.id = 'inputDiv';
        this.inputDiv.innerHTML = `
            <input type="text" id="inputField" placeholder="Enter text here">
            <button id="echoButton">Store</button>
            <button id="randomButton">Random</button>
            <button id="allButton">All</button>
        `;
        
        // Create outputDiv
        this.outputDiv = document.createElement('div');
        this.outputDiv.id = 'outputDiv';
        this.outputDiv.innerHTML = 'Output will be displayed here';

        // Create randomDiv
        this.randomDiv = document.createElement('div');
        this.randomDiv.id = 'randomDiv';

        // Append inputDiv, outputDiv, and randomDiv to mainDiv
        this.mainDiv.appendChild(this.inputDiv);
        this.mainDiv.appendChild(this.outputDiv);
        this.mainDiv.appendChild(this.randomDiv);

        // Append mainDiv to the body
        document.body.appendChild(this.mainDiv);
        
        this.initializeRandomDiv(); // Initialize at build time

        // Add event listeners to the buttons using bind
        this.addEventListeners();
    }
    
    addEventListeners() {
        const echoButton = document.getElementById('echoButton');
        echoButton.addEventListener('click', this.echoInput.bind(this));

        const randomButton = document.getElementById('randomButton');
        randomButton.addEventListener('click', this.initializeRandomDiv.bind(this));

        const allButton = document.getElementById('allButton');
        allButton.addEventListener('click', this.showAllKeys.bind(this));
    }
    
    echoInput() {
        const inputField = document.getElementById('inputField');
        const outputDiv = document.getElementById('outputDiv');
        const discard_this = this.storageItem.accumulate_through(inputField.value);
        outputDiv.innerHTML = inputField.value;
        // for memozy this.storageItem.getLastElement();
        // Empty the input field after updating outputDiv
        inputField.value = '';
    }

/*
    echoInput() {
        const inputField = document.getElementById('inputField');
        const outputDiv = document.getElementById('outputDiv');
        outputDiv.innerHTML = inputField.value;
        // Call accumulate_through with the input field value
        if (this.storageItem && typeof this.storageItem.accumulate_through === 'function') {
            this.storageItem.accumulate_through(inputField.value);
        }
        // Empty the input field after updating outputDiv
        inputField.value = '';
    }
*/

    initializeRandomDiv() {
      console.log("from initializeRandomDiv");
        if (this.storageItem && typeof this.storageItem.get_random === 'function') {
            this.randomDiv.innerHTML = this.storageItem.get_random().toString();
        } else {
            this.randomDiv.innerHTML = 'Storage item does not have a get_random method';
        }
    }
    
    showAllKeys() {
        const outputDiv = document.getElementById('outputDiv');
        if (this.storageItem && typeof this.storageItem.getAllKeys === 'function') {
//            outputDiv.innerHTML = this.storageItem.getAllKeys().join(', ');
            this.randomDiv.innerHTML = this.storageItem.read_cache().toString();
        } else {
            outputDiv.innerHTML = 'Storage item does not have a getAllKeys method';
        }
    }
}


// Instantiate miniUI class to add divs to the DOM and pass a storageItem
const uiInstance = new miniUI(storage);
console.log(uiInstance.storageItem.get_random().toString()); // Output: { key: 'value' }

