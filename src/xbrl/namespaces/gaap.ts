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
    export const SharePrice = 'CommonStockMarketPricePerShare';


    //////////////////////////////////////////////////
    // Balance Sheet
    //////////////////////////////////////////////////

    // Assets
    // current assets
    export const AssetsCurrent = 'AssetsCurrent';

    export const CashAndCashEquivalent = 'CashAndCashEquivalentsAtCarryingValue';
    export const ShortTermInvestments = 'ShortTermInvestments';
    export const AccountsReceivableNet = 'AccountsReceivableNetCurrent';
    export const InventoryNet = 'InventoryNet';
    export const DeferredTaxNet = 'DeferredTaxAssetsNetCurrent';
    export const OtherAssets = 'OtherAssetsCurrent';

    // export const AssetsCurrentSummed = [
    //     CashAndCashEquivalent,
    //     ShortTermInvestments,
    //     AccountsReceivableNet,
    //     InventoryNet,
    //     DeferredTaxNet,
    //     OtherAssets
    // ];
    // total assets
    export const Assets = 'Assets';

    export const PropertyAndEquipmentNet = 'PropertyPlantAndEquipmentNet';
    export const Goodwill = 'Goodwill';
    export const IntangibleAssets = 'IntangibleAssetsNetExcludingGoodwill';
    export const OtherAssetsNonCurrent = 'OtherAssetsNoncurrent';
    // export const AssetsSummed = [
    //     // +CurrentAssets
    //     PropertyAndEquipmentNet,
    //     Goodwill,
    //     IntangibleAssets,
    //     OtherAssetsNonCurrent
    // ];

    // Liabilities
    // current liabilities
    export const LiabilitiesCurrent = 'LiabilitiesCurrent';
    
    export const AccountsPayable = 'AccountsPayableCurrent';
    export const ClaimsPayable = 'ClaimsAndDiscountsPayable';
    export const AccruedLiabilities = 'AccruedLiabilitiesCurrent';
    export const ShortTermBorrowings = 'ShortTermBorrowings';
    export const LongTermDebtCurrent = 'LongTermDebtCurrent';

    // export const LiabilitiesCurrentSummed = [
    //     AccountsPayable,
    //     ClaimsPayable,
    //     AccruedLiabilities,
    //     ShortTermBorrowings,
    //     LongTermDebtCurrent            // portion of the long-term debt owed in the next 12-months
    // ];

    // total liabilities
    export const LongTermDebtNonCurrent = 'LongTermDebtNoncurrent';
    export const DeferredTaxLiabNonCurrent = 'DeferredTaxLiabilitiesNoncurrent';
    export const OtherLiabNonCurrent = 'OtherLiabilitiesNoncurrent';
    export const Commitments = 'CommitmentsAndContingencies';

    // export const LiabilitiesSummed = [
    //     // +CurrentLiabilities
    //     LongTermDebtNonCurrent,
    //     DeferredTaxLiabNonCurrent,
    //     OtherLiabNonCurrent,
    //     Commitments
    // ];

    export const LongTermDebt = 'LongTermDebt';   // current and non-current

    // Stockholders Equity
    export const TotalStockholdersEquity = 'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest';
    export const TotalLiabilitiesAndEquity = 'LiabilitiesAndStockholdersEquity';

    export const PreferredOutstandingShares = 'PreferredStockSharesOutstanding';
    export const PreferredStockValue = 'PreferredStockValue';

    export const OutstandingCommonShares = 'CommonStockSharesOutstanding';
    export const OutstandingCommonSharesWeighted = 'WeightedAverageNumberOfSharesOutstandingBasic';
    export const OutstandingCommonSharesDilutedWeighted = 'WeightedAverageNumberOfDilutedSharesOutstanding'; 
    // export const OutstandingShares = [
    //     'WeightedAverageNumberOfSharesOutstandingBasic',
    //     'CommonStockSharesOutstanding'
    // ];    
    export const CommonStockValue = 'CommonStockValue';

    export const TreasuryStockShares = 'TreasuryStockShares';
    export const TreasuryStockValue = 'TreasuryStockValue';

    export const CommonStockSharesHeldInEmployeeTrust = 'CommonStockSharesHeldInEmployeeTrust';
    export const CapitalSurplus = 'AdditionalPaidInCapital';
    export const RetainedEarnings = 'RetainedEarningsAccumulatedDeficit';
    export const AccumulatedOtherIncomeLoss = 'AccumulatedOtherComprehensiveIncomeLossNetOfTax';
    export const StockholdersEquityControlling = 'StockholdersEquity';
    export const StockholdersEquityMinority = 'MinorityInterest';

    // export const TotalStockholdersEquitySummed = [
    //     StockholdersEquityControlling,
    //     StockholdersEquityMinority
    // ];
    // export const TotalLiabilitiesAndEquitySummed = [
    //     // all liabilities
    //     LiabilitiesCurrent,
    //     LongTermDebtNonCurrent,
    //     DeferredTaxLiabNonCurrent,
    //     OtherLiabNonCurrent,
    //     Commitments,
    //     // +stockholders equity
    //     StockholdersEquityControlling,
    //     StockholdersEquityMinority
    // ];

    //////////////////////////////////////////////////
    // Income Statement
    //////////////////////////////////////////////////

    // Revenues
    export const NetRevenue = 'Revenues';
    export const CostOfRevenue = 'CostOfRevenue';
    export const GrossProfit = 'GrossProfit';
    export const GrossProfitSummed = [NetRevenue, -CostOfRevenue]

    export const OperatingExpenses = 'OperatingExpenses';
    export const OperatingProfit = 'OperatingIncomeLoss';
    export const OperatingProfitSummed = [GrossProfit, -OperatingExpenses];

    // TODO: sum totals 
    // TODO: gaap names to Names module
    // TODO: update dei, instance to work like gaap 
    // TODO: change annualreport to just report
    // TODO: move annualreport function to own modules
    export const InterestExpenseNet = 'InterestIncomeExpenseNet';
    export const DebtExtinguishmentGainsLosses = 'GainsLossesOnExtinguishmentOfDebt';
    export const OperatingIncomeBeforeTax = 'IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments';

    export const IncomeTaxProvision = 'IncomeTaxExpenseBenefit';
    export const OperatingIncomeAfterTax = 'IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest';

    export const IncomeFromDiscontinuedOperations = 'IncomeLossFromDiscontinuedOperationsNetOfTax';



    export const NetIncomeLoss = 'NetIncomeLoss';
    export const NetIncomeLossToCommonStock = 'NetIncomeLossAvailableToCommonStockholdersBasic';

    export const EarningsPerShare = 'EarningsPerShareBasic';
    export const DilutedEarningsPerShare = 'EarningsPerShareDiluted';
    export const DeclaredDividend = 'CommonStockDividendsPerShareDeclared';



    export function All(document: Document) {
        // let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
        return SelectNS(`//*[namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`, document);
    }

    export function Select(names: string|string[], document: Document|Element): any[] {
        if (Array.isArray(names)) {
            return selectFromArray(names, document);
        }
        else {
            let nodes = selectUsingNS(names, document);
            if (nodes.length > 0)
                return nodes;

            nodes = selectUsingPrefix(name, document);
            if (nodes.length)
                return nodes;
        }
        return [];
    }
    function selectFromArray(names: string[], document: Document|Element) {
        let nodes: Element[] = [];
        for (let name of names) {
            nodes = nodes.concat(selectUsingNS(name, document));
            // if (nodes.length > 0) return nodes;
        }

        if (nodes) return nodes;

        for (let name of names) {
            nodes = nodes.concat(selectUsingPrefix(name, document));
            // if (nodes.length) return nodes;
        }
        return nodes;
    }
    function selectUsingNS(name: string, document: Document|Element) {
        let usingNS = `//*[local-name()='${name}' and namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`;
        return SelectNS(usingNS, document);
    }
    function selectUsingPrefix(name: string, document: Document|Element) {
        let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), 'us-gaap')]`;
        return SelectNS(usingPrefix, document);
    }

}

export default USGAAP;