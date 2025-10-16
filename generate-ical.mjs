// Workaround to allow node able to access days.json, even while using fetch()
global.fetch = async (path) => {
  if (path.startsWith("./")) {
    const { readFile } = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    const { dirname, resolve } = await import("node:path");
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const fullPath = resolve(__dirname, path);
    const data = await readFile(fullPath, "utf8");
    return {
      async json() {
        return JSON.parse(data);
      }
    };
  } else {
    const originalFetch = (await import("node-fetch")).default;
    return originalFetch(path);
  }
};



// This file generates an iCal file with events from days.json for the years 2020-2030
import { processEventsForCalendar } from "./populate-calendar.mjs";
import daysData from "./days.json" with { type: "json" };
import { writeFile } from "node:fs/promises";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate all events for from 2020 to 2030, inclusive
export async function generateEventsForYears(startYear = 2020, endYear = 2030) {
  let allEvents = [];

  for (let year = startYear; year <= endYear; year++) {
    const events = await processEventsForCalendar(year);
    console.log(year, events);
    allEvents.push(...events.map(e => ({ ...e, year })));
  }

  return allEvents;
}

// Create the iCal file
export async function createICalFile(filename = "days.ics") {
  const events = await generateEventsForYears();

  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`;

  for (const event of events) {
    const monthIndex = monthNames.indexOf(event.monthName) + 1; 
    const day = String(event.date).padStart(2, "0");
    const month = String(monthIndex).padStart(2, "0");
    const year = event.year;

    const dtEndDate = new Date(year, monthIndex - 1, event.date + 1);
    const endDay = String(dtEndDate.getDate()).padStart(2, "0");
    const endMonth = String(dtEndDate.getMonth() + 1).padStart(2, "0");
    const endYear = dtEndDate.getFullYear();

    icalContent += `BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART;VALUE=DATE:${year}${month}${day}
DTEND;VALUE=DATE:${endYear}${endMonth}${endDay}
END:VEVENT
`;
  }

  icalContent += "END:VCALENDAR";

  await writeFile(filename, icalContent);
  console.log(`iCal file "${filename}" created with ${events.length} events.`);
}


createICalFile();
