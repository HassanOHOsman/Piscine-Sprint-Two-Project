//Cache to avoid fetching the calendar events multiple times and reduce network requests
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

//Match an event occurrence to the corresponding calendar date for a month and year.
function getEventDate(year, monthName, dayName, occurrence) {
    // Convert the month name to index
    const monthIndex = getMonthIndex(monthName); 

    // Get the total days in the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayName);

    // Set the dates to an empty array
    let dates = []

    for (let day = 1; day <= daysInMonth; day++) {
        // Find the matching day
        const date = new Date(year, monthIndex, day);
        if (date.getDay() === dayIndex) {
            // Push the dates taht match the day name to the dates array
            dates.push(day);
        }

    }

    // Handle the special case of last occurrence
    if (occurrence === "last") {
        return dates[dates.length - 1];
    } else {
        // Get a specific occurrence
        const occurrenceMap = { "first": 0, "second": 1, "third": 2, "fourth": 3 };
        return dates[occurrenceMap[occurrence]]; 
    }
    
}

// Get all the events and return them with their new calculated dates
export async function processEventsForCalendar(year) {
    // Make sure the data is loaded
    if (!data) {
        await loadDays();
    }

    //An array to store the vents with their calculated dates
    const eventsWithDates = data.map(event => {
        const eventDate = getEventDate(year, event.monthName, event.dayName, event.occurrence);
        return {
            // Copy all the the original event properties using spread operator into the new object
            ...event, 
            // Add teh new calculated date value to the new date property also
            date: eventDate
        };
    });

    return eventsWithDates
}
