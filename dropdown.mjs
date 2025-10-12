// Create a container for the dropdown
export function createDropdown(rootContainer, datesContainer, calendarBuilder) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.id = "dropdown-container";
    rootContainer.append(dropdownContainer);

    // Define the month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Generate the month dropdown
    const monthSelect = document.createElement("select");
    monthSelect.id = "month-select";
    monthNames.forEach((month, index) => {
        const monthOption = document.createElement("option");
        monthOption.value = index;
        monthOption.textContent = month;
        if (index === new Date().getMonth()) {
            monthOption.selected = true;
        }
        monthSelect.appendChild(monthOption);
    });

    // Generate the year dropdown
    const yearSelect = document.createElement("select");
    yearSelect.id = "year-select";
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const endYear = 2100;

    for (let year = startYear; year <= endYear; year++) {
        const yearOption = document.createElement("option");
        yearOption.value = year;
        yearOption.textContent = year;
        if (year === currentYear) {
            yearOption.selected = true;
        }
        yearSelect.appendChild(yearOption);
    }

    // Append the dropdowns and a button to the dropdown container
    dropdownContainer.appendChild(monthSelect);
    dropdownContainer.appendChild(yearSelect);
    const jumpButton = document.createElement("button");
    jumpButton.id = "jump-button";
    jumpButton.textContent = "Go";
    dropdownContainer.appendChild(jumpButton);

    // Add event listener to the "Go" button
    jumpButton.addEventListener("click", () => {
        const selectedMonth = parseInt(monthSelect.value, 10);
        const selectedYear = parseInt(yearSelect.value, 10);

        // Clear the existing calendar
        datesContainer.innerHTML = "";

        // Build the calendar for the selected month and year
        calendarBuilder(selectedYear, selectedMonth);
    });
}