//Cache to avoid fetching the calendar events multiple times and reduce network requests
let data = null;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Fetch the JSON data
async function loadDays() {
    if (data) {
        return data; 
    }
  try {
    const response = await fetch("./days.json");
    // Throw an error if the response is not ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
  } catch (error) {
    // Inform the user about the error
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
  const dayIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].indexOf(dayName);

  // Set the dates to an empty array
  let dates = [];

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
    const occurrenceMap = { first: 0, second: 1, third: 2, fourth: 3 };
    return dates[occurrenceMap[occurrence]];
  }
}

// Get all the events and return them with their new calculated dates
export async function processEventsForCalendar(year) {
<<<<<<< Updated upstream
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
=======

  const data = await loadDays();

  // Make sure the data is loaded correctly
  if (!data || data.length === 0) {
    console.warn("No events found in days.json");
    // If no data is found, return an empty array to avoid errors
    return [];
  }

  const validDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const validMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const validOccurrences = ["first", "second", "third", "fourth", "last"];

  // Validate each event and filter out the invalid ones
  const validEvents = data.filter((event) => {
    if (!event.name) {
      console.error("Missing name:", event);
      return false;
    }
    if (!event.monthName || !validMonths.includes(event.monthName)) {
        // Example output: Invalid monthName "Jan". Expected one of: January, February, March, April, May, June, July, August, September, October, November, December. Event: (event object)"
      console.error(
        `Invalid monthName "${
          event.monthName
        }". Expected one of: ${validMonths.join(", ")}. Event:`,
        event
      );
      // Return false so that this event is filtered out and the calendar can generate without errors
      return false;
    }

    if (!event.dayName || !validDays.includes(event.dayName)) {
      // Example output: "Invalid dayName "Mon". Expected one of: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. Event: (event object)"
      console.error(
        `Invalid dayName "${event.dayName}". Expected one of: ${validDays.join(
          ", "
        )}. Event:`,
        event
      );
      // Return false so the calendar generates without errors
      return false;
    }
    if (!event.occurrence || !validOccurrences.includes(event.occurrence)) {
      // Example output: "Invalid occurrence "2nd". Expected one of: first, second, third, fourth, last. Event: (event object)"
      console.error(
        `Invalid occurrence "${
          event.occurrence
        }". Expected one of: ${validOccurrences.join(", ")}. Event:`,
        event
      );
      // Return false so the calendar generates without errors
      return false;
    }
    if (!event.descriptionURL) {
      console.error("Missing descriptionURL:", event);
      return false;
    }
    return true;
  });

  // Map the valid events to include their calculated dates
  const eventsWithDates = validEvents.map((event) => {
    const eventDate = getEventDate(
      year,
      event.monthName,
      event.dayName,
      event.occurrence
    );
    return { ...event, date: eventDate };
  });

  return eventsWithDates;
}









>>>>>>> Stashed changes
