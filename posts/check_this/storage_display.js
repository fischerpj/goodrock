// storage.js

        document.addEventListener("DOMContentLoaded", () => {
            console.log("DOM fully loaded and parsed. Checking localStorage availability...");

            // Select the div with ID mainAnchor
            const outputElement = document.getElementById("mainAnchor");

            // Function to check if localStorage is available
            function isLocalStorageAvailable() {
                try {
                    const testKey = "__testKey__";
                    localStorage.setItem(testKey, "test");
                    localStorage.removeItem(testKey);
                    return true;
                } catch (e) {
                    return false;
                }
            }

            // Function to list all keys with additional features
            function listLocalStorageKeysAndContents() {
                if (!isLocalStorageAvailable()) {
                    outputElement.innerHTML = "<p>localStorage is not available.</p>";
                    return;
                }

                // Clear existing content
                outputElement.innerHTML = "<p>Listing all localStorage keys:</p>";
                const keysList = document.createElement("ul");

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = localStorage.getItem(key);

                    // Determine the type and length of the value
                    let valueType = "string"; // Default type
                    let valueLength = 0;
                    try {
                        const parsedValue = JSON.parse(value);
                        if (Array.isArray(parsedValue)) {
                            valueType = "array";
                            valueLength = parsedValue.length;
                        } else {
                            valueLength = value.length; // For strings or non-array objects
                        }
                    } catch (e) {
                        valueLength = value.length; // For plain strings
                    }

                    // Create list item for the key
                    const listItem = document.createElement("li");

                    // Add key name, type, and value length
                    listItem.textContent = `${key} (Type: ${valueType}, Length: ${valueLength})`;

                    // Create delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.style.marginLeft = "10px";

                    // Add an event listener to the delete button
                    deleteButton.addEventListener("click", () => {
                        localStorage.removeItem(key);
                        console.log(`Key '${key}' deleted from localStorage.`);
                        listLocalStorageKeysAndContents(); // Refresh the list
                    });

                    // Create display content button
                    const displayButton = document.createElement("button");
                    displayButton.textContent = "Display Content";
                    displayButton.style.marginLeft = "10px";

                    // Add an event listener to the display button
                    displayButton.addEventListener("click", () => {
                        // Clear previous content display
                        const previousDisplay = document.querySelector("#mainAnchor .contentDisplay");
                        if (previousDisplay) {
                            previousDisplay.remove();
                        }

                        // Create new content display
                        const contentParagraph = document.createElement("p");
                        contentParagraph.className = "contentDisplay";
                        try {
                            const parsedContent = JSON.parse(value);
                            contentParagraph.innerHTML = `<strong>Content of ${key}:</strong> ${JSON.stringify(parsedContent, null, 2)}`;
                        } catch (e) {
                            contentParagraph.innerHTML = `<strong>Content of ${key}:</strong> ${value}`;
                        }
                        outputElement.appendChild(contentParagraph);
                        console.log(`Displayed content of key '${key}' in mainAnchor.`);
                    });

                    // Append delete and display buttons to the list item
                    listItem.appendChild(deleteButton);
                    listItem.appendChild(displayButton);

                    // Append the list item to the list
                    keysList.appendChild(listItem);
                }

                outputElement.appendChild(keysList);
            }

            // Perform the check and list keys with additional features
            listLocalStorageKeysAndContents();
        });