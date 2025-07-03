
// const serverIP = window.location.hostname
const serverIP = "172.104.225.14"

export let testActive = {isActive : false}
export const data = (
        {
           form_data : {},
           first_calibration : {},
           writing_test : {},
           second_calibration : {},
    });

export const saveRemotely = async () => {
    const [isWellformed, msg] = wellformed()
    if (!isWellformed) {
        console.error(msg)
    }
    // Format timestamp for the filename
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var time = String(today.getHours()).padStart(2, '0') + "-" + String(today.getMinutes()).padStart(2, '0') + "-" + String(today.getSeconds()).padStart(2, '0');
    const name = data.form_data.name || "unknown";
    const filename = `${name}_${dd}-${mm}_${time}.json`;
    

    data.timestamp = new Date().toISOString()
    
    // save to browser just in case the server is not reachable
    saveToBrowser();
    // Send data to server

    console.log("Current IP:", serverIP);
    fetch(`http://${serverIP}:5000/save-test-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(
        )
    .then(data => {
        alert('Successfully saved data, however we advise to download it locally as well if something where to go wrong.');
        saveLocally();
    })
    .catch((error) => {
        console.log('Error data:' + error+" ip " + serverIP + " response: " + error.response + " data: " + JSON.stringify(data) + " filename: " + filename);
        // Fallback to local download if server save fails
        alert("Cannot connect to server, falling back to local download...");
        saveLocally();
    });
}

export const saveLocally = () => {
    const [isWellformed, msg] = wellformed()
    if (!isWellformed) {
        console.error(msg)
    }
    

    const name = data.form_data?.name || "unknown";
    const date = new Date().toISOString().slice(0, 10);
    

    const jsonData = JSON.stringify(data, null, 2);
    const jsonBlob = new Blob([jsonData], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `${name}_${date}_data.json`;
    jsonLink.click();
    URL.revokeObjectURL(jsonUrl);
}

export const downloadFromBrowser = () => {
    try {
        // Get data from localStorage
        const storedData = localStorage.getItem('testSuiteData');
        
        if (!storedData) {
            console.error('No data found in browser storage');
            alert('No saved data found in browser storage');
            return;
        }
        
        // Parse the stored data
        const parsedData = JSON.parse(storedData);
        
        // Create a downloadable JSON file
        const jsonData = JSON.stringify(parsedData, null, 2);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        
        // Create and trigger download link
        const downloadLink = document.createElement('a');
        downloadLink.href = jsonUrl;
        
        // Create filename with participant name and date if available
        const name = parsedData.form_data?.name || "unknown";
        const date = new Date().toISOString().slice(0, 10);
        downloadLink.download = `${name}_${date}_browser_data.json`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(jsonUrl);
        console.log('Successfully downloaded data from browser storage');
    } catch (error) {
        console.error('Error downloading data from browser storage:', error);
        alert('Failed to download data from browser storage');
    }
}

export const saveToBrowser = () => {
    const [isWellformed, msg] = wellformed();
    if (!isWellformed) {
        console.error(msg);
        return false;
    }
    
    try {
        // Add timestamp before saving
        const dataToSave = { ...data };
        dataToSave.timestamp = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('testSuiteData', JSON.stringify(dataToSave));
        
        console.log('Data successfully saved to browser storage');
        return true;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.error('Storage quota exceeded. Cannot save data to browser.');
            alert('Browser storage is full. Please download your data first or clear some space.');
        } else {
            console.error('Error saving to browser storage:', error);
            alert('Failed to save data to browser storage');
        }
        return false;
    }
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}
export const wellformed = () => {
    if (isObjectEmpty(data.first_calibration)) {
        return [false, "first_calibration is empty"];
    }
    if (isObjectEmpty(data.writing_test)) {
        return [false, "writing_test is empty"];
    }
    if (isObjectEmpty(data.second_calibration)) {
        return [false, "second_calibration is empty"];
    }
    if (isObjectEmpty(data.form_data)) {
        return [false, "form_data is empty"];
    }
    return [true, ""];
}