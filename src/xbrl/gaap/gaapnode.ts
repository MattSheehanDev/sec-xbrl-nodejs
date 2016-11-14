import xpath = require('xpath');


export class GaapNode {

    public readonly value: number;

    public readonly contextRef: string;             // FD{YYYY}Q{N}{YTD}
    public readonly decimals: number;
    public readonly id: string;
    public readonly unitRef: string;                // usd, shares, ...

    public readonly year: number;
    public readonly quarter: number;

    public readonly member: boolean;


    constructor(node: Element) {
        this.value = parseNumericItemValue(node);

        this.contextRef = parseNonNumAttrType(xpath.select('@contextRef', node)[0]);
        this.decimals = parseNumericAttrType(xpath.select('@decimals', node)[0]);
        this.id = parseNonNumAttrType(xpath.select('@id', node)[0]);
        this.unitRef = parseNonNumAttrType(xpath.select('@unitRef', node)[0]);


        this.year = null;
        this.quarter = null;

        if (this.contextRef) {
            let match: RegExpMatchArray;

            // check if this is a root context or one of the 'axis' ones
            let parts = this.contextRef.split('_');
            let context = parts[0];
            let axis = parts[1];

            this.member = parts[1] ? true : false;


            // ex. cvs 2015,2014
            if (match = context.match(/^(?:FD|FI)(\d{4})Q(\d{1})(YTD)?$/i)) {
                this.year = parseInt(match[1]);
                this.quarter = parseInt(match[2]);
            }
            // ex. cvs 2013
            else if (match = context.match(/^(?:D|I)(\d{4})Q(\d{1})(YTD)?$/i)) {
                this.year = parseInt(match[1]);
                this.quarter = parseInt(match[2]);
            }
            else if (match = context.match(/^d(\d{4})$/i)) {
                this.year = parseInt(match[1]);
                // quarter??
            }
            else if (match = context.match(/^d(\d{4})q(\d{1})(ytd)?$/i)) {
                this.year = parseInt(match[1]);
                this.quarter = parseInt(match[2]);
            }
        }
    }
}



function parseNonNumItemValue(item: any) {
    if (item) {
        let value = item.firstChild.data;
        return value;
    }
    return null;
}
function parseNumericItemValue(item: any) {
    if (item) {
        let value = parseFloat(item.firstChild.data);
        return !isNaN(value) ? value : null;
    }
    return null;
}


function parseNonNumAttrType(attr: any) {
    if (attr) {
        let value = attr.value;
        return value;
    }
    return null;
}
function parseNumericAttrType(attr: any) {
    if (attr) {
        let value = parseFloat(attr.value);
        return !isNaN(value) ? value : null;
    }
    return null;
}
