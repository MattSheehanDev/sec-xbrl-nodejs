import { Taxonomy as taxon, Query as query } from '../namespaces/gaap';
import { SumNodes } from '../namespaces/xmlns';
import XBRL from '../xbrl';


export module BalanceSheetXBRL {
    // Assets = Liabilities + Stockholders Equity

    export function CashAndCashEquivalents(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.CashAndCashEquivalent, xbrl.gaapRoot), year);
    }
    export function ShortTermInvestments(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.ShortTermInvestments, xbrl.gaapRoot), year);
    }
    export function AccountsReceivable(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.AccountsReceivableNet, xbrl.gaapRoot), year);
    }
    export function InventoryValue(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.InventoryNet, xbrl.gaapRoot), year);
    }
    export function DeferredTaxCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.DeferredTaxNet, xbrl.gaapRoot), year);
    }
    export function OtherAssetsCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.OtherAssetsCurrent, xbrl.gaapRoot), year);
    }

    export function CurrentAssets(xbrl: XBRL, year: number) {
        // try finding the current assets node
        let nodes = query.Select(taxon.AssetsCurrent, xbrl.gaapRoot);
        let currentAssets = SumNodes(nodes, year);

        if (currentAssets !== 0) return currentAssets;

        // current assets node might not exist, in which case try adding
        // up current assets ourself
        nodes = query.Select([
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


    export function PropertyAndEquipment(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.PropertyAndEquipmentNet, xbrl.gaapRoot), year);
    }
    export function Goodwill(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.Goodwill, xbrl.gaapRoot), year);
    }
    export function IntangibleAssets(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.IntangibleAssets, xbrl.gaapRoot), year);
    }
    export function OtherAssetsNonCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.PropertyAndEquipmentNet, xbrl.gaapRoot), year);
    }

    export function TotalAssets(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.Assets, xbrl.gaapRoot);
        let assets = SumNodes(nodes, year);

        if (assets !== 0) return assets;

        nodes = query.Select([
            taxon.PropertyAndEquipmentNet,
            taxon.Goodwill,
            taxon.IntangibleAssets,
            taxon.OtherAssetsNonCurrent
        ], xbrl.gaapRoot);
        let nonCurrentAssets = SumNodes(nodes, year);
        let currentAssets = CurrentAssets(xbrl, year);
        return nonCurrentAssets + currentAssets;
    }


    export function AccountsPayable(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.AccountsPayable, xbrl.gaapRoot), year);
    }
    export function ClaimsPayable(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.ClaimsPayable, xbrl.gaapRoot), year);
    }
    export function AccruedLiabilities(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.AccruedLiabilities, xbrl.gaapRoot), year);
    }
    export function ShortTermBorrowings(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.ShortTermBorrowings, xbrl.gaapRoot), year);
    }
    export function LongTermDebtCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.AccountsPayable, xbrl.gaapRoot), year);
    }

    export function CurrentLiabilities(xbrl: XBRL, year: number) {
        // try finding the current liabilities node
        let nodes = query.Select(taxon.LiabilitiesCurrent, xbrl.gaapRoot);
        let currentLiabilities = SumNodes(nodes, year);

        if (currentLiabilities !== 0) return currentLiabilities;

        nodes = query.Select([
            taxon.AccountsPayable,
            taxon.ClaimsPayable,
            taxon.AccruedLiabilities,
            taxon.ShortTermBorrowings,
            taxon.LongTermDebtCurrent
        ], xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }


    export function LongTermDebtNonCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }
    export function TaxLiabilityNonCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }
    export function OtherLiabilitiesNonCurrent(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }
    export function Commitments(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
    }

    export function NonCurrentLiabilities(xbrl: XBRL, year: number) {
        let nodes = query.Select([
            taxon.LongTermDebtNonCurrent,
            taxon.DeferredTaxLiabNonCurrent,
            taxon.OtherLiabNonCurrent,
            taxon.Commitments
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
        let nodes = query.Select(taxon.LongTermDebt, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }


    export function PreferredStockValue(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.PreferredStockValue, xbrl.gaapRoot), year);
    }
    export function CommonStockValue(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.CommonStockValue, xbrl.gaapRoot), year);
    }
    export function CapitalSurplus(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.CapitalSurplus, xbrl.gaapRoot), year);
    }
    export function RetainedEarnings(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.RetainedEarnings, xbrl.gaapRoot), year);
    }
    export function AccumulatedOtherIncome(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.AccumulatedOtherIncomeLoss, xbrl.gaapRoot), year);
    }
    export function TrearuryStockValue(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.TreasuryStockValue, xbrl.gaapRoot), year);
    }
    export function EmployeeTrustShareValue(xbrl: XBRL, year: number) {
        return SumNodes(query.Select(taxon.CommonStockSharesHeldInEmployeeTrust, xbrl.gaapRoot), year);
    }

    export function StockholdersEquityControlling(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.StockholdersEquityControlling, xbrl.gaapRoot);
        let equity = SumNodes(nodes, year);

        if (equity !== 0) return equity;

        let value = query.Select([
            taxon.PreferredStockValue,
            taxon.CommonStockValue,
            taxon.CapitalSurplus,
            taxon.RetainedEarnings,
            taxon.AccumulatedOtherIncomeLoss
        ], xbrl.gaapRoot);
        let shares = query.Select([
            taxon.TreasuryStockValue,
            taxon.CommonStockSharesHeldInEmployeeTrust
        ], xbrl.gaapRoot);
        return SumNodes(value, year) - SumNodes(value, year);
    }
    export function StockholdersEquityMinority(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.StockholdersEquityMinority, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function TotalStockholdersEquity(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.TotalStockholdersEquity, xbrl.gaapRoot);
        let equity = SumNodes(nodes, year);

        if (equity !== 0) return equity;

        return StockholdersEquityControlling(xbrl, year) + StockholdersEquityMinority(xbrl, year);
    }

    export function TotalLiabilitiesAndEquity(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.TotalLiabilitiesAndEquity, xbrl.gaapRoot);
        let total = SumNodes(nodes, year);

        if (total !== 0) return total;

        return TotalLiabilities(xbrl, year) + TotalStockholdersEquity(xbrl, year);
    }



    export function OutstandingShares(xbrl: XBRL, year: number) {
        // TODO: use weighted shares
        //       or shares from the beginning
        //       or end of the year/quarter?
        let nodes = query.Select(taxon.OutstandingCommonSharesWeighted, xbrl.gaapRoot);
        let shares = SumNodes(nodes, year);

        if (shares !== 0) return shares;

        nodes = query.Select(taxon.OutstandingCommonShares, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function OutstandingSharesDiluted(xbrl: XBRL, year: number) {
        let nodes: Element[] = query.Select(taxon.OutstandingCommonSharesWeightedDiluted, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }
    export function OutstandingPreferredShares(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.PreferredOutstandingShares, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

}