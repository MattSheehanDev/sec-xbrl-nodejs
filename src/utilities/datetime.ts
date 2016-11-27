import { Pad } from './utility';


// Date and Time extensions

// dddd - Sunday
// ddd  - Sun
// dd   - 04 (day of month)
// d    - 4 (day of month)
// fff  - milliseconds
// ff   - hundredths of second
// f    - tenths of second
// gg   - era
// g    - era
// hh   - 09 (12 hour clock)
// h    - 0 (12 hour clock)
// HH   - 21 (24 hour clock)
// H    - 21 (24 hour clock)
// K    - utc indicator (or offset)
// mm   - minutes
// m    - minutes
// MMMM - February
// MMM  - Feb
// MM   - 02 (month)
// M    - 2 (month)
// ss   - seconds
// s    - seconds
// tt   - PM
// t    - P
// yyyy - 2012
// yy   - 12
// zzz  - +00:00
// zz   - +00
// z    - +0
// Z    - in UTC (should not be specified in combination with z's or K)

interface DateParts {
    d: string;
    dd: string;
    ddd: string;
    dddd: string;
    M: string;
    MM: string;
    MMM: string;
    MMMM: string;
    yy: string;
    yyyy: string;
    g: string;
    gg: string;
    h: string;
    hh: string;
    H: string;
    HH: string;
    m: string;
    mm: string;
    s: string;
    ss: string;
    f: string;
    ff: string;
    fff: string;
    t: string;
    tt: string;
    z: string;
    zz: string;
    zzz: string;
    Z: string;
    K: string;
}


/**
 * @module Ax.DateTime
 */
export module DateTime {
    

    export const shortDateFormat: string = 'M/d/yyyy';
    export const longDateFormat: string = 'dddd, MMMM dd, yyyy';

    export const shortTimeFormat: string = 'hh:mm tt';
    export const longTimeFormat: string = 'hh:mm:ss tt';

    export const shortDayNames: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    export const longDayNames: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    export const shortMonthNames: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    export const longMonthNames: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    export const shortMeridial: Array<string> = ['A', 'P'];
    export const longMeridial: Array<string> = ['AM', 'PM'];

    export const eraNames: Array<string> = ['AD', 'BC'];


    export const dateRegex: RegExp = /[dM]{1,4}|yy(?:yy)?|g{1,2}|Z|'[^']*'/g;
    export const timeRegex: RegExp = /f{1,3}|[hHmstT]{1,2}|'[^']*'/g;
    export const datetimeRegex: RegExp = /[dM]{1,4}|yy(?:yy)?|[fz]{1,3}|[ghHmst]{1,2}|KZ|'[^']*'/g;
    export const utcRegex: RegExp = /Z|'[^']*'/g;

    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];



    export function format(date: Date, dateFormat: string, utc?: boolean): string {
        if (dateFormat === null || dateFormat === undefined) dateFormat = "f";

        switch (dateFormat) {
            case "d":
                return format(date, shortDateFormat);
            case "D":
                return format(date, longDateFormat);
            case "t":
                return format(date, shortTimeFormat);
            case "T":
                return format(date, longTimeFormat);
            case "f":
                if (date.getTime() == 0) return format(date, longDateFormat);
                else return format(date, longDateFormat + " " + shortTimeFormat);
            case "F":
                if (date.getTime() == 0) return format(date, longDateFormat);
                else return format(date, longDateFormat + " " + longTimeFormat);
            case "g":
                if (date.getTime() == 0) return format(date, shortDateFormat);
                else return format(date, shortDateFormat + " " + shortTimeFormat);
            case "G":
                if (date.getTime() == 0) return format(date, shortDateFormat);
                else return format(date, shortDateFormat + " " + longTimeFormat);
            case "m":
            case "M":
                return format(date, "MMMM d");
            case "o":
            case "O":
                return format(date, "yyyy-MM-ddTHH:mm:ss.fff");
            case "s":
                return format(date, "yyyy-MM-ddTHH:mm:ss");
            case "u":
            case "U":
                return format(date, "");
            case "y":
            case "Y":
                return format(date, "MMMM, yyyy");
        }


        if (utc === undefined || utc === null) {
            let matchUTC = dateFormat.match(utcRegex);
            utc = matchUTC !== undefined ? true : false;
        }

        let year = utc ? date.getUTCFullYear() : date.getFullYear();
        let month = utc ? date.getUTCMonth() : date.getMonth();
        let day = utc ? date.getUTCDate() : date.getDate();
        let weekday = utc ? date.getUTCDay() : date.getDay();
        let hour = utc ? date.getUTCHours() : date.getHours();
        let minute = utc ? date.getUTCMinutes() : date.getMinutes();
        let second = utc ? date.getUTCSeconds() : date.getSeconds();
        let milli = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
        let offset = date.getTimezoneOffset();

        let parts: DateParts = {
            d: String(day),
            dd: Pad(day, 2),
            ddd: shortDayNames[weekday],
            dddd: longDayNames[weekday],
            M: String(month + 1),
            MM: Pad(month + 1, 2),
            MMM: shortMonthNames[month],
            MMMM: longMonthNames[month],
            yy: String(year).slice(2),
            yyyy: String(year),
            g: eraNames[year >= 0 ? 0 : 1],
            gg: eraNames[year >= 0 ? 0 : 1],
            h: String(hour > 12 ? hour - 12 : (hour < 1 ? 12 : hour)),
            hh: Pad(hour > 12 ? hour - 12 : (hour < 1 ? 12 : hour), 2),
            H: String(hour),
            HH: Pad(hour, 2),
            m: String(minute),
            mm: Pad(minute, 2),
            s: String(second),
            ss: Pad(second, 2),
            f: String(Math.round(milli / 100)),
            ff: Pad(Math.round(milli / 10), 2),
            fff: Pad(milli, 3),
            t: shortMeridial[hour < 12 ? 0 : 1],
            tt: longMeridial[hour < 12 ? 0 : 1],
            z: (offset > 0 ? '+' : '-') + String(Math.abs(offset) / 60),
            zz: (offset > 0 ? '+' : '-') + Pad(Math.abs(offset / 60), 2),
            zzz: (offset > 0 ? '+' : '-') + Pad(Math.abs(offset / 60), 2) + ':' + Pad(Math.abs(offset) % 60, 2),
            Z: 'Z',
            K: utc ? 'Z' : (offset > 0 ? '+' : '-') + Pad(Math.abs(offset / 60), 2) + ':' + Pad(Math.abs(offset) % 60, 2),
        };

        return dateFormat.replace(datetimeRegex, function (match: string) {
            if (match in parts)
                return (<any>parts)[match];
            else
                return match.slice(1, match.length - 1);
        });
    }


    /**
     * @function Ax.module:DateTime~setDay
     * @param {Date} date
     * @param {number} day
     * @returns {number}
     */
    export function setDay(date: Date, day: number) {
        let monthDays = daysInMonth[date.getMonth()];

        // day went over, increment month
        if (day > monthDays) {
            setMonth(date, date.getMonth() + 1);
            day = 1;
        }
        // day went under, decrement month
        else if (day < 1) {
            let month = setMonth(date, date.getMonth() - 1);
            day = daysInMonth[month];
        }

        // set day
        date.setDate(day);

        return day;
    }
    /**
     * @function Ax.module:DateTime~setMonth
     * @param {Date} date
     * @param {number} month
     * @returns {number}
     */
    export function setMonth(date: Date, month: number) {
        // months went over, increment year
        if (month > 11) {
            setYear(date, date.getFullYear() + 1);
            month = 0;
        }
        // months went under, decrement year
        else if (month < 0) {
            setYear(date, date.getFullYear() - 1);
            month = 11;
        }

        // we need to handle month days here too
        let days = daysInMonth[month];

        let currDays = daysInMonth[date.getMonth()];
        let currDate = date.getDate();

        if (days < currDays && currDate > days) {
            // if there's less days in the month that we are changing to,
            // then we have to set the days to the new month's minimum
            setDay(date, days);
        }

        date.setMonth(month);


        // if (currDays == currDate) {
        //     // we also want to set the date to the last day in the month if they previous date was
        //     // on the last day of the month.
        //     // this is more of a user friendly thing.
        //     setDay(date, days);
        //     // date.setDate(days);
        // }

        return month;
    }
    /**
     * @function Ax.module:DateTime~setYear
     * @param {Date} date
     * @param {number} year
     * @returns {number}
     */
    export function setYear(date: Date, year: number) {
        // year can only go to zero
        if (year < 1) {
            year = 0;
        }

        date.setFullYear(year);

        return year;
    }


    /**
     * @function Ax.module:DateTime~setPeriod
     * @param {Date} date
     * @param {string} p - "AM"|"PM"
     * @returns {string}
     */
    export function setPeriod(date: Date, p: "AM" | "PM") {
        let hours = date.getHours();
        let period = p.toUpperCase();

        if (hours < 12 && period == "PM") {
            hours += 12;
        }
        else if (hours >= 12 && period == "AM") {
            hours -= 12;
        }

        setHours(date, hours);

        return period;
    }
    /**
     * @function Ax.module:DateTime~setHours
     * @param {Date} date
     * @param {number} hours
     * @returns {number}
     */
    export function setHours(date: Date, hours: number) {
        if (hours < 0)
            hours = 23;
        else if (hours > 23)
            hours = 0;

        // set date
        date.setHours(hours);

        return hours;
    }
    /**
     * @function Ax.module:DateTime~setMinutes
     * @param {Date} date
     * @param {number} minutes
     * @returns {number}
     */
    export function setMinutes(date: Date, minutes: number) {
        // minutes went over, increment date an hour
        if (minutes > 59) {
            setHours(date, date.getHours() + 1);
            minutes = 0;
        }
        // minutes went under, decrement an hour
        else if (minutes < 0) {
            setHours(date, date.getHours() - 1);
            minutes = 59;
        }

        // set minutes
        date.setMinutes(minutes);

        return minutes;
    }
    /**
     * @function Ax.module:DateTime~setSeconds
     * @param {Date} date
     * @param {number} seconds
     * @returns {number}
     */
    export function setSeconds(date: Date, seconds: number) {
        // seconds went over, increment minutes
        if (seconds > 59) {
            setMinutes(date, date.getMinutes() + 1);
            seconds = 0;
        }
        // seconds went under, decrement minutes
        else if (seconds < 0) {
            setMinutes(date, date.getMinutes() - 1);
            seconds = 59;
        }

        date.setSeconds(seconds);

        return seconds;
    }

}

export default DateTime;
