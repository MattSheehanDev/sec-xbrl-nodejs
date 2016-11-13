import { SelectNS } from '../namespaces/xmlns';
import { GaapNode } from './gaapnode';

// number of outstanding shares at time of reporting
// (which probably occurs AFTER the time frame that the report covers)
'EntityCommonStockSharesOutstanding';
// income tax
'EffectiveIncomeTaxRateContinuingOperations';


export module Taxonomy {

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
    export const OtherAssetsCurrent = 'OtherAssetsCurrent';

    // total assets
    export const Assets = 'Assets';

    export const PropertyAndEquipmentNet = 'PropertyPlantAndEquipmentNet';
    export const Goodwill = 'Goodwill';
    export const IntangibleAssets = 'IntangibleAssetsNetExcludingGoodwill';
    export const OtherAssetsNonCurrent = 'OtherAssetsNoncurrent';

    // Liabilities
    // current liabilities
    export const LiabilitiesCurrent = 'LiabilitiesCurrent';

    export const AccountsPayable = 'AccountsPayableCurrent';
    export const ClaimsPayable = 'ClaimsAndDiscountsPayable';
    export const AccruedLiabilities = 'AccruedLiabilitiesCurrent';
    export const ShortTermBorrowings = 'ShortTermBorrowings';
    export const LongTermDebtCurrent = 'LongTermDebtCurrent';

    // total liabilities
    export const LongTermDebtNonCurrent = 'LongTermDebtNoncurrent';
    export const DeferredTaxLiabNonCurrent = 'DeferredTaxLiabilitiesNoncurrent';
    export const OtherLiabNonCurrent = 'OtherLiabilitiesNoncurrent';
    export const Commitments = 'CommitmentsAndContingencies';

    export const LongTermDebt = 'LongTermDebt';   // current and non-current

    // Stockholders Equity
    export const TotalStockholdersEquity = 'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest';
    export const TotalLiabilitiesAndEquity = 'LiabilitiesAndStockholdersEquity';
    
    export const PreferredStockValue = 'PreferredStockValue';
    export const CommonStockValue = 'CommonStockValue';
    export const TreasuryStockValue = 'TreasuryStockValue';

    export const EmployeeTrustValue = 'CommonStockSharesHeldInEmployeeTrust';
    export const CapitalSurplus = 'AdditionalPaidInCapital';
    export const RetainedEarnings = 'RetainedEarningsAccumulatedDeficit';
    export const AccumulatedOtherIncomeLoss = 'AccumulatedOtherComprehensiveIncomeLossNetOfTax';
    export const StockholdersEquityControlling = 'StockholdersEquity';
    export const StockholdersEquityMinority = 'MinorityInterest';


    export const PreferredStockPar = 'PreferredStockParOrStatedValuePerShare';
    export const PreferredStockAuthorized = 'PreferredStockSharesAuthorized';
    export const PreferredStockIssued = 'PreferredStockSharesIssued';
    export const PreferredStockOutstanding = 'PreferredStockSharesOutstanding';

    export const CommonStockPar = 'CommonStockParOrStatedValuePerShare';
    export const CommonStockAuthorized = 'CommonStockSharesAuthorized';
    export const CommonStockIssued = 'CommonStockSharesIssued';
    export const CommonStockOutstanding = 'CommonStockSharesOutstanding';

    export const TreasuryStockShares = 'TreasuryStockShares';
    export const EmployeeTrustShares = 'CommonStockSharesHeldInEmployeeTrustShares'


    //////////////////////////////////////////////////
    // Income Statement
    //////////////////////////////////////////////////

    // Revenues
    export const NetRevenue = 'Revenues';
    export const CostOfRevenue = 'CostOfRevenue';
    export const GrossProfit = 'GrossProfit';

    export const OperatingExpenses = 'OperatingExpenses';
    export const OperatingProfit = 'OperatingIncomeLoss';

    export const InterestExpenseNet = 'InterestIncomeExpenseNet';
    export const DebtExtinguishmentGainsLosses = 'GainsLossesOnExtinguishmentOfDebt';
    export const OperatingIncomeBeforeTax = 'IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments';

    export const IncomeTaxProvision = 'IncomeTaxExpenseBenefit';
    export const OperatingIncomeAfterTax = 'IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest';

    export const IncomeFromDiscontinuedOperations = 'IncomeLossFromDiscontinuedOperationsNetOfTax';
    export const NetIncome = 'ProfitLoss';

    export const NetIncomeFromNonControllingInterest = 'NetIncomeLossAttributableToNoncontrollingInterest';
    export const NetIncomeAvailable = 'NetIncomeLossAvailableToCommonStockholdersBasic';

    export const OtherForeignIncomeAdj = 'OtherComprehensiveIncomeLossForeignCurrencyTransactionAndTranslationAdjustmentNetOfTax';
    export const OtherDerivativeIncomeAdj = 'OtherComprehensiveIncomeUnrealizedGainLossOnDerivativesArisingDuringPeriodNetOfTax';
    export const OtherPensionIncomeAdj = 'OtherComprehensiveIncomeLossPensionAndOtherPostretirementBenefitPlansAdjustmentNetOfTax';
    export const OtherComprehensiveIncomeAdj = 'OtherComprehensiveIncomeLossNetOfTax';

    export const NetIncomeComprehensiveControlling = 'ComprehensiveIncomeNetOfTax';

    export const NetIncomeComprehensiveNonControlling = 'ComprehensiveIncomeNetOfTaxAttributableToNoncontrollingInterest';
    export const NetIncomeComprehensiveTotal = 'ComprehensiveIncomeNetOfTaxIncludingPortionAttributableToNoncontrollingInterest';


    // basic earnings per share
    export const OperatingIncomePerShare = 'IncomeLossFromContinuingOperationsPerBasicShare';
    export const DiscontinuedOperatingIncomePerShare = 'IncomeLossFromDiscontinuedOperationsNetOfTaxPerBasicShare';
    export const EarningsPerShare = 'EarningsPerShareBasic';

    export const OutstandingCommonSharesWeighted = 'WeightedAverageNumberOfSharesOutstandingBasic';
    
    // diluted earnings per share
    export const OperatingIncomePerShareDiluted = 'IncomeLossFromContinuingOperationsPerDilutedShare';
    export const DiscontinuedOperatingIncomePerShareDiluted = 'IncomeLossFromDiscontinuedOperationsNetOfTaxPerDilutedShare'
    export const EarningsPerShareDiluted = 'EarningsPerShareDiluted';

    export const OutstandingCommonSharesWeightedDiluted = 'WeightedAverageNumberOfDilutedSharesOutstanding';

    export const DividendDeclared = 'CommonStockDividendsPerShareDeclared';

    // export const NetIncomeLoss = 'NetIncomeLoss';


    // TODO: sum totals
    // TODO: finish cash flow names
    // TODO: comprehensive balance sheet
    // TODO: calculate earnings per share manually too?
    // TODO: update dei, instance to work like gaap
    // TODO: should seperate nodes by years before SumNodes
    // TODO: move annualreport function to own modules
    // TODO: parse schemas
    // TODO: format output for templates
    // TODO: xbrl-us api? https://github.com/xbrlus/data_analysis_toolkit/tree/master/pages/api


}



export function All(document: Document) {
    // let select = xpath.useNamespaces({ usgaap: 'http://fasb.org/us-gaap/2013-01-31' });
    return SelectNS(`//*[namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`, document);
}

export function Select(names: string | string[], document: Document | Element): GaapNode[] {
    if (Array.isArray(names)) {
        return selectFromArray(names, document);
    }
    else {
        let nodes = selectUsingNS(names, document);
        if (nodes.length > 0)
            return createGaapNodes(nodes);

        nodes = selectUsingPrefix(names, document);
        if (nodes.length)
            return createGaapNodes(nodes);
    }
    return [];
}



function selectFromArray(names: string[], document: Document | Element): GaapNode[] {
    let nodes: Element[] = [];
    for (let name of names) {
        nodes = nodes.concat(selectUsingNS(name, document));
    }

    if (nodes) return createGaapNodes(nodes);

    for (let name of names) {
        nodes = nodes.concat(selectUsingPrefix(name, document));
    }
    return createGaapNodes(nodes);
}
function selectUsingNS(name: string, document: Document | Element) {
    let usingNS = `//*[local-name()='${name}' and namespace-uri()='http://fasb.org/us-gaap/2013-01-31']`;
    return SelectNS(usingNS, document);
}
function selectUsingPrefix(name: string, document: Document | Element) {
    let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), 'us-gaap')]`;
    return SelectNS(usingPrefix, document);
}

function createGaapNodes(nodes: any[]) {
    let gaapNodes: GaapNode[] = [];
    for (let n of nodes) {
        gaapNodes.push(new GaapNode(n));
    }
    return gaapNodes;
}
