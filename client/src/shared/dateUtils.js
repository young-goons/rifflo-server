/**
 * Obtains formatted str of input date of date type
 * @param {String} dateStr - assumed to be the format of 'MM.DD.YYYY'
 */
export const convertDateToStr = (date) => {
    date = new Date(date);
    const day = date.getDay();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    switch (month) {
        case 1: month = 'January'; break;
        case 2: month = 'February'; break;
        case 3: month = 'March'; break;
        case 4: month = 'April'; break;
        case 5: month = 'May'; break;
        case 6: month = 'June'; break;
        case 7: month = 'July'; break;
        case 8: month = 'August'; break;
        case 9: month = 'September'; break;
        case 10: month = 'October'; break;
        case 11: month = 'November'; break;
        case 12: month = 'December'; break;
        default: month = ''
    }
    return month + " " + day + ", " + year;
};