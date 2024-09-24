function doGet(e) {
    return ContentService.createTextOutput("GET request received")
        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var headers = {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin (change this for specific domains)
        "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
        "Access-Control-Allow-Headers": "*"
    };
  if (e.parameter && e.parameter.options === "true") {
        return ContentService.createTextOutput("CORS preflight response").setHeaders(headers);
    }
  // Spreadsheet ID and sheet name
  const sheetId = '1kRCJhcXT5vEIGGkxMxfMNhQMRldbA1m4r5IuyxcKNCA'; // Replace with your actual spreadsheet ID
  const rawDataSheet = SpreadsheetApp.openById(sheetId).getSheetByName('RawDataAppScript');
  const drinksDataSheet = SpreadsheetApp.openById(sheetId).getSheetByName('DrinksDataAppScript');

  // Parse data from the POST request
  const data = JSON.parse(e.postData.contents);
  const timestamp = new Date();
  
  // Convert timestamp to EST (Eastern Standard Time)
  const estTimestamp = Utilities.formatDate(timestamp, "America/New_York", "yyyy-MM-dd HH:mm:ss");
  
  const name = data.name || "No Name"; // Default to "No Name" if name is missing
  const drunknessLevel = data.drunknessLevel || "0"; // Default to "0" if drunkness level is missing
  const drinkCount = data.drinkCount || "0"; // Default to "0" if drink count is missing
  const notes = data.notes || ""; // Optional notes

  // 1. Append the data to the RawDataAppScript sheet
  rawDataSheet.appendRow([estTimestamp, name, drunknessLevel, drinkCount, notes]);

  // 2. Search for the name in DrinksDataAppScript (column A) and update drink count (column B) and drunkness level (column C)
  const dataRange = drinksDataSheet.getRange('A:A').getValues(); // Get all names in column A

  // Loop through column A to find a match for the name
  for (let i = 0; i < dataRange.length; i++) {
    if (dataRange[i][0] === name) {
      // If a match is found, update columns B and C with drinkCount and drunknessLevel
      drinksDataSheet.getRange(i + 1, 2).setValue(drunknessLevel); // Column C (drunknessLevel)
      drinksDataSheet.getRange(i + 1, 3).setValue(drinkCount); // Column B (drinkCount)
      break; // Exit the loop once the name is found and updated
    }
  }

  // Return a JSON response to indicate success
  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
        .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
}

function doOptions(e) {
  var output = ContentService.createTextOutput();

  // Set the CORS header
  output.setHeader("Access-Control-Allow-Origin", "*");
  output.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  output.setHeader("Access-Control-Allow-Headers", "Content-Type");

  return output;
