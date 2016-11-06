import { Taxonomy as taxon, Select } from '../namespaces/gaap';
import XBRLDocument from '../xbrl';

import { BalanceSheetModel } from '../../models/financialmodels';
import { GaapNode } from '../node';



export function SumNodesByYear(nodes: GaapNode[]) {
    // <year, value>
    let map = new Map<number, number>();
    for (let node of nodes) {
        if (node.axis) continue;

        // if this year has already been seen before
        if (map.has(node.year)) {
            let value = map.get(node.year);
            map.set(node.year, value + node.value);
        }
        // otherwise we have to create the node year array
        else {
            map.set(node.year, node.value);
        }
    }
    return map;
}


export class ConsolidatedBalanceSheets {

    private balanceSheets: Map<number, BalanceSheetModel>;

    public Get(year: number) {
        if (this.balanceSheets.has(year)) {
            return this.balanceSheets.get(year);
        }
        else {
            let bs: BalanceSheetModel = {
                year: year
            };
            this.balanceSheets.set(year, bs);
            return bs;
        }
    }
    
    public Reports() {
        let reports: BalanceSheetModel[] = [];
        this.balanceSheets.forEach((bs: BalanceSheetModel) => {
            reports.push(bs);
        });
        return reports
    }

    constructor(xbrl: XBRLDocument) {
        this.balanceSheets = new Map<number, BalanceSheetModel>();

        BalanceSheetItems.CashAndCashEquivalents(xbrl).forEach((value: number, year: number) => {
            this.Get(year).cash = value;
        });
        BalanceSheetItems.ShortTermInvestments(xbrl).forEach((value: number, year: number) => {
            this.Get(year).shortTermInvestments = value;
        });
        BalanceSheetItems.AccountsReceivable(xbrl).forEach((value: number, year: number) => {
            this.Get(year).accountsReceivable = value;
        });
        BalanceSheetItems.InventoryValue(xbrl).forEach((value: number, year: number) => {
            this.Get(year).netInventory = value;
        });
        BalanceSheetItems.DeferredTaxCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).netDeferredTax = value;
        });
        BalanceSheetItems.OtherAssetsCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).otherAssetsCurrent = value;
        });
        BalanceSheetItems.CurrentAssets(xbrl).forEach((value: number, year: number) => {
            this.Get(year).totalAssetsCurrent = value;
        });
        BalanceSheetItems.PropertyAndEquipment(xbrl).forEach((value: number, year: number) => {
            this.Get(year).propertyAndEquipment = value;
        });
        BalanceSheetItems.Goodwill(xbrl).forEach((value: number, year: number) => {
            this.Get(year).goodwill = value;
        });
        BalanceSheetItems.IntangibleAssets(xbrl).forEach((value: number, year: number) => {
            this.Get(year).intangibleAssets = value;
        });
        BalanceSheetItems.OtherAssetsNonCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).otherAssetsNonCurrent = value;
        });
        BalanceSheetItems.TotalAssets(xbrl).forEach((value: number, year: number) => {
            this.Get(year).totalAssets = value;
        });

        BalanceSheetItems.AccountsPayable(xbrl).forEach((value: number, year: number) => {
            this.Get(year).accountsPayable = value;
        });
        BalanceSheetItems.ClaimsPayable(xbrl).forEach((value: number, year: number) => {
            this.Get(year).claimsPayable = value;
        });
        BalanceSheetItems.AccruedLiabilities(xbrl).forEach((value: number, year: number) => {
            this.Get(year).accruedLiabilities = value;
        });
        BalanceSheetItems.ShortTermBorrowings(xbrl).forEach((value: number, year: number) => {
            this.Get(year).shortTermDebt = value;
        });
        BalanceSheetItems.LongTermDebtCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).longTermDebtCurrent = value;
        });
        BalanceSheetItems.CurrentLiabilities(xbrl).forEach((value: number, year: number) => {
            this.Get(year).totalLiabilitiesCurrent = value;
        });
        BalanceSheetItems.LongTermDebtNonCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).longTermDebtNonCurrent = value;
        });
        BalanceSheetItems.TaxLiabilityNonCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).taxLiabilityNonCurrent = value;
        });
        BalanceSheetItems.OtherLiabilitiesNonCurrent(xbrl).forEach((value: number, year: number) => {
            this.Get(year).otherLiabilitiesNonCurrent = value;
        });
        BalanceSheetItems.Commitments(xbrl).forEach((value: number, year: number) => {
            this.Get(year).commitments = value;
        });
        BalanceSheetItems.TotalLiabilities(xbrl).forEach((value: number, year: number) => {
            this.Get(year).totalLiabilities = value;
        });

        BalanceSheetItems.PreferredStockValue(xbrl).forEach((value: number, year: number) => {
            this.Get(year).preferredStockValue = value;
        });
        BalanceSheetItems.CommonStockValue(xbrl).forEach((value: number, year: number) => {
            this.Get(year).commonStockValue = value;
        });
        BalanceSheetItems.CapitalSurplus(xbrl).forEach((value: number, year: number) => {
            this.Get(year).capitalSurplus = value;
        });
        BalanceSheetItems.RetainedEarnings(xbrl).forEach((value: number, year: number) => {
            this.Get(year).retainedEarnings = value;
        });
        BalanceSheetItems.AccumulatedOtherIncome(xbrl).forEach((value: number, year: number) => {
            this.Get(year).accumulatedOtherIncome = value;
        });
        BalanceSheetItems.TrearuryStockValue(xbrl).forEach((value: number, year: number) => {
            this.Get(year).treasuryStockValue = value;
        });
        BalanceSheetItems.EmployeeTrustShareValue(xbrl).forEach((value: number, year: number) => {
            this.Get(year).employeeTrustShareValue = value;
        });
        BalanceSheetItems.StockholdersEquityControlling(xbrl).forEach((value: number, year: number) => {
            this.Get(year).equityControlling = value;
        });
        BalanceSheetItems.StockholdersEquityMinority(xbrl).forEach((value: number, year: number) => {
            this.Get(year).equityMinority = value;
        });
        BalanceSheetItems.TotalStockholdersEquity(xbrl).forEach((value: number, year: number) => {
            this.Get(year).totalEquity = value;
        });
        BalanceSheetItems.TotalLiabilitiesAndEquity(xbrl).forEach((value: number, year: number) => {
            this.Get(year).totalLiabilitiesAndEquity = value;
        });
    }

}


export module BalanceSheetItems {

    export function CashAndCashEquivalents(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CashAndCashEquivalent, xbrl.gaapRoot));
    }
    export function ShortTermInvestments(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.ShortTermInvestments, xbrl.gaapRoot));
    }
    export function AccountsReceivable(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.AccountsReceivableNet, xbrl.gaapRoot));
    }
    export function InventoryValue(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.InventoryNet, xbrl.gaapRoot));
    }
    export function DeferredTaxCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.DeferredTaxNet, xbrl.gaapRoot));
    }
    export function OtherAssetsCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.OtherAssetsCurrent, xbrl.gaapRoot));
    }

    export function CurrentAssets(xbrl: XBRLDocument) {
        // try finding the current assets node
        let nodes = Select(taxon.AssetsCurrent, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        // current assets node might not exist, in which case try adding
        // up current assets ourself
        nodes = Select([
            taxon.CashAndCashEquivalent,
            taxon.ShortTermInvestments,
            taxon.AccountsReceivableNet,
            taxon.InventoryNet,
            taxon.DeferredTaxNet,
            taxon.OtherAssetsCurrent
        ], xbrl.gaapRoot);
        return SumNodesByYear(nodes);
    }


    export function PropertyAndEquipment(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PropertyAndEquipmentNet, xbrl.gaapRoot));
    }
    export function Goodwill(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.Goodwill, xbrl.gaapRoot));
    }
    export function IntangibleAssets(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.IntangibleAssets, xbrl.gaapRoot));
    }
    export function OtherAssetsNonCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.OtherAssetsNonCurrent, xbrl.gaapRoot));
    }

    export function TotalAssets(xbrl: XBRLDocument) {
        let nodes = Select(taxon.Assets, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        nodes = Select([
            taxon.PropertyAndEquipmentNet,
            taxon.Goodwill,
            taxon.IntangibleAssets,
            taxon.OtherAssetsNonCurrent
        ], xbrl.gaapRoot);
        let nonCurrentAssets = SumNodesByYear(nodes);
        let currentAssets = CurrentAssets(xbrl);
        
        nonCurrentAssets.forEach((value: number, year: number) => {
            if (currentAssets.has(year))
                currentAssets.set(year, currentAssets.get(year) + value);
            else
                currentAssets.set(year, value);
        });
        return currentAssets;
    }


    export function AccountsPayable(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.AccountsPayable, xbrl.gaapRoot));
    }
    export function ClaimsPayable(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.ClaimsPayable, xbrl.gaapRoot));
    }
    export function AccruedLiabilities(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.AccruedLiabilities, xbrl.gaapRoot));
    }
    export function ShortTermBorrowings(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.ShortTermBorrowings, xbrl.gaapRoot));
    }
    export function LongTermDebtCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.LongTermDebtCurrent, xbrl.gaapRoot));
    }

    export function CurrentLiabilities(xbrl: XBRLDocument) {
        // try finding the current liabilities node
        let nodes = Select(taxon.LiabilitiesCurrent, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        nodes = Select([
            taxon.AccountsPayable,
            taxon.ClaimsPayable,
            taxon.AccruedLiabilities,
            taxon.ShortTermBorrowings,
            taxon.LongTermDebtCurrent
        ], xbrl.gaapRoot);
        return SumNodesByYear(nodes);
    }


    export function LongTermDebtNonCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot));
    }
    export function TaxLiabilityNonCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot));
    }
    export function OtherLiabilitiesNonCurrent(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.OtherLiabNonCurrent, xbrl.gaapRoot));
    }
    export function Commitments(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.Commitments, xbrl.gaapRoot));
    }

    export function NonCurrentLiabilities(xbrl: XBRLDocument) {
        let nodes = Select([
            taxon.LongTermDebtNonCurrent,
            taxon.DeferredTaxLiabNonCurrent,
            taxon.OtherLiabNonCurrent,
            taxon.Commitments
        ], xbrl.gaapRoot);
        return SumNodesByYear(nodes);
    }

    export function TotalLiabilities(xbrl: XBRLDocument) {
        let currentLiab = CurrentLiabilities(xbrl);
        let nonCurrentLiab = NonCurrentLiabilities(xbrl);

        currentLiab.forEach((value: number, year: number) => {
            if (nonCurrentLiab.has(year))
                nonCurrentLiab.set(year, nonCurrentLiab.get(year) + value);
            else
                nonCurrentLiab.set(year, value);
        });
        return nonCurrentLiab;
    }

    export function LongTermDebt(xbrl: XBRLDocument) {
        // TODO: use long-term debt non-current?
        //       all other non-current liabilities?
        //       or all long-term debt (current + noncurrent)?
        return SumNodesByYear(Select(taxon.LongTermDebt, xbrl.gaapRoot));
    }


    export function PreferredStockValue(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredStockValue, xbrl.gaapRoot));
    }
    export function CommonStockValue(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CommonStockValue, xbrl.gaapRoot));
    }
    export function CapitalSurplus(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CapitalSurplus, xbrl.gaapRoot));
    }
    export function RetainedEarnings(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.RetainedEarnings, xbrl.gaapRoot));
    }
    export function AccumulatedOtherIncome(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.AccumulatedOtherIncomeLoss, xbrl.gaapRoot));
    }
    export function TrearuryStockValue(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.TreasuryStockValue, xbrl.gaapRoot));
    }
    export function EmployeeTrustShareValue(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CommonStockSharesHeldInEmployeeTrust, xbrl.gaapRoot));
    }

    export function StockholdersEquityControlling(xbrl: XBRLDocument) {
        let nodes = Select(taxon.StockholdersEquityControlling, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        let debits = SumNodesByYear(Select([
            taxon.PreferredStockValue,
            taxon.CommonStockValue,
            taxon.CapitalSurplus,
            taxon.RetainedEarnings,
            taxon.AccumulatedOtherIncomeLoss
        ], xbrl.gaapRoot));
        let credits = SumNodesByYear(Select([
            taxon.TreasuryStockValue,
            taxon.CommonStockSharesHeldInEmployeeTrust
        ], xbrl.gaapRoot));

        debits.forEach((value: number, year: number) => {
            if (credits.has(year))
                credits.set(year, credits.get(year) + value);
            else
                credits.set(year, value);
        });
        return credits;
    }
    export function StockholdersEquityMinority(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.StockholdersEquityMinority, xbrl.gaapRoot));
    }
    export function TotalStockholdersEquity(xbrl: XBRLDocument) {
        let nodes = Select(taxon.TotalStockholdersEquity, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        let controlling = StockholdersEquityControlling(xbrl);
        let minority = StockholdersEquityMinority(xbrl);

        controlling.forEach((value: number, year: number) => {
            if (minority.has(year))
                minority.set(year, minority.get(year) + value);
            else
                minority.set(year, value);
        });
        return minority;
    }

    export function TotalLiabilitiesAndEquity(xbrl: XBRLDocument) {
        let nodes = Select(taxon.TotalLiabilitiesAndEquity, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        // return TotalLiabilities(xbrl, year) + TotalStockholdersEquity(xbrl, year);
        let liab = TotalLiabilities(xbrl);
        let equity = TotalStockholdersEquity(xbrl);

        liab.forEach((value: number, year: number) => {
            if (equity.has(year))
                equity.set(year, equity.get(year) + value);
            else
                equity.set(year, value);
        });
        return equity;
    }



    export function OutstandingShares(xbrl: XBRLDocument) {
        // TODO: use weighted shares
        //       or shares from the beginning
        //       or end of the year/quarter?
        let nodes = Select(taxon.OutstandingCommonSharesWeighted, xbrl.gaapRoot);

        if (nodes.length) return SumNodesByYear(nodes);

        return SumNodesByYear(Select(taxon.OutstandingCommonShares, xbrl.gaapRoot));
    }
    export function OutstandingSharesDiluted(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.OutstandingCommonSharesWeightedDiluted, xbrl.gaapRoot));
    }
    export function OutstandingPreferredShares(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredOutstandingShares, xbrl.gaapRoot));
    }

}