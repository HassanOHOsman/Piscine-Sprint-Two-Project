import fs from 'fs/promises';
import { getEventDate } from './populate-calendar.mjs';

// There are some console logs in this field to help with debugging and to make sure that the data is being read correctly
// we can delete all these comments and console logs once we are happy it is working correctly

async function readDaysJson() {
    console.log('Reading days.json...');
    try {
        // fs.readFile method reads the entire contents of the days.json asynchronously
        // and the content is returned to the fileContents variable as a string (using the utf-8 encoding).
        // The result of fs.readFile is assigned to the fileContents variable using 'await'.
        // At this point, fileContents holds the entire contents of the days.json file as a string
        const fileContents = await fs.readFile('./days.json', 'utf-8');
        console.log('File contents:', fileContents);
        // Parse/convert the JSON data back to an array of objects as it originally was in the days.json file
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Failed to read days.json:', error);
        return [];
    }
}

// Helper function to validate if each commemorative event in the newly created daysData array has all the required fields
function isValidEvent(event) {
    return event.name && event.monthName && event.dayName && event.occurrence && event.descriptionURL;
}

// Helper function to format dates for DTSTART and DTEND in the YYYYMMDD format - with leading zeros where needed
function formatDate(date) {
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

// Helper function to generate UID (RFC-compliant and consistent)
function generateUID(name, date) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `${slug}-${date}@piscine-project.local`;
}

// Helper to get current timestamp in UTC format: YYYYMMDDTHHMMSSZ (RFC-compliant and consistent)
function getDTStamp() {
  const now = new Date();
  // e.g. 20251016T123456Z
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mi = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

// Process a single event
function processEvent(event, year) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Validate the monthName
    const monthIndex = monthNames.indexOf(event.monthName);
   // If the monthName is invalid, log an error and throw an exception
   if (monthIndex < 0) {
    console.error(`Invalid monthName: ${event.monthName}`);
    throw new Error(`Invalid monthName: ${event.monthName}`);
    }

    // Use the getEventDate function from populate-calendar.mjs to calculate the exact date in the month of the event
    const dayOfMonth = getEventDate(year, event.monthName, event.dayName, event.occurrence);
    // Create a date object for the event using the year, month index and day of the month
    const startDate = new Date(year, monthIndex, dayOfMonth);
    // To set the end date first create a copy of the startDate object
    const endDate = new Date(startDate);
    // Set the end date by adding one day to the startDate date as the iCal format uses all-day events in this way
    endDate.setDate(endDate.getDate() + 1);

    // Use the helper function to format the start and end dates
    const formattedDTStart = formatDate(startDate);
    const formattedDTEnd = formatDate(endDate);
    // Use helper functions to generate UID and DTSTAMP for validation purposes
    const uid = generateUID(event.name, formattedDTStart);
    const dtstamp = getDTStamp();

    // Construct VEVENT using proper CRLF (Carriage Return + Line Feed) line endings
    const veventLines = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `SUMMARY:${event.name}`,
        `DTSTART;VALUE=DATE:${formattedDTStart}`,
        `DTEND;VALUE=DATE:${formattedDTEnd}`,
        'END:VEVENT'
    ];

    // Join the lines with CRLF and return the VEVENT string
    return veventLines.join('\r\n') + '\r\n';
}

// The async keyword is needed to make this function asynchronous, 
// which means we can use the 'await' to pause execution until a Promise resolves.
// This is necessary because the function calls readDaysJson() which is asynchronous.
async function generateEventDates() {
    const daysData = await readDaysJson();
    let events = '';

    for (let year = 2020; year <= 2030; year++) {
        //for each commemorative event in the newly created daysData array we check if it has all the required fields
        for (const event of daysData) {
            if (isValidEvent(event)) {
                events += processEvent(event, year);
            } else { // If any required field is missing, skip the event and log a message
                console.warn('Skipping invalid event:', event);
            }
        }
    }
    // After processing all events, return the complete string of VEVENTs
    return events;
}

// (This was the part I was missing as I was just calling the generateEventDates function directly)

// In order to invoke the generateEventDates() function we have to use an IIFE (Immediately Invoked Function Expression)
// this is an anonymous async function that runs as soon as it is defined.
// The async keyword makes the function asynchronous allowing the use of 'await' inside of it
// meaning the script waits for  generateEventDates to complete before proceeding.
// We use the IIFE to run the asynchronous code at the top level of the script 
// which is not directly possible in node.js without wrapping it in a function.
(async () => {
    try {
        const events = await generateEventDates();

        // Build the iCal lines with proper CRLF line endings and trim any trailing whitespace
        const icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            `PRODID:-//Piscine Sprint Two Project//Days Calendar//EN`,
            'CALSCALE:GREGORIAN',
            events.trim(), // Remove trailing \r\n from the last event
            'END:VCALENDAR'
        ];

        // Build the final iCal content string
        const icsContent = icsLines.join('\r\n') + '\r\n';

        // Write the iCal content to a .ics file using fs.promises.writeFile with UTF-8 encoding
        await fs.writeFile('./days.ics', icsContent, 'utf-8');
        console.log('iCal file written successfully as day.ics');
    } catch (error) {
        console.error('An error occurred during iCal generation:', error);
    }
})();
