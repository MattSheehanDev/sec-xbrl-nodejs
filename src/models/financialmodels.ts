

export interface BalanceSheetModel {
    // document information
    year?: number;
    endDate?: string;

    // current assets
    cash?: number;
    shortTermInvestments?: number;
    accountsReceivable?: number;
    netInventory?: number;
    netDeferredTax?: number;
    otherAssetsCurrent?: number;
    totalAssetsCurrent?: number;

    // noncurrent assets
    propertyAndEquipment?: number;
    goodwill?: number;
    intangibleAssets?: number;
    otherAssetsNonCurrent?: number;
    
    // total assets
    totalAssets?: number;


    // current liabilities
    accountsPayable?: number;
    claimsPayable?: number;
    accruedLiabilities?: number;
    shortTermDebt?: number;
    longTermDebtCurrent?: number;
    totalLiabilitiesCurrent?: number;

    // noncurrent liabilities
    longTermDebtNonCurrent?: number;
    taxLiabilityNonCurrent?: number;
    otherLiabilitiesNonCurrent?: number;
    commitments?: number;

    // total liabilities
    totalLiabilities?: number;


    // stockholders equity
    preferredStockValue?: number;
    commonStockValue?: number;
    capitalSurplus?: number;
    retainedEarnings?: number;
    accumulatedOtherIncome?: number;

    treasuryStockValue?: number;
    employeeTrustShareValue?: number;

    equityControlling?: number;
    equityMinority?: number;
    totalEquity?: number;

    totalLiabilitiesAndEquity?: number;
}

export interface FinancialPositionModel {
    year?: number;
    endDate?: string;

    prefStockPar?: number;
    prefStockAuth?: number;
    prefStockIssued?: number;
    prefStockOutstanding?: number;

    commonStockPar?: number;
    commonStockAuth?: number;
    commonStockIssued?: number;
    commonStockOutstanding?: number;

    treasuryShares?: number;
    employeeTrustShares?: number;
}

export interface IncomeStatementModel {

}