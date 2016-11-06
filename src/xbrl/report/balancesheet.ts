import { Taxonomy as taxon, Select } from '../namespaces/gaap';
import { GaapNode } from '../node';
import XBRLDocument from '../xbrl';


export function SumNodes(nodes: GaapNode[], year: number) {
    let sum = 0;
    for (let node of nodes) {
        if (node.value && node.year === year) {
            sum += node.value;
        }
    }
    return sum;
}


export module BalanceSheetXBRL {
    // Assets = Liabilities + Stockholders Equity

    export function CashAndCashEquivalents(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.CashAndCashEquivalent, xbrl.gaapRoot), year);
    }
    export function ShortTermInvestments(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.ShortTermInvestments, xbrl.gaapRoot), year);
    }
    export function AccountsReceivable(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.AccountsReceivableNet, xbrl.gaapRoot), year);
    }
    export function InventoryValue(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.InventoryNet, xbrl.gaapRoot), year);
    }
    export function DeferredTaxCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.DeferredTaxNet, xbrl.gaapRoot), year);
    }
    export function OtherAssetsCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.OtherAssetsCurrent, xbrl.gaapRoot), year);
    }

    export function CurrentAssets(xbrl: XBRLDocument, year: number) {
        // try finding the current assets node
        let nodes = Select(taxon.AssetsCurrent, xbrl.gaapRoot);
        let currentAssets = SumNodes(nodes, year);

        if (currentAssets !== 0) return currentAssets;

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

        // seperate the current year nodes and sum the current year nodes
        // if there is more than one node.
        return SumNodes(nodes, year);
    }


    export function PropertyAndEquipment(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.PropertyAndEquipmentNet, xbrl.gaapRoot), year);
    }
    export function Goodwill(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.Goodwill, xbrl.gaapRoot), year);
    }
    export function IntangibleAssets(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.IntangibleAssets, xbrl.gaapRoot), year);
    }
    export function OtherAssetsNonCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.OtherAssetsNonCurrent, xbrl.gaapRoot), year);
    }

    export function TotalAssets(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.Assets, xbrl.gaapRoot);
        let assets = SumNodes(nodes, year);

        if (assets !== 0) return assets;

        nodes = Select([
            taxon.PropertyAndEquipmentNet,
            taxon.Goodwill,
            taxon.IntangibleAssets,
            taxon.OtherAssetsNonCurrent
        ], xbrl.gaapRoot);
        let nonCurrentAssets = SumNodes(nodes, year);
        let currentAssets = CurrentAssets(xbrl, year);
        return nonCurrentAssets + currentAssets;
    }


    export function AccountsPayable(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.AccountsPayable, xbrl.gaapRoot), year);
    }
    export function ClaimsPayable(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.ClaimsPayable, xbrl.gaapRoot), year);
    }
    export function AccruedLiabilities(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.AccruedLiabilities, xbrl.gaapRoot), year);
    }
    export function ShortTermBorrowings(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.ShortTermBorrowings, xbrl.gaapRoot), year);
    }
    export function LongTermDebtCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.AccountsPayable, xbrl.gaapRoot), year);
    }

    export function CurrentLiabilities(xbrl: XBRLDocument, year: number) {
        // try finding the current liabilities node
        let nodes = Select(taxon.LiabilitiesCurrent, xbrl.gaapRoot);
        let currentLiabilities = SumNodes(nodes, year);

        if (currentLiabilities !== 0) return currentLiabilities;

        nodes = Select([
            taxon.AccountsPayable,
            taxon.ClaimsPayable,
            taxon.AccruedLiabilities,
            taxon.ShortTermBorrowings,
            taxon.LongTermDebtCurrent
        ], xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }


    export function LongTermDebtNonCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }
    export function TaxLiabilityNonCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }
    export function OtherLiabilitiesNonCurrent(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }
    export function Commitments(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }

    export function NonCurrentLiabilities(xbrl: XBRLDocument, year: number) {
        let nodes = Select([
            taxon.LongTermDebtNonCurrent,
            taxon.DeferredTaxLiabNonCurrent,
            taxon.OtherLiabNonCurrent,
            taxon.Commitments
        ], xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

    export function TotalLiabilities(xbrl: XBRLDocument, year: number) {
        return CurrentLiabilities(xbrl, year) + NonCurrentLiabilities(xbrl, year);
    }

    export function LongTermDebt(xbrl: XBRLDocument, year: number) {
        // TODO: use long-term debt non-current?
        //       all other non-current liabilities?
        //       or all long-term debt (current + noncurrent)?
        let nodes = Select(taxon.LongTermDebt, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }


    export function PreferredStockValue(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.PreferredStockValue, xbrl.gaapRoot), year);
    }
    export function CommonStockValue(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.CommonStockValue, xbrl.gaapRoot), year);
    }
    export function CapitalSurplus(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.CapitalSurplus, xbrl.gaapRoot), year);
    }
    export function RetainedEarnings(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.RetainedEarnings, xbrl.gaapRoot), year);
    }
    export function AccumulatedOtherIncome(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.AccumulatedOtherIncomeLoss, xbrl.gaapRoot), year);
    }
    export function TrearuryStockValue(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.TreasuryStockValue, xbrl.gaapRoot), year);
    }
    export function EmployeeTrustShareValue(xbrl: XBRLDocument, year: number) {
        return SumNodes(Select(taxon.CommonStockSharesHeldInEmployeeTrust, xbrl.gaapRoot), year);
    }

    export function StockholdersEquityControlling(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.StockholdersEquityControlling, xbrl.gaapRoot);
        let equity = SumNodes(nodes, year);

        if (equity !== 0) return equity;

        let value = Select([
            taxon.PreferredStockValue,
            taxon.CommonStockValue,
            taxon.CapitalSurplus,
            taxon.RetainedEarnings,
            taxon.AccumulatedOtherIncomeLoss
        ], xbrl.gaapRoot);
        let shares = Select([
            taxon.TreasuryStockValue,
            taxon.CommonStockSharesHeldInEmployeeTrust
        ], xbrl.gaapRoot);
        return SumNodes(value, year) - SumNodes(value, year);
    }
    export function StockholdersEquityMinority(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.StockholdersEquityMinority, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function TotalStockholdersEquity(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.TotalStockholdersEquity, xbrl.gaapRoot);
        let equity = SumNodes(nodes, year);

        if (equity !== 0) return equity;

        return StockholdersEquityControlling(xbrl, year) + StockholdersEquityMinority(xbrl, year);
    }

    export function TotalLiabilitiesAndEquity(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.TotalLiabilitiesAndEquity, xbrl.gaapRoot);
        let total = SumNodes(nodes, year);

        if (total !== 0) return total;

        return TotalLiabilities(xbrl, year) + TotalStockholdersEquity(xbrl, year);
    }



    export function OutstandingShares(xbrl: XBRLDocument, year: number) {
        // TODO: use weighted shares
        //       or shares from the beginning
        //       or end of the year/quarter?
        let nodes = Select(taxon.OutstandingCommonSharesWeighted, xbrl.gaapRoot);
        let shares = SumNodes(nodes, year);

        if (shares !== 0) return shares;

        nodes = Select(taxon.OutstandingCommonShares, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function OutstandingSharesDiluted(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.OutstandingCommonSharesWeightedDiluted, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function OutstandingPreferredShares(xbrl: XBRLDocument, year: number) {
        let nodes = Select(taxon.PreferredOutstandingShares, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

}