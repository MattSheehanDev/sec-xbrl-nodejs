

export function isUndefinedOrNull(obj: any) {
    return obj === undefined || obj === null;
}
export function isUndefined(obj: any) {
    return obj === undefined;
}
export function isNull(obj: any) {
    return obj === null;
}



// Round a number to the desired number of digits.
export function Round(val: number, len: number) {
    len = Math.pow(10, len);
    return Math.round(val * len) / len;
}


// Format a number with the desired number of digits (len), padding with zer0's where necessary
export function Pad(val: number, len: number): string {
    // we need to handle negatives, but while formatting the sign just gets in the way,
    // so mark as negative and take the absolute value.
    var negative = val < 0;


    var str = Math.abs(val).toString();

    var decimal = str.indexOf(".");

    // if there is no decimal, then it's a whole integer, and all padding should be applied to the front, ex: 2 => 002, not 200
    if (decimal < 0) {
        while (str.length < len) {
            str = "0" + str;
        }
    }
    // otherwise this is a decimal
    else {
        // length is the desired number of digits, since we have a decimal place we should account for that.s
        len += 1;

        // decimals should have at least one digit in the front, ex: .12 => 0.12
        if (decimal == 0) {
            str = "0" + str;
        }

        // all other padding should be in the back, ex: .2 => 0.20
        while (str.length < len) {
            str = str + "0";
        }
    }

    // padding should return a string of the exact length, ex: 0.1264 => 0.12
    // if for some reason the number should be rounded, well...that's something that should be handled sooner.
    str = str.substr(0, len);

    // if negative, add the sign back in
    if (negative) {
        str = "-" + str;
    }
    //"{-}{.}(3)";

    return str;
}



// Make this a function because
// 1. I hate typing regex
// 2. I can never remember the syntax
// 3. I hate typing regex
export function SplitOnWhitespace(s: string) {
    const WhiteSpaceRegEx = /\s/g;
    return s.split(WhiteSpaceRegEx);
}
