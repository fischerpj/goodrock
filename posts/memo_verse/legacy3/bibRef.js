import { Dom } from "./dom.js";

export class bibRef {
    constructor(ref = "gen1:1") {
        this.ref = ref;
        this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
        // Build the urlfull using the urlbase and ref argument
        this.urlfull = this.getFullUrl();
  
/*    
        // Create and append mainDiv to the body
        this.mainDiv = document.createElement('div');
        this.mainDiv.id = 'mainDiv';
        document.body.appendChild(this.mainDiv);
        
        // Create and append button to mainDiv
        this.fetchButton = document.createElement('button');
        this.fetchButton.id = 'fetchButton';
        this.fetchButton.innerHTML = 'Fetch Content';
        this.mainDiv.appendChild(this.fetchButton);

        // Create and append outputDiv to mainDiv
        this.outputDiv = document.createElement('div');
        this.outputDiv.id = 'outputDiv';
        this.outputDiv.innerHTML = 'Output will be displayed here';
        this.mainDiv.appendChild(this.outputDiv);

        // Add event listener to the button
        this.addEventListeners();
*/
}
    
  // Method to get the full URL with ?param=$ref
  getFullUrl() {
    return `${this.urlbase}?param=${this.ref}`;
  }
    
  // Getter for ref
    get reference() {
      return this.ref;
    }

  // Setter for ref
    set reference(newRef) {
      this.ref = newRef;
    }
    
  // Getter for _response
    get response() {
        return this._response;
    }

/*
    addEventListeners() {
        this.fetchButton.addEventListener('click', this.fetchContent.bind(this));
    }
    
        updateOutputDiv(data) {
//        this.outputDiv.innerHTML = data;
        // Display the JSON data in a readable format
        this.outputDiv.innerHTML = JSON.stringify(data, null, 2);
    }

*/    
    fetchContent() {
        return fetch(this.urlfull)
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
                this.asyncData = data;
////                this.updateOutputDiv(data.content);
                return data;  // Ensure the promise resolves with the data
            })
            .catch(error => {
                console.error('Error fetching data:', error);
//                this.updateOutputDiv('Error fetching data');
                return 'Error fetching data';
            });
    }
}

// Instantiate the Dom class with the default argument
const domInstance = new Dom();

// Instantiate bibRef class with a ref argument to add divs to the DOM and set up the button
const bibRefInstance = new bibRef("gen1:1");

// Use the getter to access the _response property
bibRefInstance.fetchContent().then((resp) => {domInstance.addContent(resp.content);});  

//console.log(bibRefInstance);  // This will initially be null until fetchContent is called