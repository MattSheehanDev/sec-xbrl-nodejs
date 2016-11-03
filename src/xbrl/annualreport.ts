import {TenKValues, TenK} from '../models/tenk';

import {SumNodes} from './namespaces/xmlns';
import gaap from './namespaces/gaap';
import dei from './namespaces/dei';
import XBRL from './xbrl';

import xpath = require('xpath');


export module AnnualReport {


    export function Create10K(xbrl: XBRL) {
        let node = dei.Select(dei.FiscalYearFocus, xbrl.deiRoot)[0];
        let year = parseInt(node.firstChild.data, 10);

        node = dei.Select(dei.DocumentEndDate, xbrl.deiRoot)[0];
        let endDate = node.firstChild.data;
        
        node = dei.Select(dei.DocumentType, xbrl.deiRoot)[0];
        let docType = node.firstChild.data;

        let tenk: TenKValues = {
            year: year,
            date: endDate,
            type: docType,
            
            currentAssets: BalanceSheet.CurrentAssets(xbrl, year),
            currentLiab: BalanceSheet.CurrentLiabilities(xbrl, year),
            longTermDebt: BalanceSheet.LongTermDebt(xbrl, year),
            outstandingShares: BalanceSheet.OutstandingShares(xbrl, year),
            dilutedOutstandingShares: BalanceSheet.OutstandingSharesDiluted(xbrl, year),
            prefOutstandingShares: BalanceSheet.OutstandingPreferredShares(xbrl, year),

            totalRevenue: totalRevenue(xbrl, year),
            netIncome: netIncome(xbrl, year),
            eps: earningsPerShare(xbrl, year),
            dilutedEps: dilutedEarningsPerShare(xbrl, year),
            declaredDividend: declaredDividend(xbrl, year)
        }
        return new TenK(tenk);
    }


    export module BalanceSheet {
        // Assets = Liabilities + Stockholders Equity

        export function CurrentAssets(xbrl: XBRL, year: number) {
            // try finding the current assets node
            let nodes = gaap.Select(gaap.AssetsCurrent, xbrl.gaapRoot);
            let currentAssets = SumNodes(nodes, year);

            if (currentAssets !== 0) {
                return currentAssets;
            }

            // current assets node might not exist, in which case try adding
            // up current assets ourself
            nodes = gaap.Select([
                gaap.CashAndCashEquivalent,
                gaap.ShortTermInvestments,
                gaap.AccountsReceivableNet,
                gaap.InventoryNet,
                gaap.DeferredTaxNet,
                gaap.OtherAssets
            ], xbrl.gaapRoot);

            // seperate the current year nodes and sum the current year nodes
            // if there is more than one node.
            return SumNodes(nodes, year);
        }
        export function TotalAssets(xbrl: XBRL, year: number) {
            let nodes = gaap.Select(gaap.Assets, xbrl.gaapRoot);
            let assets = SumNodes(nodes, year);

            if (assets !== 0) {
                return assets;
            }

            nodes = gaap.Select([
                gaap.PropertyAndEquipmentNet,
                gaap.Goodwill,
                gaap.IntangibleAssets,
                gaap.OtherAssetsNonCurrent
            ], xbrl.gaapRoot);
            let nonCurrentAssets = SumNodes(nodes, year);
            let currentAssets = CurrentAssets(xbrl, year);
            return nonCurrentAssets + currentAssets;
        }

        export function CurrentLiabilities(xbrl: XBRL, year: number) {
            // try finding the current liabilities node
            let nodes = gaap.Select(gaap.LiabilitiesCurrent, xbrl.gaapRoot);
            let currentLiabilities = SumNodes(nodes, year);

            if (currentLiabilities !== 0) {
                return currentLiabilities;
            }

            nodes = gaap.Select([
                gaap.AccountsPayable,
                gaap.ClaimsPayable,
                gaap.AccruedLiabilities,
                gaap.ShortTermBorrowings,
                gaap.LongTermDebtCurrent
            ], xbrl.gaapRoot);
            return SumNodes(nodes, year);
        }
        export function NonCurrentLiabilities(xbrl: XBRL, year: number) {
            let nodes = gaap.Select([
                gaap.LongTermDebtNonCurrent,
                gaap.DeferredTaxLiabNonCurrent,
                gaap.OtherLiabNonCurrent,
                gaap.Commitments
            ], xbrl.gaapRoot);
            return SumNodes(nodes, year);            
        }
        export function TotalLiabilities(xbrl: XBRL, year: number) {
            return CurrentLiabilities(xbrl, year) + NonCurrentLiabilities(xbrl, year);
        }

        export function LongTermDebt(xbrl: XBRL, year: number) {
            // TODO: use long-term debt non-current?
            //       all other non-current liabilities?
            //       or all long-term debt (current + noncurrent)?
            let nodes = gaap.Select(gaap.LongTermDebt, xbrl.gaapRoot);
            return SumNodes(nodes, year);
        }

        export function StockholdersEquityControlling(xbrl: XBRL, year: number) {
            let nodes = gaap.Select(gaap.StockholdersEquityControlling, xbrl.gaapRoot);
            let equity = SumNodes(nodes, year);

            if (equity !== 0) {
                return equity;
            }

            let value = gaap.Select([
                gaap.PreferredStockValue,
                gaap.CommonStockValue,
                gaap.CapitalSurplus,
                gaap.RetainedEarnings,
                gaap.AccumulatedOtherIncomeLoss
            ], xbrl.gaapRoot);
            let shares = gaap.Select([
                gaap.TreasuryStockValue,
                gaap.CommonStockSharesHeldInEmployeeTrust
            ], xbrl.gaapRoot);
            return SumNodes(value, year) - SumNodes(value, year);
        }
        export function StockholdersEquityMinority(xbrl: XBRL, year: number) {
            let nodes = gaap.Select(gaap.StockholdersEquityMinority, xbrl.gaapRoot);
            return SumNodes(nodes, year);
        }
        export function TotalStockholdersEquity(xbrl: XBRL, year: number) {
            let nodes = gaap.Select(gaap.TotalStockholdersEquity, xbrl.gaapRoot);
            let equity = SumNodes(nodes, year);

            if (equity !== 0) {
                return equity;
            }

            return StockholdersEquityControlling(xbrl, year) + StockholdersEquityMinority(xbrl, year);
            // nodes = gaap.Select([
            //     // TODO: sum stockholders equity controlling
            //     gaap.StockholdersEquityControlling,
            //     gaap.StockholdersEquityMinority
            // ], xbrl.gaapRoot);
            // return SumNodes(nodes, year);
        }

        export function TotalLiabilitiesAndEquity(xbrl: XBRL, year: number) {
            let nodes = gaap.Select(gaap.TotalLiabilitiesAndEquity, xbrl.gaapRoot);
            let total = SumNodes(nodes, year);

            if (total !== 0) {
                return total;
            }

            return TotalLiabilities(xbrl, year) + TotalStockholdersEquity(xbrl, year);
        }

        export function OutstandingShares(xbrl: XBRL, year: number) {
            // let nodes = gaap.Select(gaap.OutstandingShares, xbrl.gaapRoot);
            // return AccumulateValues(nodes, year);
            let nodes = gaap.Select(gaap.OutstandingCommonSharesWeighted, xbrl.gaapRoot);
            let shares = SumNodes(nodes, year);

            if (shares !== 0) {
                return shares;
            }

            nodes = gaap.Select(gaap.OutstandingCommonShares, xbrl.gaapRoot);
            return SumNodes(nodes, year);
        }
        export function OutstandingSharesDiluted(xbrl: XBRL, year: number) {
            let nodes: Element[] = gaap.Select(gaap.OutstandingCommonSharesDilutedWeighted, xbrl.gaapRoot);
            return SumNodes(nodes, year);
        }
        export function OutstandingPreferredShares(xbrl: XBRL, year: number) {
            let nodes = gaap.Select(gaap.PreferredOutstandingShares, xbrl.gaapRoot);
            return SumNodes(nodes, year);
        }

    }
    
    function totalRevenue(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.NetRevenue, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    function netIncome(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.NetIncomeLoss, xbrl.gaapRoot);
        if (!nodes.length) {
            nodes = gaap.Select(gaap.NetIncomeLossToCommonStock, xbrl.gaapRoot);
        }
        return SumNodes(nodes, year);
    }
    function earningsPerShare(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.EarningsPerShare, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function dilutedEarningsPerShare(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.DilutedEarningsPerShare, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function declaredDividend(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.DeclaredDividend, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }



    function ExtractYear(date: string) {
        let match: RegExpMatchArray;
        let year = -1;
        
        // ex. cvs 2015,2014
        if (match = date.match(/^(?:FD|FI)(\d{4})Q4(YTD)?$/i)) {
            year = parseInt(match[1]);
        }
        // ex. cvs 2013
        else if (match = date.match(/^(?:D|I)(\d{4})Q4(YTD)?$/i)) {
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

    // TODO: move this so that we don't have to import xpath
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

}


export default AnnualReport;
