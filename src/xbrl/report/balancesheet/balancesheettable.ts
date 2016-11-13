import XBRLDocument from '../../xbrl';
import { DFSBalanceSheet } from '../../../utilities/dfs';
import { BalanceSheetNode } from './balancesheetnode';
import { GaapNode } from '../../gaap/gaapnode';
import { Select } from '../../gaap/gaap';


// TODO: seperate perShareItemTypes from monetaryItemTypes
export function ConsolidateBalanceSheetTable(xbrl: XBRLDocument, table: BalanceSheetNode) {
    let lines: BalanceSheetLine[] = [];

    DFSBalanceSheet(table, (node: BalanceSheetNode) => {
        let line = new BalanceSheetLine(node);
        lines.push(line);

        let gaapNodes = Select(node.element.name, xbrl.gaapRoot);
        for (let gaap of gaapNodes) {
            // some nodes have a year such as FD2016Q4_us-gaap_SomeMember, which we don't want to include in the totals right now
            if (!gaap.year || gaap.member) continue;

            // can't have two nodes with the same year
            // TODO: we COULD have two nodes with the same year but different quarters...
            if (line.Has(gaap.year)) continue; 

            line.Set(gaap.year, gaap);

            // let value = line.Get(gaap.year);
            // line.Set(gaap.year, value + gaap.value);

            // if (!column.value) {
            //     column.value = gaap.value;
            // }
            // else {
            //     column.value += gaap.value;
            // }
        }
    });

    return lines;
}


export class BalanceSheetLine {
    public static years: number[] = [];

    public readonly node: BalanceSheetNode;

    private columns: Map<number, GaapNode>;


    constructor(node: BalanceSheetNode) {
        this.node = node;
        this.columns = new Map<number, GaapNode>();
    }
    
    public Has(year: number) {
        return this.columns.has(year);
    }
    public Get(year: number) {
        // if (BalanceSheetLine.years.indexOf(year) === -1) {
        //     BalanceSheetLine.years.push(year);
        // }
        return this.columns.get(year);
        // if (this.columns.has(year)) {
        //     return this.columns.get(year);
        // }
        // else {
        //     this.columns.set(year, 0); 
        //     return 0;
        // }
    }
    public Set(year: number, node: GaapNode) {
        if (BalanceSheetLine.years.indexOf(year) === -1) {
            BalanceSheetLine.years.push(year);
        }

        this.columns.set(year, node);
    }
}

// export class BalanceSheetValue {

//     public value: number;
//     public units: string;
//     public decimals: number;

//     constructor(node: GaapNode) {
//         this.value = node.value;
//         this.units = 
//     }

// }