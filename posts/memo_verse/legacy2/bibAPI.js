class BibRef {
  #version;
  #content;

  constructor(ref = "gen1:1") {
    this.ref = ref;
    this.#version = '2.1'; // Initialize the private property version
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

  // Method to get the response
  async getResponse() {
    if (this.#content === null) {
      const url = this.getFullUrl();
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.#content = await response.json();
      } catch (error) {
        console.error('Error fetching content:', error);
        return null;
      }
    }
    return this.#content;
  }

  // Method to get the content attribute of the response
  async getContent() {
    const response = await this.getResponse();
    return response ? response.content : null;
  }
}

// Example usage
const bibRef = new BibRef();
console.log(bibRef.getReference()); // Outputs: gen1:1
console.log(bibRef.getVersion()); // Outputs: 2.1
console.log(bibRef.getUrlBase()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw
console.log(bibRef.getFullUrl()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw?param=gen1:1

// Fetching and logging content asynchronously
bibRef.getContent().then(content => {
  if (content) {
    console.log('Content:', content);
  } else {
    console.log('Failed to fetch content.');
  }
});

bibRef.setReference('ex2:3');
console.log(bibRef.getReference()); // Outputs: ex2:3
console.log(bibRef.getFullUrl()); // Outputs: https://jsfapi.netlify.app/.netlify/functions/bgw?param=ex2:3

// Fetching and logging updated content asynchronously
bibRef.getContent().then(content => {
  if (content) {
    console.log('Updated content:', content);
  } else {
    console.log('Failed to fetch updated content.');
  }
});
