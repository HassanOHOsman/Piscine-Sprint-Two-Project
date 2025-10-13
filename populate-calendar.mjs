//Cache to avoid fetching the calendar events multiple times
let data = null;

const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


// Fetch the JSON data
async function loadDays() {
    try {
    const response = await fetch('./days.json');
    if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    data = await response.json();

    console.log(data);
    } catch (error) {
        console.error("Failed to load days.json:", error);
    }
    return data;
}
loadDays();

// Map the month name to its corresponding index (0 for January, 1 for February, etc.)
function getMonthIndex(monthName) {
    return monthNames.indexOf(monthName);
}

// Filter the month name from the JSON data for the events using the monthName field
function filterEventsForMonth(events, month) {
    return events.filter(event => event.monthName === month);
}

//Match an event occurrence to the corresponding calendar date for a month and year.
function getEventDate(year, monthName, dayName, occurrence) {
    // Convert the month name to index
    const monthIndex = getMonthIndex(monthName); 

    // Get the total days in the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate

    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayName);

    // Set the dates to an empty array
    let dates = []

    for (let day = 1; day <= daysInMonth; day++) {
        // FInd the matching day
        const date = new Date(year, monthIndex, day);
        if (date.getDay() === dayIndex) {
            // Push the dates taht match the day name to the dates array
            dates.push(day);
        }

    }


}