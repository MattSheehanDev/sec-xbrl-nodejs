// /// <reference path="../../../typings/xpath/index.d.ts" />
// import xpath = require('xpath');
import { SelectNS } from './xmlns';

// number of outstanding shares at time of reporting
// (which probably occurs AFTER the time frame that the report covers)
'EntityCommonStockSharesOutstanding';
// CIK number
'EntityCentralIndexKey';
// FY or Q{\d}
// i'm guessing for the quarter
'DocumentFiscalPeriodFocus';
// year of the reports focus
'DocumentFiscalYearFocus';
'DocumentPeriodEndDate'
// 10-K, 10-Q
'DocumentType';
// income tax
'EffectiveIncomeTaxRateContinuingOperations';


module USGAAP {
    export const SharePrice = ['CommonStockMarketPricePerShare'];

    export const TotalRevenue = ['Revenues'];
    export const NetIncome = ['NetIncomeLoss', 'NetIncomeLossAvailableToCommonStockholdersBasic'];
    export const EarningsPerShare = ['EarningsPerShareBasic'];
    export const DilutedEarningsPerShare = ['EarningsPerShareDiluted'];
    export const DeclaredDividend = ['CommonStockDividendsPerShareDeclared'];

    export const OutstandingShares = [
        'WeightedAverageNumberOfSharesOutstandingBasic',
        'CommonStockSharesOutstanding'
    ];
    export const DilutedOutstandingShares = [
        'WeightedAverageNumberOfDilutedSharesOutstanding'
    ];
    export const PreferredOutstandingShares = ['PreferredStockSharesOutstanding'];

    // Assets
    export const CurrentAssets = ['AssetsCurrent'];
    export const CurrentAssetsEx = [
        'CashAndCashEquivalentsAtCarryingValue',
        'ShortTermInvestments',
        'AccountsReceivableNetCurrent',
        'InventoryNet',
        'DeferredTaxAssetsNetCurrent',
        'OtherAssetsCurrent'
    ];
    export const Assets = ['Assets'];
    export const AssetsEx = [
        // +CurrentAssets
        'PropertyPlantAndEquipmentNet',
        'Goodwill',
        'IntangibleAssetsNetExcludingGoodwill',
        'OtherAssetsNoncurrent'
    ];
    // Liabilities
    export const CurrentLiabilities = ['LiabilitiesCurrent'];
    export const CurrentLiabilitiesEx = [
        ''
    ];
    export const LongTermDebt = ['LongTermDebt'];


    export function All(document: Document) {
        // let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
        return SelectNS(`//*[namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`, document);
    }

    // TODO: names: string | string[]
    export function Select(names: string[], document: Document|Element) {
        for (let name of names) {
            let usingNS = `//*[local-name()='${name}' and namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`;
            let nodes = SelectNS(usingNS, document);
            if (nodes.length > 0) {
                return nodes;
            };
        }
        for (let name of names) {
            let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), 'us-gaap')]`;
            let nodes = SelectNS(usingPrefix, document);
            if (nodes.length) {
                return nodes;
            }
        }
        return null;
    }

    // function selectUsingNS(name: string, document: Document|Element): any[] {
    //     // let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
    //     return SelectNS(`//*[local-name()='${name}' and namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`, document);
    // }
    // function selectUsingPrefix(name: string, document: Document|Element): any[] {
    //     // let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
    //     return SelectNS(`//*[local-name()='${name}' and starts-with(name(), 'us-gaap')]`, document);
    // }
    // function selectUsingLocalName(name: string, document: Document|Element): any[] {
    //     // let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
    //     let nodes = SelectNS(`//*[local-name()='${name}']`, document);
    //     return nodes.filter((node: any) => { return node.prefix === 'us-gaap'; });
    // }
}

export default USGAAP;