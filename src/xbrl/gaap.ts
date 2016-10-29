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

export default USGAAP;