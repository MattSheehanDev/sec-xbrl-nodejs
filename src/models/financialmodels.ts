

export interface IEntity {
    registrantName: string;
    centralIndexKey: string;
    documentType: string;
    focusPeriod: string;
    yearFocus: string;
    documentDate: string;
    amendment: string;
}

export class EntityModel {

    public readonly Name: string;
    public readonly CIK: string;
    public readonly Type: string;
    public readonly YearFocus: number;
    public readonly DocumentDate: Date;
    public readonly Amendment: boolean;

    constructor(options: IEntity) {
        this.Name = options.registrantName;
        this.CIK = options.centralIndexKey;
        this.Type = options.documentType;
        this.YearFocus = options.yearFocus ? parseInt(options.yearFocus) : null;
        this.DocumentDate = options.documentDate ? new Date(options.documentDate) : null;
        this.Amendment = options.amendment === 'true';
    }
}



export interface BalanceSheetModel {
    // document information
    year: number;
    endDate: string;

    // current assets
    cash: number;
    shortTermInvestments: number;
    accountsReceivable: number;
    netInventory: number;
    netDeferredTax: number;
    otherAssetsCurrent: number;
    totalAssetsCurrent: number;

    // noncurrent assets
    propertyAndEquipment: number;
    goodwill: number;
    intangibleAssets: number;
    otherAssetsNonCurrent: number;
    
    // total assets
    totalAssets: number;


    // current liabilities
    accountsPayable: number;
    claimsPayable: number;
    accruedLiabilities: number;
    shortTermDebt: number;
    longTermDebtCurrent: number;
    totalLiabilitiesCurrent: number;

    // noncurrent liabilities
    longTermDebtNonCurrent: number;
    taxLiabilityNonCurrent: number;
    otherLiabilitiesNonCurrent: number;
    commitments: number;

    // total liabilities
    totalLiabilities: number;


    // stockholders equity
    preferredStockValue: number;
    commonStockValue: number;
    capitalSurplus: number;
    retainedEarnings: number;
    accumulatedOtherIncome: number;

    treasuryStockValue: number;
    employeeTrustShareValue: number;

    equityControlling: number;
    equityMinority: number;
    totalEquity: number;

    totalLiabilitiesAndEquity: number;
}


export interface IncomeStatementModel {

}