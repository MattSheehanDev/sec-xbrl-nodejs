import { Taxonomy as taxon, Select } from '../../namespaces/gaap';
import XBRLDocument from '../../xbrl';
import { GaapNode, SumNodesByYear } from '../../node';


export module FinancialPositionItems {


    export function PreferredStockPar(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredStockPar, xbrl.gaapRoot));
    }
    export function PreferredStockAuthorized(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredStockAuthorized, xbrl.gaapRoot));
    }
    export function PreferredStockIssued(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredStockIssued, xbrl.gaapRoot));
    }
    export function PreferredStockOutstanding(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.PreferredStockOutstanding, xbrl.gaapRoot));
    }


    export function CommonStockPar(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CommonStockPar, xbrl.gaapRoot));
    }
    export function CommonStockAuthorized(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CommonStockAuthorized, xbrl.gaapRoot));
    }
    export function CommonStockIssued(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CommonStockIssued, xbrl.gaapRoot));
    }
    export function CommonStockOutstanding(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.CommonStockOutstanding, xbrl.gaapRoot));
    }


    export function TreasuryStockShares(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.TreasuryStockShares, xbrl.gaapRoot));
    }
    export function EmployeeTrustShares(xbrl: XBRLDocument) {
        return SumNodesByYear(Select(taxon.EmployeeTrustShares, xbrl.gaapRoot));
    }

}