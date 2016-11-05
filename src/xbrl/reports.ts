import { EntityInfoXBRL as EntityInfo } from './report/entityinformation'; 
import { BalanceSheetXBRL as BS } from './report/balancesheet';
import { IncomeStatementXBRL as IS } from './report/incomestatement';

import { BalanceSheetModel, IncomeStatementModel, EntityModel } from '../models/financialmodels';
import { TenKValues, TenK } from '../models/tenk';

import XBRL from './xbrl';

import { DateTime as datetime } from '../utilities/datetime';


export module Report {


    export function CreateEntityInformation(xbrl: XBRL) {
        return new EntityModel({
            registrantName: EntityInfo.RegistrantName(xbrl),
            centralIndexKey: EntityInfo.CentralIndexKey(xbrl),
            documentType: EntityInfo.DocumentType(xbrl),
            focusPeriod: EntityInfo.DocumentFocusPeriod(xbrl),
            yearFocus: EntityInfo.DocumentYearFocus(xbrl),
            documentDate: EntityInfo.DocumentEndDate(xbrl),
            amendment: EntityInfo.Amendment(xbrl)
        });
    }


    export function CreateBalanceSheet(xbrl: XBRL) {
        let date = new Date(EntityInfo.DocumentEndDate(xbrl));
        let year = date.getFullYear();

        let balanceSheet: BalanceSheetModel = {
            year: year,
            endDate: datetime.format(date, 'MMM. dd, yyyy'),

            cash: BS.CashAndCashEquivalents(xbrl, year),
            shortTermInvestments: BS.ShortTermInvestments(xbrl, year),
            accountsReceivable: BS.AccountsReceivable(xbrl, year),
            netInventory: BS.InventoryValue(xbrl, year),
            netDeferredTax: BS.DeferredTaxCurrent(xbrl, year),
            otherAssetsCurrent: BS.OtherAssetsCurrent(xbrl, year),
            totalAssetsCurrent: BS.CurrentAssets(xbrl, year),

            propertyAndEquipment: BS.PropertyAndEquipment(xbrl, year),
            goodwill: BS.Goodwill(xbrl, year),
            intangibleAssets: BS.IntangibleAssets(xbrl, year),
            otherAssetsNonCurrent: BS.OtherAssetsNonCurrent(xbrl, year),
            totalAssets: BS.TotalAssets(xbrl, year),

            accountsPayable: BS.AccountsPayable(xbrl, year),
            claimsPayable:BS.ClaimsPayable(xbrl, year),
            accruedLiabilities: BS.AccruedLiabilities(xbrl, year),
            shortTermDebt: BS.ShortTermBorrowings(xbrl, year),
            longTermDebtCurrent: BS.LongTermDebtCurrent(xbrl, year),
            totalLiabilitiesCurrent: BS.CurrentLiabilities(xbrl, year),

            longTermDebtNonCurrent: BS.LongTermDebtNonCurrent(xbrl, year),
            taxLiabilityNonCurrent: BS.TaxLiabilityNonCurrent(xbrl, year),
            otherLiabilitiesNonCurrent: BS.OtherLiabilitiesNonCurrent(xbrl, year),
            commitments: BS.Commitments(xbrl, year),
            totalLiabilities: BS.TotalLiabilities(xbrl, year),

            preferredStockValue: BS.PreferredStockValue(xbrl, year),
            commonStockValue: BS.CommonStockValue(xbrl, year),
            treasuryStockValue: BS.TrearuryStockValue(xbrl, year),
            employeeTrustShareValue: BS.EmployeeTrustShareValue(xbrl, year),
            capitalSurplus: BS.CapitalSurplus(xbrl, year),
            retainedEarnings: BS.RetainedEarnings(xbrl, year),
            accumulatedOtherIncome: BS.AccumulatedOtherIncome(xbrl, year),

            equityControlling: BS.StockholdersEquityControlling(xbrl, year),
            equityMinority: BS.StockholdersEquityMinority(xbrl, year),
            totalEquity: BS.TotalStockholdersEquity(xbrl, year),

            totalLiabilitiesAndEquity: BS.TotalLiabilitiesAndEquity(xbrl, year)
        }

        year = year - 1;
        date.setFullYear(year);
        let balanceSheet2: BalanceSheetModel = {
            year: year,
            endDate: datetime.format(date, 'MMM. dd, yyyy'),

            cash: BS.CashAndCashEquivalents(xbrl, year),
            shortTermInvestments: BS.ShortTermInvestments(xbrl, year),
            accountsReceivable: BS.AccountsReceivable(xbrl, year),
            netInventory: BS.InventoryValue(xbrl, year),
            netDeferredTax: BS.DeferredTaxCurrent(xbrl, year),
            otherAssetsCurrent: BS.OtherAssetsCurrent(xbrl, year),
            totalAssetsCurrent: BS.CurrentAssets(xbrl, year),

            propertyAndEquipment: BS.PropertyAndEquipment(xbrl, year),
            goodwill: BS.Goodwill(xbrl, year),
            intangibleAssets: BS.IntangibleAssets(xbrl, year),
            otherAssetsNonCurrent: BS.OtherAssetsNonCurrent(xbrl, year),
            totalAssets: BS.TotalAssets(xbrl, year),

            accountsPayable: BS.AccountsPayable(xbrl, year),
            claimsPayable:BS.ClaimsPayable(xbrl, year),
            accruedLiabilities: BS.AccruedLiabilities(xbrl, year),
            shortTermDebt: BS.ShortTermBorrowings(xbrl, year),
            longTermDebtCurrent: BS.LongTermDebtCurrent(xbrl, year),
            totalLiabilitiesCurrent: BS.CurrentLiabilities(xbrl, year),

            longTermDebtNonCurrent: BS.LongTermDebtNonCurrent(xbrl, year),
            taxLiabilityNonCurrent: BS.TaxLiabilityNonCurrent(xbrl, year),
            otherLiabilitiesNonCurrent: BS.OtherLiabilitiesNonCurrent(xbrl, year),
            commitments: BS.Commitments(xbrl, year),
            totalLiabilities: BS.TotalLiabilities(xbrl, year),

            preferredStockValue: BS.PreferredStockValue(xbrl, year),
            commonStockValue: BS.CommonStockValue(xbrl, year),
            treasuryStockValue: BS.TrearuryStockValue(xbrl, year),
            employeeTrustShareValue: BS.EmployeeTrustShareValue(xbrl, year),
            capitalSurplus: BS.CapitalSurplus(xbrl, year),
            retainedEarnings: BS.RetainedEarnings(xbrl, year),
            accumulatedOtherIncome: BS.AccumulatedOtherIncome(xbrl, year),

            equityControlling: BS.StockholdersEquityControlling(xbrl, year),
            equityMinority: BS.StockholdersEquityMinority(xbrl, year),
            totalEquity: BS.TotalStockholdersEquity(xbrl, year),

            totalLiabilitiesAndEquity: BS.TotalLiabilitiesAndEquity(xbrl, year)
        }

        return [balanceSheet,balanceSheet2];
    }




    export function Create10K(xbrl: XBRL) {
        let year = parseInt(EntityInfo.DocumentYearFocus(xbrl));

        let tenk: TenKValues = {
            year: year,
            date: EntityInfo.DocumentEndDate(xbrl),
            type: EntityInfo.DocumentType(xbrl),

            currentAssets: BS.CurrentAssets(xbrl, year),
            currentLiab: BS.CurrentLiabilities(xbrl, year),
            longTermDebt: BS.LongTermDebt(xbrl, year),
            outstandingShares: BS.OutstandingShares(xbrl, year),
            dilutedOutstandingShares: BS.OutstandingSharesDiluted(xbrl, year),
            prefOutstandingShares: BS.OutstandingPreferredShares(xbrl, year),

            totalRevenue: IS.NetRevenue(xbrl, year),
            netIncome: IS.NetIncomeComprehensiveTotal(xbrl, year),

            eps: IS.EarningsPerShare(xbrl, year),
            dilutedEps: IS.EarningsPerShareDiluted(xbrl, year),
            declaredDividend: IS.DividendDeclared(xbrl, year)
        }
        return new TenK(tenk);
    }

}


export default Report;

