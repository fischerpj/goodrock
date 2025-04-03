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

            // Function to list all keys with checkboxes and additional features
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

                    // Create list item for the key
                    const listItem = document.createElement("li");

                    // Create checkbox for selecting the key
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = key;
                    checkbox.style.marginRight = "10px";

                    // Add key name
                    const keyLabel = document.createElement("span");
                    keyLabel.textContent = key;

                    // Append checkbox and label to the list item
                    listItem.appendChild(checkbox);
                    listItem.appendChild(keyLabel);

                    // Append the list item to the list
                    keysList.appendChild(listItem);
                }

                outputElement.appendChild(keysList);

                // Add the merge button
                const mergeButton = document.createElement("button");
                mergeButton.id = "mergeButton";
                mergeButton.textContent = "Merge Selected Keys";
                mergeButton.style.marginTop = "20px";

                // Add event listener to the merge button
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