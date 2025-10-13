// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.


import { createDropdown } from "./dropdown.mjs";
import daysData from "./days.json" with { type: "json" };

window.onload = function() {
    
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

    //Turn the weekdays container into grids of 7 column
    weekdaysContainer.style.display = "grid";
    weekdaysContainer.style.gridTemplateColumns = "repeat(7, 1fr)";

    //Create container to hold the dates/rectangular girds
    const datesContainer = document.createElement("div");
    datesContainer.id = "dates-container";
    calendarContainer.append(datesContainer);

    //Turn the container for dates into grids of 7 column
    datesContainer.style.display = "grid";
    datesContainer.style.gridTemplateColumns = "repeat(7, 1fr)";


    //Create dynamic calendar where the number of days in a month vary
    const today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    //Create a function to render a calendar as years and months change
    function calendarBuilder(year, month) {

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let firstDayInMonth = new Date(year, month, 1).getDay();
        
        //Make Monday start of the weekdays by modifying the indexes for days
        firstDayInMonth = (firstDayInMonth + 6) % 7;

        //align first day of month to the exact weekday it falls into
        for (let i = 0; i < firstDayInMonth; i++) {
            const emptyCell1 = document.createElement("div");
            datesContainer.append(emptyCell1)

            //Outline for each empty cell a visible rectangle
            emptyCell1.style.border = "1px solid black"
        }

        //Loop through each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = document.createElement("div");
            date.textContent = i;
            datesContainer.append(date);

            //Make the outline of each cell a vidible rectangle
            date.style.border = "1px solid black"
        }

        //Outline the empty gills into visible rectangle once a month ends
        const totalRectangles = firstDayInMonth +daysInMonth;
        
        const emptyCells2 = (7 - (totalRectangles % 7)) % 7;

        for (let i = 0; i < emptyCells2; i++) {
            const emptyCell2 = document.createElement("div");
            datesContainer.append(emptyCell2);
            emptyCell2.style.border = "1px solid black"

        }
    }

    //create previous button to take the user to the previous month of the particular year
    const previousBtn = document.createElement("button");
    previousBtn.textContent = "Previous";
    calendarContainer.append(previousBtn);

    //create next button to take the user to the following month of the particular year
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    calendarContainer.append(nextBtn);

    //Create the dropdown functionality
    createDropdown(rootContainer, datesContainer, calendarBuilder);

    //Show current calendar - current year and current month
    calendarBuilder(year,month)

    //Add event listener to take user to the previous month when "Previous" button is clicked
    previousBtn.addEventListener("click", () => {
        datesContainer.innerHTML = "";
        month = month - 1;
        if (month < 0) {
            month = 11;
            year = year - 1
        }
        calendarBuilder(year, month)
    });


    //Add event listener to take user to the following month when "Next" button is clicked
    nextBtn.addEventListener("click", () => {
        datesContainer.innerHTML = "";
        month = month + 1;
        if (month > 11) {
            month = 0;
            year = year + 1;
        }
        calendarBuilder(year, month)
    });

}



