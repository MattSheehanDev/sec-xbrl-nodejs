import { EntityInfoXBRL as EntityInfo } from './report/entityinformation';

import { BalanceSheetModel, FinancialPositionModel, IncomeStatementModel } from '../models/financialmodels';
import { EntityModel } from '../models/entitymodel';

// import { ConsolidatedBalanceSheets } from './report/balancesheet/consolidated';
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


    // export function CreateBalanceSheet(xbrl: XBRL) {
    //     let consolidated = new ConsolidatedBalanceSheets(xbrl);
    //     let reports = consolidated.Reports();

    //     let date = new Date(EntityInfo.DocumentEndDate(xbrl));

    //     for (let report of reports) {
    //         date.setFullYear(report.year);
            
    //         report.endDate = datetime.format(date, 'MMM. dd, yyyy');
    //     }
        
    //     return reports.reverse();
    // }


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


}


export default Report;

