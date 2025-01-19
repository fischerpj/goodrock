export class bibRef2 {
  
  constructor(ref = "gen1:1") {
    this.ref = ref;
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    this.urlfull = this.getFullUrl();
  } // end of constructor
  
  // Method to get the full URL with ?param=$ref
  getFullUrl() {
    return `${this.urlbase}?param=${this.ref}`;
  }
  
  init() {
      return fetch(this.urlfull)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
          this.asyncData = data;
          return this;  // Ensure the promise resolves with the data
          })
  }
} // end of class

function createMyRef_(ref = "gen1:1"){
  let x = new bibRef2(ref);
  return x.init();
}

createMyRef_('ex2:2')
  .then(obj => { console.log(obj.asyncData)})
  .catch(err => { console.log(err + " in bibRef2")});