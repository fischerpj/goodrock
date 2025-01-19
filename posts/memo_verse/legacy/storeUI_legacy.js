class BibRef {
  #version;
  #content;

  constructor(ref = "gen1:1") {
    this.ref = ref;
    this.#version = '2.0'; // Initialize the private property version
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw'; // Initialize the urlbase property
    this.fullUrl = `${this.urlbase}?param=${this.ref}`; // Initialize the fullUrl property
    this.#content = null; // Initialize the content property
  }

  // Method to get the version
  getVersion() {
    return this.#version;
  }

  // Method to get the reference
  getReference() {
    return this.ref;
  }

  // Method to set a new reference and update the full URL
  setReference(newRef) {
    this.ref = newRef;
    this.fullUrl = `${this.urlbase}?param=${this.ref}`;
    this.#content = null; // Reset content when reference changes
  }

  // Method to get the urlbase
  getUrlBase() {
    return this.urlbase;
  }

  // Method to get the full URL
  getFullUrl() {
    return this.fullUrl;
  }

  // Getter method for content
  get content() {
    if (this.#content === null) {
      this.fetchContent().then(data => {
        this.#content = data;
      });
    }
    return this.#content;
  }

  // Async method to fetch content from the full URL
  async fetchContent() {
    const url = this.getFullUrl();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  }
}

// Example usage
const bibRef = new BibRef();
console.log(bibRef.getReference()); // Outputs: gen1:1
console.log(bibRef.getVersion()); // Outputs: 2.0
console.log(bibRef.getUrlBase()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw
console.log(bibRef.getFullUrl()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw?param=gen1:1

// Accessing the content using the getter
console.log(bibRef.content); // Outputs the fetched content or null if not yet fetched

bibRef.setReference('ex2:3');
console.log(bibRef.getReference()); // Outputs: ex2:3
console.log(bibRef.getFullUrl()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw?param=ex2:3

// Accessing the updated content using the getter
console.log(bibRef.content); // Outputs the updated fetched content or null if not yet fetched
