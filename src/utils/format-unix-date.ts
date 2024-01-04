function formatDate(unixDate: number) {
  // Convert the Unix timestamp to milliseconds
  const timestampInMilliseconds = unixDate * 1000;

  // Create a Date object
  const dateObject = new Date(timestampInMilliseconds);

  // Get the individual components of the date (month, day, year)
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = dateObject.getDate().toString().padStart(2, '0');
  const year = dateObject.getFullYear();

  // Create the MM-DD-YYYY format
  const formattedDate = `${month}-${day}-${year}`;

  return formattedDate;
}

export { formatDate };
