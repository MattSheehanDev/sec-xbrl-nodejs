/// <reference path="../../typings/xpath/index.d.ts" />
import { DOMParser } from 'xmldom';
import xpath = require('xpath');

import gaap from '../xbrl/gaap';
import context from '../xbrl/contextinstance';



function ExtractYear(date: string) {
    let match: RegExpMatchArray;
    let year = -1;
    
    if (match = date.match(/^(?:FD|FI)(\d{4})Q4(YTD)?$/i)) {
        year = parseInt(match[1]);
    }
    else if (match = date.match(/^d(\d{4})$/i)) {
        year = parseInt(match[1]);
    }
    else if (match = date.match(/^d(\d{4})q(\d{1})(ytd)?$/i)) {
        year = parseInt(match[1]);
    }
    return year;
}
function AccumulateValues(nodes: any[], year: number) {
    let sum = 0;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        let ref = xpath.select('@contextRef', node)[0];
        let nodeYear = ref != null ? ExtractYear(ref.value) : 0;
        let nodeValue = parseFloat(node.firstChild.data);

        if (year === nodeYear && !isNaN(nodeValue)) {
            sum += nodeValue;
        }
    }
    return sum;
}


// TODO: seperate all us-gaap nodes and then re-append to a new root node for faster parsing?
class TenK {

    private _document: Document;
    private _year: number;

    constructor(doc: Document) {
        this._document = doc;
    }

    public GetFinancialYear() {
        let years = context.GetYears(this._document);
        this._year = years[0];
    }

    public GetTotalRevenue() {
        let nodes = gaap.Select(gaap.TotalRevenue, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetNetIncome() {
        let nodes = gaap.Select(gaap.NetIncome, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetEarningsPerShare() {
        let nodes = gaap.Select(gaap.EarningsPerShare, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetDilutedEarningsPerShare() {
        let nodes = gaap.Select(gaap.DilutedEarningsPerShare, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetDeclaredDividend() {
        let nodes = gaap.Select(gaap.DeclaredDividend, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetOutstandingShares() {
        let nodes = gaap.Select(gaap.OutstandingShares, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetPreferredOutstandingShares() {
        let nodes = gaap.Select(gaap.PreferredOutstandingShares, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetCurrentAssets() {
        let nodes = gaap.Select(gaap.CurrentAssets, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetCurrentLiabilities() {
        let nodes = gaap.Select(gaap.CurrentLiabilities, this._document);
        return AccumulateValues(nodes, this._year);
    }
    public GetLongTermDebt() {
        let nodes = gaap.Select(gaap.LongTermDebt, this._document);
        return AccumulateValues(nodes, this._year);
    }

}

export default TenK;
