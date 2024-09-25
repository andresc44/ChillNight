const apiKey = "AIzaSyCqYE-0RdSqjul0Vbow-GYpWKqQWV8P7Os"; // Replace with your actual API key
const spreadsheetId = "1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA"; // Replace with your spreadsheet ID
const appScriptURL = "https://script.google.com/macros/s/AKfycbz3hBC838sCdCrx4qU_tQDKoWKB2uZMEKglKwDo_DQ0_JsorhwDc1sm_dYbXoG6ZKq3/exec"; // Your Google Apps Script web app URL
const updateChartURL = "https://script.google.com/macros/s/AKfycbxR-W9S_Mo9g-z9PjlvUdkwepqdtfi5LGmeXGZL_Ssk616Nr5Hu2Krfvx8Uzd4D533aCw/exec"

let currentDrunknessLevel = 0; // Initialize a local variable to store the drunkness level
let currentDrinkCount = 0; // Initialize a local variable to store the drink count

document
    .getElementById("nameDropdown")
    .addEventListener("change", async function () {
        const selectedName = this.value;
        if (selectedName) {
            const {drunknessLevel, drinkCount} = await fetchDrunknessAndDrinkCount(selectedName);
            currentDrunknessLevel = drunknessLevel || 0;  
            currentDrinkCount = drinkCount || 0; // Store the initial drink count locally
            displayDrinkCount(currentDrinkCount);
            // Update the background color based on the drunkness level
            updateBackgroundColor();
            resetSlider(); // Reset slider to 0
        }
    });
async function populateNamesDropdown() {
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'DrinksDataAppScript'!A2:A?key=${apiKey}`
    );

    if (!response.ok) {
        console.error("Failed to fetch names:", response.statusText);
        return;
    }

    const data = await response.json();
    const values = data.values;

    const nameDropdown = document.getElementById("nameDropdown");

    // Clear any existing options (except the default)
    nameDropdown.innerHTML = '<option value="">-- Select Name --</option>';

    // Iterate through the names in column A and create an option for each
    values.forEach(row => {
        const name = row[0]; // The name is in column A
        if (name) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            nameDropdown.appendChild(option);
        }
    });
}

// Call the function to populate the dropdown when the page loads
populateNamesDropdown();

// Adding functionality to add a new name
document.getElementById('addNewNameBtn').addEventListener('click', function () {
    // Show the form for entering a new name
  
    const newNameForm = document.getElementById('newNameForm');
  
    newNameForm.style.display = newNameForm.style.display === 'none' ? 'flex' : 'none';
});

// Confirm button to add new name to dropdown
document.getElementById('confirmNewNameBtn').addEventListener('click', function () {
    const newName = document.getElementById('newNameInput').value.trim();

    if (newName) {
        const nameDropdown = document.getElementById('nameDropdown');
        const option = document.createElement('option');
        option.value = newName;
        option.textContent = newName;
        nameDropdown.appendChild(option);
        
        // Optional: Auto-select the new name
        nameDropdown.value = newName;

        // Hide the form and clear the input field
        document.getElementById('newNameForm').style.display = 'none';
        document.getElementById('newNameInput').value = '';
        displayDrinkCount(currentDrinkCount)
    } else {
        alert('Please enter a name');
    }
});

async function fetchDrunknessAndDrinkCount(name) {
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'DrinksDataAppScript'!A:C?key=${apiKey}`
    );

    if (!response.ok) {
        console.error("Failed to fetch data:", response.statusText);
        return;
    }

    const data = await response.json();
    const values = data.values;

    const drunknessLevelIndex = 1;  // Assuming the drunkness level is in column 2
    const drinkCountIndex = 2;  // Assuming the drink count is in column 3

    const row = values.find((row) => row[0] === name);
    const drunknessLevel = row?.[drunknessLevelIndex];  // Get the drunkness level
    const drinkCount = row?.[drinkCountIndex];  // Get the drink count
    
    // Return both drinkCount and drunknessLevel as an object
    return {
        drunknessLevel,
        drinkCount
    };
}


function displayDrinkCount(currentDrinkCount) {
    const drinkCountDisplay = document.getElementById("drinkCountDisplay");
    const drinkCountValue = document.getElementById("drinkCountValue");

    if (currentDrinkCount !== undefined) {
        if (currentDrinkCount == 1) {
            drinkCountValue.textContent = currentDrinkCount + '\n Drink';
        } else {
          drinkCountValue.textContent = currentDrinkCount + '\nDrinks';
        }
        
        drinkCountDisplay.classList.remove("hidden");
    } else {
        drinkCountValue.textContent = "Not found";
        drinkCountDisplay.classList.remove("hidden");
    }
}
function updateBackgroundColor() {
    const body = document.body;

    // Define your color mapping based on drunkness level
    let backgroundColor;
    if (currentDrunknessLevel == 0) {
        backgroundColor = '#E5F0EE';  // Low drunkness
    } else if (currentDrunknessLevel <= 0.5) {
        backgroundColor = '#AAFE94'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 1) {
        backgroundColor = '#CFFE94'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 1.5) {
        backgroundColor = '#D6FE94'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 2) {
        backgroundColor = '#DAFB93'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 2.5) {
        backgroundColor = '#E3FE94'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 3) {
        backgroundColor = '#EAFB93'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 3.5) {
        backgroundColor = '#F3FE94'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 4) {
        backgroundColor = '#FBFB93'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 4.5) {
        backgroundColor = '#FBF093'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 5) {
        backgroundColor = '#FBE593'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 5.5) {
        backgroundColor = '#FAD684'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 6) {
        backgroundColor = '#FAC875'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 6.5) {
        backgroundColor = '#FAA95D'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 7) {
        backgroundColor = '#F78C57'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 7.5) {
        backgroundColor = '#F76C43'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 8) {
        backgroundColor = '#FA5B3B'; // Moderate drunkness
    } else if (currentDrunknessLevel <= 8.5) {
        backgroundColor = '#DE4E34'; // Moderate drunkness
    }else if (currentDrunknessLevel <= 9) {
        backgroundColor = '#BD2F2F'; // High drunkness
    } else if (currentDrunknessLevel <= 9.5) {
        backgroundColor = '#7C0C0C'; // Moderate drunkness
    } else {
        backgroundColor = 'black'; // Very high drunkness
    }

    // Update the background color
    body.style.backgroundColor = backgroundColor;
}

async function populateLatestFeed() {
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'RawDataAppScript'!A1:E?key=${apiKey}`
    );

    if (!response.ok) {
        console.error("Failed to fetch latest feed data:", response.statusText);
        return;
    }

    const data = await response.json();
    const values = data.values;

    // Predefined content element (make sure you have an element with this ID in your HTML)
    const latestFeedContent = document.getElementById("latestFeedContent");
    latestFeedContent.innerHTML = "-- CHAT --"; // Clear any existing content

    // Iterate through the values in the column, starting from the second row
    if (values && values.length > 1) { // Check if there are at least two rows of data
        for (let i = 1; i < values.length; i++) { // Start from the second row (index 1)
            const feedPerson = values[i][1]; // Assuming person is in column B (index 1)
            const feedItem = values[i][4]; // Assuming feed item is in column E (index 4)
            const dateTime = values[i][0]; // Assuming date time is in column A (index 0)
    
            if (feedItem) {
                // Convert dateTime string to Date object
                const time = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
                const p = document.createElement("p");
                p.textContent = `${time} - ${feedPerson}: ${feedItem}`; // Create a paragraph with time, person, and item
                latestFeedContent.appendChild(p); // Append to the predefined content
            }
        }
    } else {
        // Handle case when there are no values or only the header row
        latestFeedContent.innerHTML = "<p>No updates available.</p>";
    }
}

populateLatestFeed();

function resetSlider() {
    const slider = document.getElementById("slider");
    slider.value = currentDrunknessLevel; // Set slider to the drunkness level
    const sliderValue = document.getElementById("sliderValue");
    sliderValue.textContent = "Drunkness Level: " + currentDrunknessLevel; // Update display
}

document.getElementById("decreaseButton").addEventListener("click", () => {
    if (currentDrinkCount > 0) {
        currentDrinkCount--; // Decrease the local drink count if greater than 0
        displayDrinkCount(currentDrinkCount); // Update the display
    }
});

document.getElementById("increaseButton").addEventListener("click", () => {
    currentDrinkCount++; // Increase the local drink count
    displayDrinkCount(currentDrinkCount); // Update the display
});

// Slider functionality
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

slider.addEventListener("input", function () {
    const drunknessLevel = this.value;
    currentDrunknessLevel = drunknessLevel; // Update the current drunkness level
    sliderValue.textContent = "Drunkness Level: " + currentDrunknessLevel;
    // Update the background color based on the drunkness level
    updateBackgroundColor();
});

// Submit button functionality
document.getElementById("sendDataBtn").addEventListener("click", async () => {
    
    const selectedName = document.getElementById("nameDropdown").value;
    const drunknessLevel = currentDrunknessLevel;
    const drinkCount = currentDrinkCount; // Get the drink count from the display
    const notes = document.getElementById("notes").value;
    if (!selectedName || drunknessLevel === null || drinkCount === null) {
        console.error("Name or drunkness level is missing");
        return;
    }
    document.body.innerHTML =
        '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 40px; color: white; background-color: black; font-family: \'Comic Neue\'; font-weight: 700;">Thanks! \nReload page to do another entry</div>';
    document.body.style.backgroundColor = "black"; // Set body background to black

    const rowData = {
        name: selectedName,
        drunknessLevel: drunknessLevel,
        drinkCount: drinkCount,
        notes: notes,
    }; // Include drink count in the row data
    const jsonData = JSON.stringify(rowData); // Convert data to JSON string
    console.log(jsonData); // Use for debugging, or send it to your API here.
    
    try {
        const response = await fetch(appScriptURL, {
            method: "POST",
            mode: 'no-cors', 
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData // Use the stringified data as the body
        });

        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // } else {
        console.log("Data appended successfully:", rowData);
        
        fetch(updateChartURL)
        .then(getResponse => {
            if (!getResponse.ok) {
                throw new Error('Network response was not ok');
            }
            return getResponse.json(); // Assuming the response is in JSON format
        })
        .then(data => {
            console.log('GET request successful:', data);
            // Handle the response data if needed
        })
        .catch(error => {
            console.error('There was a problem with the GET request:', error);
        });
        // Clear the screen and display the thank you message
        
    // }

        // const result = await response.json();
        // console.log("Data sent successfully:", result);
    } catch (error) {
        console.error("No response because sending on mode no-cors. Normal Behaviour: ", error);
    }
});
