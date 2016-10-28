/// <reference path="../../typings/xpath/index.d.ts" />
import { DOMParser } from 'xmldom';
import xpath = require('xpath');



module Period {
    export function StartDate (year: number) {
        let id = `FD${year}Q4YTD`;
        return `//xbrli:xbrl/xbrli:context[@id="${id}"]/xbrli:period/xbrli:startDate`;
    }
    export const EndDate = '//xbrli:xbrl/xbrli:context[@id=""]/xbrli:period/xbrli:endDate';
}


module USGAAP {
    export const SharePrice = ['CommonStockMarketPricePerShare'];

    export const TotalRevenue = ['Revenues'];
    export const NetIncome = ['NetIncomeLoss', 'NetIncomeLossAvailableToCommonStockholdersBasic'];
    export const EarningsPerShare = ['EarningsPerShareBasic'];
    export const DilutedEarningsPerShare = ['EarningsPerShareDiluted'];
    export const DeclaredDividend = ['CommonStockDividendsPerShareDeclared'];
    export const OutstandingShares = ['CommonStockSharesOutstanding'];
    export const PreferredOutstandingShares = ['PreferredStockSharesOutstanding'];
    export const CurrentAssets = ['AssetsCurrent'];
    export const CurrentLiabilities = ['LiabilitiesCurrent'];
    export const LongTermDebt = ['LongTermDebt'];


    export function Select(names: string[], document: Document) {
        for (let name of names) {
            let nodes = selectUsingNS(name, document);
            if (nodes.length > 0) {
                return nodes;
            };
        }
        for (let name of names) {
            let nodes = selectUsingPrefix(name, document);
            if (nodes.length) {
                return nodes;
            }
        }
    }

    function selectUsingNS(name: string, document: Document): any[] {
        let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
        return select(`//*[local-name()='${name}' and namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`, document);
    }
    function selectUsingPrefix(name: string, document: Document): any[] {
        let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
        return select(`//*[local-name()='${name}' and starts-with(name(), 'us-gaap')]`, document);
    }
    function selectUsingLocalName(name: string, document: Document): any[] {
        let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
        let nodes = select(`//*[local-name()='${name}']`, document);
        return nodes.filter((node: any) => { return node.prefix === 'us-gaap'; });
    }
}


// TODO: seperate all us-gaap nodes and then re-append to a new root node for faster parsing?
class TenK {

    private _document: Document;
    private _year: number;

    constructor(doc: Document, year: number) {
        this._document = doc;
        this._year = year;
    }

    public GetTotalRevenue() {
        let nodes = USGAAP.Select(USGAAP.TotalRevenue, this._document);
        return this.accumulateValues(nodes);
    }
    public GetNetIncome() {
        let nodes = USGAAP.Select(USGAAP.NetIncome, this._document);
        return this.accumulateValues(nodes);
    }
    public GetEarningsPerShare() {
        let nodes = USGAAP.Select(USGAAP.EarningsPerShare, this._document);
        return this.accumulateValues(nodes);
    }
    public GetDilutedEarningsPerShare() {
        let nodes = USGAAP.Select(USGAAP.DilutedEarningsPerShare, this._document);
        return this.accumulateValues(nodes);
    }
    public GetDeclaredDividend() {
        let nodes = USGAAP.Select(USGAAP.DeclaredDividend, this._document);
        return this.accumulateValues(nodes);
    }
    public GetOutstandingShares() {
        let nodes = USGAAP.Select(USGAAP.OutstandingShares, this._document);
        return this.accumulateValues(nodes);
    }
    public GetPreferredOutstandingShares() {
        let nodes = USGAAP.Select(USGAAP.PreferredOutstandingShares, this._document);
        return this.accumulateValues(nodes);
    }
    public GetCurrentAssets() {
        let nodes = USGAAP.Select(USGAAP.CurrentAssets, this._document);
        return this.accumulateValues(nodes);
    }
    public GetCurrentLiabilities() {
        let nodes = USGAAP.Select(USGAAP.CurrentLiabilities, this._document);
        return this.accumulateValues(nodes);
    }
    public GetLongTermDebt() {
        let nodes = USGAAP.Select(USGAAP.LongTermDebt, this._document);
        return this.accumulateValues(nodes);
    }



    private accumulateValues(nodes: any[]) {
        let sum = 0;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            let ref = xpath.select('@contextRef', node)[0];
            let nodeYear = ref != null ? this.getYear(ref.value) : 0;
            let nodeValue = parseFloat(node.firstChild.data);

            if (this._year === nodeYear && !isNaN(nodeValue)) {
                sum += nodeValue;
            }
        }
        return sum;
    }
    private getYear(date: string) {
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

}

export default TenK;
