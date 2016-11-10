import XBRLDocument from '../../xbrl';
import { DFSBalanceSheetValue } from '../../../utilities/dfs';

import { BalanceSheetModel } from '../../../models/financialmodels';
import { BalanceSheetItems } from './items';
import { BalanceSheetNode, BalanceSheetLine, Clone } from './balancesheetnode';




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
