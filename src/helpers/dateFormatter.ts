export function formatLongDisplayDate(dateString: string): string {
    const months = [
        "Jan", "Feb", "March", "April", "May", "June", 
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
}
