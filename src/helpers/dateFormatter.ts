export function formatDate(dateString: string): string {
    const months = [
        "Jan", "Feb", "March", "April", "May", "June", 
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Split the input date string into parts
    const [year, month, day] = dateString.split('-');

    // Convert month to the month's name
    const monthName = months[parseInt(month, 10) - 1];

    // Combine parts into the desired format
    return `${monthName} ${parseInt(day, 10)}, ${year}`;
}
