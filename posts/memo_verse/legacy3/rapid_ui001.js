class MUI {
  constructor() {
    this.container = document.body;

    this.createMainDiv();
    this.addInputAndButtons();
    this.addEventListeners();
    
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    this.storageArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
  }

  createMainDiv() {
    // Check if mainDiv already exists
    if (!document.getElementById('mainDiv')) {
      this.mainDiv = document.createElement('div');
      this.mainDiv.id = 'mainDiv';

      this.inputDiv = document.createElement('div');
      this.inputDiv.id = 'inputDiv';

      this.outputDiv = document.createElement('div');
      this.outputDiv.id = 'outputDiv';

      this.mainDiv.appendChild(this.inputDiv);
      this.mainDiv.appendChild(this.outputDiv);

      this.container.appendChild(this.mainDiv);
    }
  }

  addInputAndButtons() {
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.placeholder = 'Enter text here';

    this.viewButton = document.createElement('button');
    this.viewButton.textContent = 'View';

    this.randomButton = document.createElement('button');
    this.randomButton.textContent = 'Random';

    this.allButton = document.createElement('button');
    this.allButton.textContent = 'All';

    this.inputDiv.appendChild(this.inputField);
    this.inputDiv.appendChild(this.viewButton);
    this.inputDiv.appendChild(this.randomButton);
    this.inputDiv.appendChild(this.allButton);
  }

  addEventListeners() {
    this.viewButton.addEventListener('click', () => this.viewInput());
    this.randomButton.addEventListener('click', () => this.viewRandom());
    this.allButton.addEventListener('click', () => this.viewAll());
  }

  async viewInput() {
    const inputValue = this.inputField.value;
    const myRefArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
    const timestamp = new Date().toISOString();
  }

  async viewRandom() {
  //  
  }

  async viewAll() {
     this.augmentAndPopulateArray();
  }
  
  // Method to get the full URL with ?param=$ref
  getFullUrl(ref) {
        const url = `${this.urlbase}?param=${ref}`;
        console.log('Generated URL:', url);
        return url;
    }
    
  // Method to fetch the URL and merge its data result with item
  async fetchAndMerge() {
    try {
      const response = await fetch(this.turnRefIntoUrl());
      const fetchedData = await response.json();
      return { ...this.item, ...fetchedData };
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }  
  
    displayLiHtml(li, responseObject) {
      li.innerHTML = `Refid: ${responseObject.refid} <br> Content: ${responseObject.content} <br> Timestamp: ${responseObject.TS}`;
    }
  
  async augmentAndPopulateArray() {
            const arr = this.storageArray;
            const ul = document.getElementById('resultList');
            const liElements = [];
            
            // Create LI elements and keep references in an array
            arr.forEach(obj => {
              const li = document.createElement('li');
              li.textContent = 'Loading...'; // Initial placeholder text
              ul.appendChild(li);
              liElements.push(li);
            });
            
            // Fetch data in parallel and update LI elements as promises resolve
            const fetchPromises = arr.map(async (obj, index) => {
              // Generate URL from refid property
//              const url = `https://api.example.com/data/${obj.refid}`;
              const url = this.getFullUrl(obj.refid);
              try {
                const response = await fetch(url);
                const data = await response.json(); // Assuming the response is in JSON format

                const xtd_response =  { ...obj, ...data };
                
                // Augment the object with the fetched data
                obj.xtd_response = xtd_response;
                
                // Update the corresponding LI element
//                liElements[index].textContent = JSON.stringify(xtd_response); 
                this.displayLiHtml(liElements[index], xtd_response) 
                
              } catch (error) {
                console.error(`Failed to fetch data from ${url}:`, error);
                liElements[index].textContent = `Error loading ${url}`;
              }
              return obj;
            });
            
            // Wait for all fetch promises to complete
            await Promise.all(fetchPromises);
          }
  
} /// end of class MUI

// Retrieve array from localStorage and parse it
//const myArray = JSON.parse(localStorage.getItem('myRefArray')) || [];
//console.log(myArray);

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
  const muiInstance = new MUI();
});

