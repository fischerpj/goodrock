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

            // Function to list all keys with checkboxes, type, length, display button, delete button, and merge functionality
            function listLocalStorageKeysWithCheckboxes() {
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

                    // Create checkbox for selecting the key
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = key;
                    checkbox.style.marginRight = "10px";

                    // Add key name, type, and length
                    const keyLabel = document.createElement("span");
                    keyLabel.textContent = `${key} (Type: ${valueType}, Length: ${valueLength})`;

                    // Create Display Content button
                    const displayButton = document.createElement("button");
                    displayButton.textContent = "Display Content";
                    displayButton.style.marginLeft = "10px";

                    // Add an event listener to the Display Content button
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

                    // Create Delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.style.marginLeft = "10px";

                    // Add an event listener to the Delete button
                    deleteButton.addEventListener("click", () => {
                        localStorage.removeItem(key);
                        console.log(`Key '${key}' deleted from localStorage.`);
                        listLocalStorageKeysWithCheckboxes(); // Refresh the list
                    });

                    // Append checkbox, label, Display Content button, and Delete button to the list item
                    listItem.appendChild(checkbox);
                    listItem.appendChild(keyLabel);
                    listItem.appendChild(displayButton);
                    listItem.appendChild(deleteButton);

                    // Append the list item to the list
                    keysList.appendChild(listItem);
                }

                outputElement.appendChild(keysList);

                // Add the Merge Selected Keys button
                const mergeButton = document.createElement("button");
                mergeButton.id = "mergeButton";
                mergeButton.textContent = "Merge Selected Keys";
                mergeButton.style.marginTop = "20px";

                // Add event listener to the Merge Selected Keys button
                mergeButton.addEventListener("click", mergeSelectedKeys);
                outputElement.appendChild(mergeButton);
            }

            // Function to merge selected keys and update refidArray
            function mergeSelectedKeys() {
                const checkboxes = outputElement.querySelectorAll('input[type="checkbox"]:checked');
                const selectedKeys = Array.from(checkboxes).map(cb => cb.value);

                if (selectedKeys.length === 0) {
                    alert("No keys selected for merging.");
                    return;
                }

                let mergedRefidArray = []; // Array to store merged refidArray

                // Read and process the selected keys
                selectedKeys.forEach(key => {
                    const value = localStorage.getItem(key);
                    if (value) {
                        try {
                            const parsedValue = JSON.parse(value); // Assume JSON format
                            if (Array.isArray(parsedValue)) {
                                parsedValue.forEach(entry => {
                                    if (entry.refid && entry.timestamp) {
                                        mergedRefidArray.push(entry); // Add valid entries
                                    }
                                });
                            }
                        } catch (e) {
                            console.log(`Invalid JSON format for key '${key}'.`);
                        }
                    }
                });

                // Remove duplicates by keeping the oldest entries based on timestamp
                const refidMap = {};
                mergedRefidArray.forEach(entry => {
                    if (
                        !refidMap[entry.refid] || 
                        (refidMap[entry.refid] && refidMap[entry.refid].timestamp > entry.timestamp)
                    ) {
                        refidMap[entry.refid] = entry; // Keep the oldest entry
                    }
                });

                // Convert refidMap back to an array
                mergedRefidArray = Object.values(refidMap);

                // Update the refidArray key in localStorage
                localStorage.setItem("refidArray", JSON.stringify(mergedRefidArray));
                alert(`refidArray updated with ${mergedRefidArray.length} unique entries.`);

                // Display the updated refidArray at the end of mainAnchor
                const previousDisplay = document.querySelector("#mainAnchor .contentDisplay");
                if (previousDisplay) {
                    previousDisplay.remove();
                }

                const contentParagraph = document.createElement("p");
                contentParagraph.className = "contentDisplay";
                contentParagraph.innerHTML = `<strong>Updated refidArray:</strong> ${JSON.stringify(mergedRefidArray, null, 2)}`;
                outputElement.appendChild(contentParagraph);
            }

            // Perform the check and list keys with checkboxes
            listLocalStorageKeysWithCheckboxes();
        });