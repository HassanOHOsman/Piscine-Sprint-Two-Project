
//Create a function to work out the total number of days in a month
//Set the getDaysInMonth function to be exported for the node unit tests
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

