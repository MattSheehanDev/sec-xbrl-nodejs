import { EntityInfoXBRL as EntityInfo } from './report/entityinformation';
import { IncomeStatementXBRL as IS } from './report/incomestatement';

import { BalanceSheetModel, FinancialPositionModel, IncomeStatementModel } from '../models/financialmodels';
import { EntityModel } from '../models/entitymodel';
import { TenKValues, TenK } from '../models/tenk';

import { ConsolidatedBalanceSheets } from './report/balancesheet/consolidated';
import { ConsolidatedFinancialPositions } from './report/financialposition/consolidated';
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
        let consolidated = new ConsolidatedBalanceSheets(xbrl);
        let reports = consolidated.Reports();

        let date = new Date(EntityInfo.DocumentEndDate(xbrl));

        for (let report of reports) {
            date.setFullYear(report.year);
            
            report.endDate = datetime.format(date, 'MMM. dd, yyyy');
        }
        
        return reports.reverse();
    }

    export function CreateFinancialPosition(xbrl: XBRL) {
        let consolidated = new ConsolidatedFinancialPositions(xbrl);
        let reports = consolidated.Reports();

        let date = new Date(EntityInfo.DocumentEndDate(xbrl));

        for (let report of reports) {
            date.setFullYear(report.year);

            report.endDate = datetime.format(date, 'MMM. dd, yyyy');
        }

        return reports.reverse();
    }


    // export function Create10K(xbrl: XBRL) {
    //     let year = parseInt(EntityInfo.DocumentYearFocus(xbrl));

    //     let tenk: TenKValues = {
    //         year: year,
    //         date: EntityInfo.DocumentEndDate(xbrl),
    //         type: EntityInfo.DocumentType(xbrl),

    //         currentAssets: BS.CurrentAssets(xbrl, year),
    //         currentLiab: BS.CurrentLiabilities(xbrl, year),
    //         longTermDebt: BS.LongTermDebt(xbrl, year),
    //         outstandingShares: BS.OutstandingShares(xbrl, year),
    //         dilutedOutstandingShares: BS.OutstandingSharesDiluted(xbrl, year),
    //         prefOutstandingShares: BS.OutstandingPreferredShares(xbrl, year),

    //         totalRevenue: IS.NetRevenue(xbrl, year),
    //         netIncome: IS.NetIncomeComprehensiveTotal(xbrl, year),

    //         eps: IS.EarningsPerShare(xbrl, year),
    //         dilutedEps: IS.EarningsPerShareDiluted(xbrl, year),
    //         declaredDividend: IS.DividendDeclared(xbrl, year)
    //     }
    //     return new TenK(tenk);
    // }

}


export default Report;

