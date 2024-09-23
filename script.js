// Function to send data to the specified URL
async function sendData() {
    const url = "https://script.google.com/macros/s/AKfycbz3hBC838sCdCrx4qU_tQDKoWKB2uZMEKglKwDo_DQ0_JsorhwDc1sm_dYbXoG6ZKq3/exec"; // Your Google Apps Script web app URL

    const data = {
        name: "Andres",
        drunknessLevel: 7,
        drinkCount: 12,
        notes: "test note"
    };

    const jsonData = JSON.stringify(data); // Convert data to JSON string

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData // Use the stringified data as the body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Data sent successfully:", result);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

// Event listener for the button click
document.getElementById("sendDataBtn").addEventListener("click", sendData);
