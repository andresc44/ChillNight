document.getElementById('nameDropdown').addEventListener('change', function() {
    const selectedName = this.value;
    if (selectedName) {
        fetchDrinkCount(selectedName);
    }
});

async function fetchDrinkCount(name) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'DrinksData'!A1:B6?key=AIzaSyCqYE-0RdSqjul0Vbow-GYpWKqQWV8P7Os`);
    const data = await response.json();
    const values = data.values;

    // Assuming 'drink_count' is in the second column
    const drinkCountIndex = 1; // Update this based on your sheet structure
    const drinkCount = values.find(row => row[0] === name)?.[drinkCountIndex];

    displayDrinkCount(drinkCount);
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

// Slider functionality
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('input', function() {
    sliderValue.textContent = 'Value: ' + this.value;
});

// Button functionality
const decreaseButton = document.getElementById('decreaseButton');
const increaseButton = document.getElementById('increaseButton');

decreaseButton.addEventListener('click', () => updateDrinkCount(-1));
increaseButton.addEventListener('click', () => updateDrinkCount(1));

async function updateDrinkCount(change) {
    const selectedName = document.getElementById('nameDropdown').value;
    if (!selectedName) return;

    // Fetch the current drink count first
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'DrinksData'!A1:B6?key=AIzaSyCqYE-0RdSqjul0Vbow-GYpWKqQWV8P7Os`);
    const data = await response.json();
    const values = data.values;

    // Find the index of the row where the name matches
    const nameRow = values.find(row => row[0] === selectedName);
    if (!nameRow) return;

    const currentCount = parseInt(nameRow[1]) || 0;
    const newCount = currentCount + change;

    // Update the spreadsheet
    const rowIndex = values.findIndex(row => row[0] === selectedName) + 1; // +1 to account for 1-based index
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA/values/'DrinksData'!B${rowIndex}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Use your valid access token
        },
        body: JSON.stringify({
            range: `'DrinksData'!B${rowIndex}`,
            values: [[newCount]]
        })
    });

    if (updateResponse.ok) {
        displayDrinkCount(newCount); // Update the UI with the new count
    } else {
        console.error('Error updating drink count:', updateResponse.statusText);
    }
}
