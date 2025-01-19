class Fetcher {
  constructor(ref = 'matt1:1') {
    this.urlbase = 'https://jsfapi.netlify.app/.netlify/functions/bgw';
    this.ref = ref;
    this.urlfull = this.getFullUrl();
    this.fetchData();
  }
  
  // Method to get the full URL with ?param=$ref
  getFullUrl() {
    return `${this.urlbase}?param=${this.ref}`;
  }
  
  async fetchData() {
    try {
      const response = await fetch(this.urlfull);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.handleData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  handleData(data) {
    console.log('Fetched data:', data);
    // You can process and use the fetched data here
  }
}

// Example usage:
  const fetcher = new Fetcher(); // Uses default ref value 'matt1:1'
  