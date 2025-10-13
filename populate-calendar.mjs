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

// Map the month name to its corresponding index (0 for January, 1 for February, etc.)
function getMonthIndex(monthName) {
    return monthNames.indexOf(monthName);
}

// Filter the month name from the JSON data for the events using the monthName field
function filterEventsForMonth(events, month) {
    return events.filter(event => event.monthName === month);
}

