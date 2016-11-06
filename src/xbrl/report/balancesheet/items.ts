import { Taxonomy as taxon, Select } from '../../namespaces/gaap';
import XBRLDocument from '../../xbrl';
import { GaapNode, SumNodesByYear } from '../../node';


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
        return SumNodesByYear(Select(taxon.EmployeeTrustValue, xbrl.gaapRoot));
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
            taxon.EmployeeTrustValue
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

        return SumNodesByYear(Select(taxon.CommonStockOutstanding, xbrl.gaapRoot));
    }
    export function OutstandingSharesDiluted(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.OutstandingCommonSharesWeightedDiluted, xbrl.gaapRoot));
    }
    export function OutstandingPreferredShares(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredStockOutstanding, xbrl.gaapRoot));
    }

}



// import { Taxonomy as taxon, Select } from '../namespaces/gaap';
// import { GaapNode } from '../node';
// import XBRLDocument from '../xbrl';


// export function SumNodes(nodes: GaapNode[], year: number) {
//     let sum = 0;
//     for (let node of nodes) {
//         if (node.value && node.year === year) {
//             sum += node.value;
//         }
//     }
//     return sum;
// }


// export module BalanceSheetXBRL {
//     // Assets = Liabilities + Stockholders Equity

//     export function CashAndCashEquivalents(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.CashAndCashEquivalent, xbrl.gaapRoot), year);
//     }
//     export function ShortTermInvestments(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.ShortTermInvestments, xbrl.gaapRoot), year);
//     }
//     export function AccountsReceivable(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.AccountsReceivableNet, xbrl.gaapRoot), year);
//     }
//     export function InventoryValue(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.InventoryNet, xbrl.gaapRoot), year);
//     }
//     export function DeferredTaxCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.DeferredTaxNet, xbrl.gaapRoot), year);
//     }
//     export function OtherAssetsCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.OtherAssetsCurrent, xbrl.gaapRoot), year);
//     }

//     export function CurrentAssets(xbrl: XBRLDocument, year: number) {
//         // try finding the current assets node
//         let nodes = Select(taxon.AssetsCurrent, xbrl.gaapRoot);
//         let currentAssets = SumNodes(nodes, year);

//         if (currentAssets !== 0) return currentAssets;

//         // current assets node might not exist, in which case try adding
//         // up current assets ourself
//         nodes = Select([
//             taxon.CashAndCashEquivalent,
//             taxon.ShortTermInvestments,
//             taxon.AccountsReceivableNet,
//             taxon.InventoryNet,
//             taxon.DeferredTaxNet,
//             taxon.OtherAssetsCurrent
//         ], xbrl.gaapRoot);

//         // seperate the current year nodes and sum the current year nodes
//         // if there is more than one node.
//         return SumNodes(nodes, year);
//     }


//     export function PropertyAndEquipment(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.PropertyAndEquipmentNet, xbrl.gaapRoot), year);
//     }
//     export function Goodwill(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.Goodwill, xbrl.gaapRoot), year);
//     }
//     export function IntangibleAssets(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.IntangibleAssets, xbrl.gaapRoot), year);
//     }
//     export function OtherAssetsNonCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.OtherAssetsNonCurrent, xbrl.gaapRoot), year);
//     }

//     export function TotalAssets(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.Assets, xbrl.gaapRoot);
//         let assets = SumNodes(nodes, year);

//         if (assets !== 0) return assets;

//         nodes = Select([
//             taxon.PropertyAndEquipmentNet,
//             taxon.Goodwill,
//             taxon.IntangibleAssets,
//             taxon.OtherAssetsNonCurrent
//         ], xbrl.gaapRoot);
//         let nonCurrentAssets = SumNodes(nodes, year);
//         let currentAssets = CurrentAssets(xbrl, year);
//         return nonCurrentAssets + currentAssets;
//     }


//     export function AccountsPayable(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.AccountsPayable, xbrl.gaapRoot), year);
//     }
//     export function ClaimsPayable(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.ClaimsPayable, xbrl.gaapRoot), year);
//     }
//     export function AccruedLiabilities(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.AccruedLiabilities, xbrl.gaapRoot), year);
//     }
//     export function ShortTermBorrowings(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.ShortTermBorrowings, xbrl.gaapRoot), year);
//     }
//     export function LongTermDebtCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.AccountsPayable, xbrl.gaapRoot), year);
//     }

//     export function CurrentLiabilities(xbrl: XBRLDocument, year: number) {
//         // try finding the current liabilities node
//         let nodes = Select(taxon.LiabilitiesCurrent, xbrl.gaapRoot);
//         let currentLiabilities = SumNodes(nodes, year);

//         if (currentLiabilities !== 0) return currentLiabilities;

//         nodes = Select([
//             taxon.AccountsPayable,
//             taxon.ClaimsPayable,
//             taxon.AccruedLiabilities,
//             taxon.ShortTermBorrowings,
//             taxon.LongTermDebtCurrent
//         ], xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }


//     export function LongTermDebtNonCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
//     }
//     export function TaxLiabilityNonCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
//     }
//     export function OtherLiabilitiesNonCurrent(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
//     }
//     export function Commitments(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.LongTermDebtNonCurrent, xbrl.gaapRoot), year);
//     }

//     export function NonCurrentLiabilities(xbrl: XBRLDocument, year: number) {
//         let nodes = Select([
//             taxon.LongTermDebtNonCurrent,
//             taxon.DeferredTaxLiabNonCurrent,
//             taxon.OtherLiabNonCurrent,
//             taxon.Commitments
//         ], xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }

//     export function TotalLiabilities(xbrl: XBRLDocument, year: number) {
//         return CurrentLiabilities(xbrl, year) + NonCurrentLiabilities(xbrl, year);
//     }

//     export function LongTermDebt(xbrl: XBRLDocument, year: number) {
//         // TODO: use long-term debt non-current?
//         //       all other non-current liabilities?
//         //       or all long-term debt (current + noncurrent)?
//         let nodes = Select(taxon.LongTermDebt, xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }


//     export function PreferredStockValue(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.PreferredStockValue, xbrl.gaapRoot), year);
//     }
//     export function CommonStockValue(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.CommonStockValue, xbrl.gaapRoot), year);
//     }
//     export function CapitalSurplus(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.CapitalSurplus, xbrl.gaapRoot), year);
//     }
//     export function RetainedEarnings(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.RetainedEarnings, xbrl.gaapRoot), year);
//     }
//     export function AccumulatedOtherIncome(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.AccumulatedOtherIncomeLoss, xbrl.gaapRoot), year);
//     }
//     export function TrearuryStockValue(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.TreasuryStockValue, xbrl.gaapRoot), year);
//     }
//     export function EmployeeTrustShareValue(xbrl: XBRLDocument, year: number) {
//         return SumNodes(Select(taxon.CommonStockSharesHeldInEmployeeTrust, xbrl.gaapRoot), year);
//     }

//     export function StockholdersEquityControlling(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.StockholdersEquityControlling, xbrl.gaapRoot);
//         let equity = SumNodes(nodes, year);

//         if (equity !== 0) return equity;

//         let value = Select([
//             taxon.PreferredStockValue,
//             taxon.CommonStockValue,
//             taxon.CapitalSurplus,
//             taxon.RetainedEarnings,
//             taxon.AccumulatedOtherIncomeLoss
//         ], xbrl.gaapRoot);
//         let shares = Select([
//             taxon.TreasuryStockValue,
//             taxon.CommonStockSharesHeldInEmployeeTrust
//         ], xbrl.gaapRoot);
//         return SumNodes(value, year) - SumNodes(value, year);
//     }
//     export function StockholdersEquityMinority(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.StockholdersEquityMinority, xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }
//     export function TotalStockholdersEquity(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.TotalStockholdersEquity, xbrl.gaapRoot);
//         let equity = SumNodes(nodes, year);

//         if (equity !== 0) return equity;

//         return StockholdersEquityControlling(xbrl, year) + StockholdersEquityMinority(xbrl, year);
//     }

//     export function TotalLiabilitiesAndEquity(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.TotalLiabilitiesAndEquity, xbrl.gaapRoot);
//         let total = SumNodes(nodes, year);

//         if (total !== 0) return total;

//         return TotalLiabilities(xbrl, year) + TotalStockholdersEquity(xbrl, year);
//     }



//     export function OutstandingShares(xbrl: XBRLDocument, year: number) {
//         // TODO: use weighted shares
//         //       or shares from the beginning
//         //       or end of the year/quarter?
//         let nodes = Select(taxon.OutstandingCommonSharesWeighted, xbrl.gaapRoot);
//         let shares = SumNodes(nodes, year);

//         if (shares !== 0) return shares;

//         nodes = Select(taxon.OutstandingCommonShares, xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }
//     export function OutstandingSharesDiluted(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.OutstandingCommonSharesWeightedDiluted, xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }
//     export function OutstandingPreferredShares(xbrl: XBRLDocument, year: number) {
//         let nodes = Select(taxon.PreferredOutstandingShares, xbrl.gaapRoot);
//         return SumNodes(nodes, year);
//     }

// }