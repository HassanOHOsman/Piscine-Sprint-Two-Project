//Cache to avoid fetching the calendar events multiple times
let data = null;

const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

// Fetch the JSON data
async function loadDays() {
    const response = await fetch('./days.json');
    data = await response.json();

    console.log(data);
    return data;
}