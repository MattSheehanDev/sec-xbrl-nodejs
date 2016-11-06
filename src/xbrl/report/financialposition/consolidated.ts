import XBRLDocument from '../../xbrl';

import { FinancialPositionModel } from '../../../models/financialmodels';
import { FinancialPositionItems } from './items';



export class ConsolidatedFinancialPositions {

    // <year, financial positon>
    private financialPositions: Map<number, FinancialPositionModel>

    public Get(year: number) {
        if (this.financialPositions.has(year)) {
            return this.financialPositions.get(year);
        }
        else {
            let fp: FinancialPositionModel = {
                year: year
            };
            this.financialPositions.set(year, fp);
            return fp;
        }
    }

    public Reports() {
        let reports: FinancialPositionModel[] = [];
        this.financialPositions.forEach((fp: FinancialPositionModel) => {
            reports.push(fp);
        });
        return reports;
    }

    constructor(xbrl: XBRLDocument) {
        this.financialPositions = new Map<number, FinancialPositionModel>();

        FinancialPositionItems.PreferredStockPar(xbrl).forEach((value: number, year: number) => {
            this.Get(year).prefStockPar = value;
        });
        FinancialPositionItems.PreferredStockAuthorized(xbrl).forEach((value: number, year: number) => {
            this.Get(year).prefStockAuth = value;
        });
        FinancialPositionItems.PreferredStockIssued(xbrl).forEach((value: number, year: number) => {
            this.Get(year).prefStockIssued = value;
        });
        FinancialPositionItems.PreferredStockOutstanding(xbrl).forEach((value: number, year: number) => {
            this.Get(year).prefStockOutstanding = value;
        });

        FinancialPositionItems.CommonStockPar(xbrl).forEach((value: number, year: number) => {
            this.Get(year).commonStockPar = value;
        });
        FinancialPositionItems.CommonStockAuthorized(xbrl).forEach((value: number, year: number) => {
            this.Get(year).commonStockAuth = value;
        });
        FinancialPositionItems.CommonStockIssued(xbrl).forEach((value: number, year: number) => {
            this.Get(year).commonStockIssued = value;
        });
        FinancialPositionItems.CommonStockOutstanding(xbrl).forEach((value: number, year: number) => {
            this.Get(year).commonStockOutstanding = value;
        });

        FinancialPositionItems.TreasuryStockShares(xbrl).forEach((value: number, year: number) => {
            this.Get(year).treasuryShares = value;
        });
        FinancialPositionItems.EmployeeTrustShares(xbrl).forEach((value: number, year: number) => {
            this.Get(year).employeeTrustShares = value;
        });
    }

}