// dom.js

export class Dom {
    constructor(id = 'mainDiv') {
        // Check if the div with the given id already exists
        let existingDiv = document.getElementById(id);
        if (!existingDiv) {
            // Create a new div element
            const newDiv = document.createElement('div');

            // Set the id and style of the new div
            newDiv.id = id;
            newDiv.style.backgroundColor = 'palegoldenrod';  // Example of a pale background color

            // Create a paragraph element with the text "this is mainDiv"
            const paragraph = document.createElement('p');
            paragraph.textContent = 'this is ' + id;

            // Append the paragraph to the new div
            newDiv.appendChild(paragraph);

            // Append the new div to the end of the body
            document.body.appendChild(newDiv);

            // Store a reference to the mainDiv
            this.mainDiv = newDiv;
        } else {
            // Store a reference to the existing div
            this.mainDiv = existingDiv;

            // Apply the background color to the existing div
            this.mainDiv.style.backgroundColor = 'palegoldenrod';
        }
    }

    // Method to add content to mainDiv
    addContent(content) {
        this.mainDiv.innerHTML += content;
    }
}

// Instantiate the Dom class with the default argument
const domInstance = new Dom();

// Add content to mainDiv
domInstance.addContent('<p>place additional payload here</p>');
