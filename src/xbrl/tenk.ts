/// <reference path="../../typings/xpath/index.d.ts" />
import { DOMParser } from 'xmldom';
import xpath = require('xpath');



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
}



class TenK {

    private _document: Document;
    private _year: number;

    constructor(doc: Document, year: number) {
        this._document = doc;
        this._year = year;
    }

    public GetTotalRevenue() {
        let nodes = this.selectGAAPNodes(USGAAP.TotalRevenue);
        return this.accumulateValues(nodes);
    }
    public GetNetIncome() {
        let nodes = this.selectGAAPNodes(USGAAP.NetIncome);
        return this.accumulateValues(nodes);
    }
    public GetEarningsPerShare() {
        let nodes = this.selectGAAPNodes(USGAAP.EarningsPerShare);
        return this.accumulateValues(nodes);
    }
    public GetDilutedEarningsPerShare() {
        let nodes = this.selectGAAPNodes(USGAAP.DilutedEarningsPerShare);
        return this.accumulateValues(nodes);
    }
    public GetDeclaredDividend() {
        let nodes = this.selectGAAPNodes(USGAAP.DeclaredDividend);
        return this.accumulateValues(nodes);
    }
    public GetOutstandingShares() {
        let nodes = this.selectGAAPNodes(USGAAP.OutstandingShares);
        return this.accumulateValues(nodes);
    }
    public GetPreferredOutstandingShares() {
        let nodes = this.selectGAAPNodes(USGAAP.PreferredOutstandingShares);
        return this.accumulateValues(nodes);
    }
    public GetCurrentAssets() {
        let nodes = this.selectGAAPNodes(USGAAP.CurrentAssets);
        return this.accumulateValues(nodes);
    }
    public GetCurrentLiabilities() {
        let nodes = this.selectGAAPNodes(USGAAP.CurrentLiabilities);
        return this.accumulateValues(nodes);
    }
    public GetLongTermDebt() {
        let nodes = this.selectGAAPNodes(USGAAP.LongTermDebt);
        return this.accumulateValues(nodes);
    }


    private selectGAAPNodes(names: string[]) {
        let nodes: any[];
        for (let n of names) {
            nodes = this.select(n);
            if (nodes.length > 0) {
                break;
            }
        }
        return nodes.filter((node: any) => { return node.prefix === 'us-gaap'; });
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

    private select(element: string) {
        let nodes: any[] = []

        let select = xpath.select(`//*[local-name() = '${element}']`, this._document);
        for (let i = 0; i < select.length; i++) {
            let node = select[i];
            nodes.push(node);
        }
        return nodes
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
