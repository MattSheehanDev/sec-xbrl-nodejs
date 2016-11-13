import { Taxonomy as taxon, Select } from '../../gaap/gaap';
import { GaapNode } from '../../gaap/gaapnode';
import XBRLDocument from '../../xbrl';


function SumNodesByYear(nodes: GaapNode[]) {
    // <year, value>
    let map = new Map<number, number>();
    for (let node of nodes) {
        if (node.member) continue;

        // if this year has already been seen before
        if (map.has(node.year)) {
            let value = map.get(node.year);
            map.set(node.year, value + node.value);
        }
        // otherwise we have to create the node year array
        else {
            map.set(node.year, node.value);
        }
    }
    return map;
}


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