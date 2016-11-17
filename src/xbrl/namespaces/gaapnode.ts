
// Statement of Financial Position & Parenthetical
const BalanceSheetRoot = 'StatementOfFinancialPositionAbstract';
// Income Statement & Other Comprehensive Income
const IncomeStatementRoot = 'IncomeStatementAbstract';
// Statement of Stockholders Equity
const StockholdersEquityRoot = 'StatementOfStockholdersEquityAbstract';
// Statement of Cash Flows
const CashFlowRoot = 'StatementOfCashFlowsAbstract';
// Statement of Direct Cash Flows
const DirectCashFlowRoot = 'OperatingCashFlowsDirectMethodAbstract';
// Statement of Partners Capital
const PartnersCapitalRoot = 'StatementOfPartnersCapitalAbstract';



export default class GaapNode {

    public readonly value: number;

    public readonly contextRef: string;             // FD{YYYY}Q{N}{YTD}
    public readonly decimals: number;
    public readonly id: string;
    public readonly unitRef: string;                // usd, shares, ...

    public readonly year: number;
    public readonly quarter: number;

    public readonly member: boolean;


    constructor(node: Element) {
        this.value = parseNumericElementValue(node);

        this.contextRef = node.getAttributeNS(null, 'contextRef');
        this.decimals = parseNumericValue(node.getAttributeNS(null, 'decimals'));
        this.id = node.getAttributeNS(null, 'id');
        this.unitRef = node.getAttributeNS(null, 'unitRef');


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



function parseNonNumElementValue(item: Element) {
    if (item) {
        // let value = item.firstChild.data;
        let value = item.firstChild.nodeValue;
        return value;
    }
    return null;
}
function parseNumericElementValue(item: Element) {
    if (item) {
        // let value = parseFloat(item.firstChild.data);
        let value = parseFloat(item.firstChild.nodeValue);
        return !isNaN(value) ? value : null;
    }
    return null;
}


function parseNonNumAttrType(attr: Attr) {
    if (attr) {
        let value = attr.value;
        return value;
    }
    return null;
}
function parseNumericAttrType(attr: Attr) {
    if (attr) {
        let value = parseFloat(attr.value);
        return !isNaN(value) ? value : null;
    }
    return null;
}


function parseNumericValue(value: string) {
    if (value) {
        let num = parseFloat(value);
        return !isNaN(num) ? num : null;
    }
    return null;
}