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

// Helper function to process a single event
function processEvent(event, year) {
    // Get the index of the event's month name from the array of month names,
    const monthIndex = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].indexOf(event.monthName);

    // The getEventDate function from populate-calendar.mjs is used to calculate the exact date in the month of the event
    const dayOfMonth = getEventDate(year, event.monthName, event.dayName, event.occurrence);
    // A date object is created for the event using the year, month index and day of the month
    const eventDate = new Date(year, monthIndex, dayOfMonth);
    // Use the formatDate function to format the start date
    const formattedStartDate = formatDate(eventDate);

    // To set the end date first create a copy of the eventDate object
    const endDate = new Date(eventDate);
    // Set the end date by adding one day to the eventDate date as the iCal format uses all-day events in this way
    endDate.setDate(endDate.getDate() + 1);
    // Use the formatDate function to format the end date
    const formattedEndDate = formatDate(endDate);

    // Return the formatted VEVENT string
    return `BEGIN:VEVENT\nSUMMARY:${event.name}\nDTSTART;VALUE=DATE:${formattedStartDate}\nDTEND;VALUE=DATE:${formattedEndDate}\nDESCRIPTION:${event.descriptionURL}\nEND:VEVENT\n`;
}

// The async keyword is needed to make this function asynchronous, 
// which means we can use the 'await' to pause execution until a Promise resolves.
// This is necessary because the function calls readDaysJson() which is asynchronous.
async function generateEventDates() {
    console.log('generateEventDates function called');
    const daysData = await readDaysJson(); // Read the data directly
    console.log('Days data:', daysData);

    // The events variable will store the iCal event data as a string,
    // and each event will be appended to this string in the loop for each year.
    let events = "";

    for (let year = 2020; year <= 2030; year++) {
        for (const event of daysData) {
            // For each commemorative event in the newly created daysData array we check if it has all the required fields
            if (isValidEvent(event)) {
                events += processEvent(event, year);
            } else {  // If any required field is missing, skip the event and log a message
                console.log('Skipping invalid event:', event);
            }
        }
    }
    // After processing all events for all years, return the complete events string
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
    console.log('Starting iCal generation...');
    try {
        const events = await generateEventDates();
        // Build the complete iCal content by wrapping the events content from above in the VCALENDAR structure
        // using template literals.
        // The try catch block will catch any errors that occur during the asynchronous operations
        // such as file reading/writing or JSON parsing and log them to the console.
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Piscine-Sprint-Two-Project/Days-Calendar/EN
${events} 
END:VCALENDAR
        `;
        //The fs.writeFile method is used to write the icsContent string to a file named days.ics
        await fs.writeFile('./days.ics', icsContent, 'utf-8');
        console.log('iCal file written successfully.');
    } catch (error) {
        console.error('An error occurred during iCal generation:', error);
    }
})();
// The result is a long string containing all the iCal event entries (for the years 2020-2030 inclusive) that look like this:
/**
 *
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Piscine-Sprint-Two-Project/Days-Calendar/EN
BEGIN:VEVENT
SUMMARY:Ada Lovelace Day
DTSTART;VALUE=DATE:20201013
DTEND;VALUE=DATE:20201014
DESCRIPTION:https://codeyourfuture.github.io/The-Piscine/days/ada.txt
END:VEVENT
BEGIN:VEVENT
SUMMARY:International Binturong Day
DTSTART;VALUE=DATE:20200509
DTEND;VALUE=DATE:20200510
DESCRIPTION:https://codeyourfuture.github.io/The-Piscine/days/binturongs.txt
END:VEVENT
BEGIN:VEVENT
SUMMARY:International Vulture Awareness Day
DTSTART;VALUE=DATE:20200905
DTEND;VALUE=DATE:20200906
DESCRIPTION:https://codeyourfuture.github.io/The-Piscine/days/vultures.txt
END:VEVENT....(etc,etc)
 */