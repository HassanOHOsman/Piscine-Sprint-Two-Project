// Create a container for the dropdown
export function createDropdown(rootContainer, datesContainer, calendarBuilder) {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = "dropdown-container";
  dropdownContainer.style.marginTop = "16px";
  rootContainer.append(dropdownContainer);

  // Define the month names
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

  // Month Group:
  const monthGroup = document.createElement("span");
  // Create label for the month dropdown
  const monthLabel = document.createElement("label");
  monthLabel.htmlFor = "month-select";
  monthLabel.textContent = "Month:";
  monthLabel.style.marginRight = "8px";
  dropdownContainer.appendChild(monthLabel);

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
  monthGroup.appendChild(monthLabel);
  monthGroup.appendChild(monthSelect);
  monthGroup.style.marginRight = "10px";
  dropdownContainer.appendChild(monthGroup);

  // Create label for the year dropdown
  const yearGroup = document.createElement("span");
  const yearLabel = document.createElement("label");
  yearLabel.htmlFor = "year-select";
  yearLabel.textContent = "Year:";
  yearLabel.style.marginRight = "8px";

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
  yearGroup.appendChild(yearLabel);
  yearGroup.appendChild(yearSelect);
  yearGroup.style.marginRight = "10px";
  dropdownContainer.appendChild(yearGroup);

  // Add a GO button to the dropdown container
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
