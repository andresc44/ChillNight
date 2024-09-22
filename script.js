const accessToken =
    "ya29.a0AcM612yEWHYTLpNg2WQe4whQmgOk7sCc4rqNq61D1f-6SV9avmm_5DgvDbZEHej6EKk8Hi2zAc6nUWKofRS9fFxkIkVPXbcttCp-FU1V-CEH-1kuqjy4Cm9j0g7Ec8AAHu5fffvwK3BWqxr7IXY13mJAimLe5tv4KzoaCgYKAbUSARESFQHGX2MiJpdf223eZfo5RSsa9xYSuA0170"; // Your actual access token
document.getElementById('nameDropdown').addEventListener('change', async function() {
    const selectedName = this.value;
    if (selectedName) {
        const drinkCount = await fetchDrinkCount(selectedName);
        displayDrinkCount(drinkCount);
        resetSlider(); // Reset slider to 0
    }
});

async function fetchDrinkCount(name) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'DrinksData'!A1:B6?access_token=${accessToken}`);

    if (!response.ok) {
        console.error('Failed to fetch drink count:', response.statusText);
        return;
    }

    const data = await response.json();
    const values = data.values;

    const drinkCountIndex = 1;
    const drinkCount = values.find(row => row[0] === name)?.[drinkCountIndex];

    return drinkCount;
}

function displayDrinkCount(drinkCount) {
    const drinkCountDisplay = document.getElementById('drinkCountDisplay');
    const drinkCountValue = document.getElementById('drinkCountValue');

    if (drinkCount !== undefined) {
        drinkCountValue.textContent = drinkCount;
        drinkCountDisplay.classList.remove('hidden');
    } else {
        drinkCountValue.textContent = 'Not found';
        drinkCountDisplay.classList.remove('hidden');
    }
}

function resetSlider() {
    const slider = document.getElementById('slider');
    slider.value = 0; // Reset slider to 0
    const sliderValue = document.getElementById('sliderValue');
    sliderValue.textContent = 'Drunkness Level: 0'; // Reset display to 0
}

document.getElementById('decreaseButton').addEventListener('click', async () => {
    const selectedName = document.getElementById('nameDropdown').value;
    if (!selectedName) return;
    await updateDrinkCount(selectedName, -1);
    const newCount = await fetchDrinkCount(selectedName);
    displayDrinkCount(newCount);
});

document.getElementById('increaseButton').addEventListener('click', async () => {
    const selectedName = document.getElementById('nameDropdown').value;
    if (!selectedName) return;
    await updateDrinkCount(selectedName, 1);
    const newCount = await fetchDrinkCount(selectedName);
    displayDrinkCount(newCount);
});

async function updateDrinkCount(name, change) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'DrinksData'!A1:B6?access_token=${accessToken}`);

    if (!response.ok) {
        console.error('Failed to fetch data for update:', response.statusText);
        return;
    }

    const data = await response.json();
    const values = data.values;

    const nameRow = values.find(row => row[0] === name);
    if (!nameRow) return;

    const currentCount = parseInt(nameRow[1]) || 0;
    const newCount = currentCount + change;

    const rowIndex = values.findIndex(row => row[0] === name) + 1; // +1 for 1-based index
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'DrinksData'!B${rowIndex}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            range: `'DrinksData'!B${rowIndex}`,
            values: [[newCount]],
        }),
    });

    if (!updateResponse.ok) {
        console.error('Failed to update drink count:', updateResponse.statusText);
    } else {
        console.log(`Updated drink count for ${name}:`, newCount);
        displayDrinkCount(newCount); // Update the display with the new count
    }
}

// Slider functionality
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('input', function() {
    const drunknessLevel = this.value;
    sliderValue.textContent = 'Drunkness Level: ' + drunknessLevel;
});

// Submit button functionality
document.getElementById('submitButton').addEventListener('click', async () => {
    const selectedName = document.getElementById('nameDropdown').value;
    const drunknessLevel = slider.value;
    const notes = document.getElementById('notes').value;
    const drinkCount = document.getElementById('drinkCountValue').textContent || '0'; // Get the drink count from the display

    if (!selectedName || drunknessLevel === null) {
        console.error('Name or drunkness level is missing');
        return;
    }

    const timestamp = new Date().toISOString();
    const rowData = [timestamp, selectedName, drunknessLevel, drinkCount, notes]; // Include drink count in the row data

    // Add the row data to the RawData sheet
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'RawData'!A:E:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            values: [rowData]
        }),
    });

    if (!response.ok) {
        console.error('Failed to append data:', response.statusText);
    } else {
        console.log('Data appended successfully:', rowData);
        // Clear the screen and display the thank you message
        document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 24px; color: white; background-color: black; font-family: "Comic Sans MS";">Thanks! Reload page to do another entry</div>';
    }
});
