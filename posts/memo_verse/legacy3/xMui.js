

// =============================================================================
// =============================================================================
class Xref {
  constructor(baseUrl = 'https://jsfapi.netlify.app/.netlify/functions/bgw', refid = 'gen1:1') {
    this.baseUrl = baseUrl;
    this.refid = refid;
  }

  // Method to get the baseUrl
  getBaseUrl() {
    return this.baseUrl;
  }

  // Method to set a new baseUrl
  setBaseUrl(newUrl) {
    this.baseUrl = newUrl;
  }

  // Method to get the refid
  getRefid() {
    return this.refid;
  }

  // Method to set a new refid
  setRefid(newRefid) {
    this.refid = newRefid;
  }

  // Method to turn refid into a URL with concatenation
  turnRefIntoUrl() {
    return `${this.baseUrl}?param=${encodeURIComponent(this.refid)}`;
  }

  // Property to get the item composed of refid and a timestamp
  get item() {
    const TS = new Date().toISOString();
    return { refid: this.refid, TS: TS };
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
}

// Example usage
const myXref = new Xref();
console.log(myXref.item); // Output: { refid: 'gen1:1', TS: '2024-12-17T21:20:00.000Z' }

myXref.fetchAndMerge().then((e) => {console.log(e)});

// =============================================================================
class StorageArray {
  constructor() {
    this.key = 'myRefArray';
  }

  getArray() {
    const storedArray = localStorage.getItem(this.key);
    return storedArray ? JSON.parse(storedArray) : [];
  }

  setArray(array) {
    localStorage.setItem(this.key, JSON.stringify(array));
  }

  addItem(refid) {
    const array = this.getArray();
    const item = { refid, TS: new Date().toISOString() };
    array.push(item);
    this.setArray(array);
  }

  removeItem(refid) {
    let array = this.getArray();
    array = array.filter(arrayItem => arrayItem.refid !== refid);
    this.setArray(array);
  }

  clearArray() {
    localStorage.removeItem(this.key);
  }

  getLastItem() {
    const array = this.getArray();
    return array[array.length - 1];
  }

  getRandomItem() {
    const array = this.getArray();
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  getReverseArray() {
    const array = this.getArray();
    return array.slice().reverse();
  }
}

class Xmui {
  constructor() {
    this.storageArray = new StorageArray();
    this.createShowAllButton();
    this.storageItemsContainer = document.createElement('div');
    document.body.appendChild(this.storageItemsContainer);
  }

  createShowAllButton() {
    this.showAllButton = document.createElement('button');
    this.showAllButton.id = 'showAll';
    this.showAllButton.textContent = 'All';
    this.showAllButton.addEventListener('click', () => this.showAllItems());
    document.body.appendChild(this.showAllButton);
  }

  showAllItems() {
    const items = this.storageArray.getArray();
    this.storageItemsContainer.innerHTML = ''; // Clear previous items

    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.textContent = `RefID: ${item.refid}, Timestamp: ${item.TS}`;
      this.storageItemsContainer.appendChild(itemElement);
    });
  }
}

// Initialize Xmui class
document.addEventListener('DOMContentLoaded', () => {
  new Xmui();
});