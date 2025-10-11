// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getGreeting } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

window.onload = function() {
    document.querySelector("body").innerText = `${getGreeting()} - there are ${daysData.length} known days`;

    //Create the root container to hold the entire page content
    const rootContainer = document.createElement("div");
    rootContainer.id = "root-container";
    document.body.append(rootContainer);

    //Create a container to hold the calendar and its content
    const calendarContainer = document.createElement("div");
    calendarContainer.id = "calendar-container";
    rootContainer.append(calendarContainer)

    //Create container to wrap up weekdays (Mon through Sun)
    const weekdaysContainer = document.createElement("div");
    weekdaysContainer.id = "weekdays-container";
    calendarContainer.append(weekdaysContainer);

    //Create weekdays starting from Mon
    const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    weekdays.forEach((day) => {
        const weekday = document.createElement("div");
        weekday.textContent = day;
        weekdaysContainer.append(weekday);
    })

    //Change the orientation of the weekdays to horizontal
    weekdaysContainer.style.display = "flex"

    //Create container to hold the dates/rectangular girds
    const datesContainer = document.createElement("div");
    datesContainer.id = "dates-container";
    calendarContainer.append(datesContainer);

    //Display grids horizontally
    datesContainer.style.display = "flex";
    datesContainer.style.flexWrap = "wrap";


    //Create individual grids through looping
    for (let i = 1; i <= 30; i++) {
        const date = document.createElement("div");
        date.textContent = i;
        datesContainer.append(date);

        date.style.height = "40px";
        date.style.width = "50px"
    }


}
