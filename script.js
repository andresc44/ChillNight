const apiKey = "AIzaSyCqYE-0RdSqjul0Vbow-GYpWKqQWV8P7Os"; // Replace with your actual API key
const spreadsheetId = "1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA"; // Replace with your spreadsheet ID
const appScriptURL = "https://script.google.com/macros/s/AKfycbz3hBC838sCdCrx4qU_tQDKoWKB2uZMEKglKwDo_DQ0_JsorhwDc1sm_dYbXoG6ZKq3/exec"; // Your Google Apps Script web app URL


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
document.getElementById("submitButton").addEventListener("click", async () => {
    const selectedName = document.getElementById("nameDropdown").value;
    const drunknessLevel = currentDrunknessLevel;
    const drinkCount = currentDrinkCount; // Get the drink count from the display
    const notes = document.getElementById("notes").value;

    if (!selectedName || drunknessLevel === null) {
        console.error("Name or drunkness level is missing");
        return;
    }

    const rowData = {
        selectedName,
        drunknessLevel,
        drinkCount,
        notes,
    }; // Include drink count in the row data
    const jsonData = JSON.stringify(rowData); // Convert data to JSON string
    
    try {
        const response = await fetch(appScriptURL, {
            method: "POST",
            mode: 'no-cors', 
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData // Use the stringified data as the body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
        console.log("Data appended successfully:", rowData);
        // Clear the screen and display the thank you message
        document.body.innerHTML =
            '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 24px; color: white; background-color: black; font-family: "Comic Sans MS";">Thanks! Reload page to do another entry</div>';
    }

        const result = await response.json();
        console.log("Data sent successfully:", result);
    } catch (error) {
        console.error("Error sending data:", error);
    }
});
