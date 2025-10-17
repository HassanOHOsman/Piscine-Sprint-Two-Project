import fs from 'fs/promises';
import { getEventDate } from './populate-calendar.mjs';

// function to read and parse the days.json file asynchronously
async function readDaysJson() {
    try {
        const fileContents = await fs.readFile('./days.json', 'utf-8');
        // Parse/convert the JSON data back to an array of objects
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Failed to read days.json:', error);
        return [];
    }
}

// Helper function to validate the event object's required fields
function isValidEvent(event) {
    return event.name && event.monthName && event.dayName && event.occurrence && event.descriptionURL;
}

// Helper function to format in YYYYMMDD format - with leading zeros where needed
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

    const dayOfMonth = getEventDate(year, event.monthName, event.dayName, event.occurrence);
    const startDate = new Date(year, monthIndex, dayOfMonth);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const formattedDTStart = formatDate(startDate);
    const formattedDTEnd = formatDate(endDate);
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

// The async keyword is needed to make this function asynchronous as it calls readDaysJson()
async function generateEventDates() {
    const daysData = await readDaysJson();
    let events = '';

    for (let year = 2020; year <= 2030; year++) {
        // Check if each commemorative event has all the required fields
        for (const event of daysData) {
            if (isValidEvent(event)) {
                events += processEvent(event, year);
            } else { 
                console.warn('Skipping invalid event:', event);
            }
        }
    }
    return events;
}

// In order to invoke the generateEventDates() function we have to use an IIFE (Immediately Invoked Function Expression)
// this is an anonymous async function that runs as soon as it is defined.
(async () => {
    try {
        const events = await generateEventDates();

        // Build the iCal lines with proper CRLF line endings and trim any trailing whitespace
        const icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            `PRODID:-//Piscine Sprint Two Project//Days Calendar//EN`,
            'CALSCALE:GREGORIAN',
            events.trim(), 
            'END:VCALENDAR'
        ];

        // Build the final string
        const icsContent = icsLines.join('\r\n') + '\r\n';

        // Write the iCal content to a .ics file using fs.promises.writeFile with UTF-8 encoding
        await fs.writeFile('./days.ics', icsContent, 'utf-8');
        console.log('iCal file written successfully as day.ics');
    } catch (error) {
        console.error('An error occurred during iCal generation:', error);
    }
})();
