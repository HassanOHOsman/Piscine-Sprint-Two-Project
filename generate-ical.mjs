async function readDaysJson() {
    console.log('Reading days.json...');
    try {
        const fileContents = await fs.readFile('./days.json', 'utf-8');
        console.log('File contents:', fileContents);
        
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Failed to read days.json:', error);
        return [];
    }
}

function generateEventDates() {
    console.log('generateEventDates function called');
    const daysData = readDaysJson(); 
    console.log('Days data:', daysData);

    let events = "";

    for (let year = 2020; year <= 2030; year++) {
        for (const event of daysData) {
           // check if it has all the required fields
            if (event.name && event.monthName && event.dayName && event.occurrence && event.descriptionURL) {
                // use getEventDate() function from populate-calendar.mjs to calculate the exact date in the month of the event
                const dayOfMonth = getEventDate(year, event.monthName, event.dayName, event.occurrence);

                // create an index of the month from the month name
                const monthIndex = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ].indexOf(event.monthName);

                const eventDate = new Date(year, monthIndex, dayOfMonth);

                //  format start date as YYYYMMDD
                const formattedStartDate = `${eventDate.getFullYear()}${String(eventDate.getMonth() + 1).padStart(2, '0')}${String(eventDate.getDate()).padStart(2, '0')}`;

                endDate.setDate(endDate.getDate() + 1);
               //format end date as YYYYMMDD
                const formattedEndDate = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`;

                events += `
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART;VALUE=DATE:${formattedStartDate}
DTEND;VALUE=DATE:${formattedEndDate}
DESCRIPTION:${event.descriptionURL}
END:VEVENT
`;
            } 
        }
    }
    return events;
}