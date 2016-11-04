import { TenKValues, TenK } from '../models/tenk';

import { SumNodes } from './namespaces/xmlns';
import { Taxonomy as gaapTax, Query as gaapQuery } from './namespaces/gaap';
import dei from './namespaces/dei';
import XBRL from './xbrl';


export module Report {


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

            totalRevenue: IncomeStatement.NetRevenue(xbrl, year),
            netIncome: IncomeStatement.NetIncomeComprehensiveTotal(xbrl, year),

            eps: IncomeStatement.EarningsPerShare(xbrl, year),
            dilutedEps: IncomeStatement.EarningsPerShareDiluted(xbrl, year),
            declaredDividend: IncomeStatement.DividendDeclared(xbrl, year)
        }
        return new TenK(tenk);
    }

}


export default Report;



export module BalanceSheet {
    // Assets = Liabilities + Stockholders Equity

    export function CurrentAssets(xbrl: XBRL, year: number) {
        // try finding the current assets node
        let nodes = gaapQuery.Select(gaapTax.AssetsCurrent, xbrl.gaapRoot);
        let currentAssets = SumNodes(nodes, year);

        if (currentAssets !== 0) {
            return currentAssets;
        }

        // current assets node might not exist, in which case try adding
        // up current assets ourself
        nodes = gaapQuery.Select([
            gaapTax.CashAndCashEquivalent,
            gaapTax.ShortTermInvestments,
            gaapTax.AccountsReceivableNet,
            gaapTax.InventoryNet,
            gaapTax.DeferredTaxNet,
            gaapTax.OtherAssets
        ], xbrl.gaapRoot);

        // seperate the current year nodes and sum the current year nodes
        // if there is more than one node.
        return SumNodes(nodes, year);
    }
    export function TotalAssets(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.Assets, xbrl.gaapRoot);
        let assets = SumNodes(nodes, year);

        if (assets !== 0) {
            return assets;
        }

        nodes = gaapQuery.Select([
            gaapTax.PropertyAndEquipmentNet,
            gaapTax.Goodwill,
            gaapTax.IntangibleAssets,
            gaapTax.OtherAssetsNonCurrent
        ], xbrl.gaapRoot);
        let nonCurrentAssets = SumNodes(nodes, year);
        let currentAssets = CurrentAssets(xbrl, year);
        return nonCurrentAssets + currentAssets;
    }

    export function CurrentLiabilities(xbrl: XBRL, year: number) {
        // try finding the current liabilities node
        let nodes = gaapQuery.Select(gaapTax.LiabilitiesCurrent, xbrl.gaapRoot);
        let currentLiabilities = SumNodes(nodes, year);

        if (currentLiabilities !== 0) {
            return currentLiabilities;
        }

        nodes = gaapQuery.Select([
            gaapTax.AccountsPayable,
            gaapTax.ClaimsPayable,
            gaapTax.AccruedLiabilities,
            gaapTax.ShortTermBorrowings,
            gaapTax.LongTermDebtCurrent
        ], xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function NonCurrentLiabilities(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select([
            gaapTax.LongTermDebtNonCurrent,
            gaapTax.DeferredTaxLiabNonCurrent,
            gaapTax.OtherLiabNonCurrent,
            gaapTax.Commitments
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
        let nodes = gaapQuery.Select(gaapTax.LongTermDebt, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

    export function StockholdersEquityControlling(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.StockholdersEquityControlling, xbrl.gaapRoot);
        let equity = SumNodes(nodes, year);

        if (equity !== 0) {
            return equity;
        }

        let value = gaapQuery.Select([
            gaapTax.PreferredStockValue,
            gaapTax.CommonStockValue,
            gaapTax.CapitalSurplus,
            gaapTax.RetainedEarnings,
            gaapTax.AccumulatedOtherIncomeLoss
        ], xbrl.gaapRoot);
        let shares = gaapQuery.Select([
            gaapTax.TreasuryStockValue,
            gaapTax.CommonStockSharesHeldInEmployeeTrust
        ], xbrl.gaapRoot);
        return SumNodes(value, year) - SumNodes(value, year);
    }
    export function StockholdersEquityMinority(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.StockholdersEquityMinority, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function TotalStockholdersEquity(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.TotalStockholdersEquity, xbrl.gaapRoot);
        let equity = SumNodes(nodes, year);

        if (equity !== 0) {
            return equity;
        }

        return StockholdersEquityControlling(xbrl, year) + StockholdersEquityMinority(xbrl, year);
    }

    export function TotalLiabilitiesAndEquity(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.TotalLiabilitiesAndEquity, xbrl.gaapRoot);
        let total = SumNodes(nodes, year);

        if (total !== 0) {
            return total;
        }

        return TotalLiabilities(xbrl, year) + TotalStockholdersEquity(xbrl, year);
    }

    export function OutstandingShares(xbrl: XBRL, year: number) {
        // TODO: use weighted shares
        //       or shares from the beginning
        //       or end of the year/quarter?
        let nodes = gaapQuery.Select(gaapTax.OutstandingCommonSharesWeighted, xbrl.gaapRoot);
        let shares = SumNodes(nodes, year);

        if (shares !== 0) {
            return shares;
        }

        nodes = gaapQuery.Select(gaapTax.OutstandingCommonShares, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function OutstandingSharesDiluted(xbrl: XBRL, year: number) {
        let nodes: Element[] = gaapQuery.Select(gaapTax.OutstandingCommonSharesWeightedDiluted, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function OutstandingPreferredShares(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.PreferredOutstandingShares, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

}


export module IncomeStatement {

    export function NetRevenue(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.NetRevenue, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

    export function GrossProfit(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.GrossProfit, xbrl.gaapRoot);
        let grossProfit = SumNodes(nodes, year);

        if (grossProfit !== 0) return grossProfit;

        let revenue = gaapQuery.Select(gaapTax.NetRevenue, xbrl.gaapRoot);
        let cost = gaapQuery.Select(gaapTax.CostOfRevenue, xbrl.gaapRoot);
        return SumNodes(revenue, year) - SumNodes(cost, year);
    }

    export function OperatingProfit(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.OperatingProfit, xbrl.gaapRoot);
        let profit = SumNodes(nodes, year);

        if (profit !== 0) return profit;

        let opex = gaapQuery.Select(gaapTax.OperatingExpenses, xbrl.gaapRoot);
        return GrossProfit(xbrl, year) - SumNodes(opex, year);
    }

    export function OperatingIncomeBeforeTax(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.OperatingIncomeBeforeTax, xbrl.gaapRoot);
        let income = SumNodes(nodes, year);

        if (income !== 0) return income;

        nodes = gaapQuery.Select(gaapTax.InterestExpenseNet, xbrl.gaapRoot);
        let interestExpense = SumNodes(nodes, year);

        nodes = gaapQuery.Select(gaapTax.DebtExtinguishmentGainsLosses, xbrl.gaapRoot);
        let debtExtinguishment = SumNodes(nodes, year);

        return OperatingProfit(xbrl, year) - interestExpense - debtExtinguishment;
    }

    export function OperatingIncomeAfterTax(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.OperatingIncomeAfterTax, xbrl.gaapRoot);
        let income = SumNodes(nodes, year);

        if (income !== 0) return income;

        nodes = gaapQuery.Select(gaapTax.IncomeTaxProvision, xbrl.gaapRoot);
        let incomeTax = SumNodes(nodes, year);

        return OperatingIncomeBeforeTax(xbrl, year) - incomeTax;
    }

    export function NetIncome(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.NetIncome, xbrl.gaapRoot);
        let income = SumNodes(nodes, year);

        if (income !== 0) return income;

        nodes = gaapQuery.Select(gaapTax.IncomeFromDiscontinuedOperations, xbrl.gaapRoot);
        let discontinuedIncome = SumNodes(nodes, year);

        return OperatingIncomeAfterTax(xbrl, year) - discontinuedIncome;
    }

    export function NetIncomeAvailable(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.NetIncomeAvailable, xbrl.gaapRoot);
        let netIncome = SumNodes(nodes, year);

        if (netIncome !== 0) return netIncome;

        nodes = gaapQuery.Select(gaapTax.NetIncomeFromNonControllingInterest, xbrl.gaapRoot);
        let nonControllingNet = SumNodes(nodes, year);

        return NetIncome(xbrl, year) - nonControllingNet;
    }

    export function OtherComprehensiveIncome(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.OtherComprehensiveIncomeAdj, xbrl.gaapRoot);
        let otherIncome = SumNodes(nodes, year);

        if (otherIncome !== 0) return otherIncome;

        nodes = gaapQuery.Select(gaapTax.OtherForeignIncomeAdj, xbrl.gaapRoot);
        let foreignIncome = SumNodes(nodes, year);

        nodes = gaapQuery.Select(gaapTax.OtherDerivativeIncomeAdj, xbrl.gaapRoot);
        let derivativeIncome = SumNodes(nodes, year);

        nodes = gaapQuery.Select(gaapTax.OtherPensionIncomeAdj, xbrl.gaapRoot);
        let pensionIncome = SumNodes(nodes, year);

        return foreignIncome + derivativeIncome - pensionIncome;
    }

    export function NetIncomeComprehensiveControlling(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.NetIncomeComprehensiveControlling, xbrl.gaapRoot);
        let netIncome = SumNodes(nodes, year);

        if (netIncome !== 0) return netIncome;

        return NetIncomeAvailable(xbrl, year) + OtherComprehensiveIncome(xbrl, year);
    }

    export function NetIncomeComprehensiveNonControlling(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.NetIncomeComprehensiveNonControlling, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

    export function NetIncomeComprehensiveTotal(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.NetIncomeComprehensiveTotal, xbrl.gaapRoot);
        let netIncome = SumNodes(nodes, year);

        if (netIncome !== 0) return netIncome;

        return NetIncomeComprehensiveControlling(xbrl, year) + NetIncomeComprehensiveNonControlling(xbrl, year);
    }

    export function EarningsPerShare(xbrl: XBRL, year: number) {
        // TODO: calculate these manually too?
        let nodes = gaapQuery.Select(gaapTax.EarningsPerShare, xbrl.gaapRoot);
        let eps = SumNodes(nodes, year);

        if (eps !== 0) return eps;

        nodes = gaapQuery.Select(gaapTax.OperatingIncomePerShare, xbrl.gaapRoot);
        let operatingIncomePerShare = SumNodes(nodes, year);

        nodes = gaapQuery.Select(gaapTax.DiscontinuedOperatingIncomePerShare, xbrl.gaapRoot);
        let discontinuedIncomePerShare = SumNodes(nodes, year);

        return operatingIncomePerShare + discontinuedIncomePerShare;
    }

    export function EarningsPerShareDiluted(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.EarningsPerShareDiluted, xbrl.gaapRoot);
        let eps = SumNodes(nodes, year);

        if (eps !== 0) return eps;

        nodes = gaapQuery.Select(gaapTax.OperatingIncomePerShareDiluted, xbrl.gaapRoot);
        let operatingIncomePerShare = SumNodes(nodes, year);

        nodes = gaapQuery.Select(gaapTax.DiscontinuedOperatingIncomePerShareDiluted, xbrl.gaapRoot);
        let discontinuedIncomePerShare = SumNodes(nodes, year);

        return operatingIncomePerShare + discontinuedIncomePerShare;
    }

    export function DividendDeclared(xbrl: XBRL, year: number) {
        let nodes = gaapQuery.Select(gaapTax.DividendDeclared, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

}
