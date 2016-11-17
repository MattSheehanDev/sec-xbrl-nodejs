import XBRLDocument from '../../xbrl';
import { DFSBalanceSheet } from '../../../utilities/dfs';
import { StatementNode } from './balancesheetnode';

import GaapNode from '../../namespaces/gaapnode';
import DeiNode from '../../namespaces/deinode';

const moneyType = 'xbrli:monetaryItemType';
const stringType = 'xbrli:stringItemType';
const sharesType = 'xbrli:sharesItemType';
const perShareType = 'num:perShareItemType';


export function ConsolidateDocumentTable(xbrl: XBRLDocument, root: StatementNode) {
    let table = new StatementTable();

    DFSBalanceSheet(root, (node: StatementNode) => {
        let line = table.AddRow(node);

        // TODO: change to DEISelect
        let elements = xbrl.DeiParser.Select(node.element.name);
        for (let element of elements) {
            let dei = new DeiNode(element);

            // some nodes have a year such as FD2016Q4_us-gaap_SomeMember, which we don't want to include in the totals right now
            if (!dei.year || dei.member) continue;

            // can't have two nodes with the same year
            // TODO: we COULD have two nodes with the same year but different quarters...
            if (line.Has(dei.year)) continue; 

            line.Set(dei.year, dei);
        }
    });
    return table;
}

export function ConsolidateStatementTable(xbrl: XBRLDocument, root: StatementNode) {
    let table = new StatementTable();

    DFSBalanceSheet(root, (node: StatementNode) => {
        let line = table.AddRow(node);

        console.log(node.element.name);

        let elements = xbrl.GaapParser.Select(node.element.name);
        for (let element of elements) {
            let gaap = new GaapNode(element);

            // some nodes have a year such as FD2016Q4_us-gaap_SomeMember, which we don't want to include in the totals right now
            if (!gaap.year || gaap.member) continue;

            // can't have two nodes with the same year
            // TODO: we COULD have two nodes with the same year but different quarters...
            if (line.Has(gaap.year)) continue; 

            line.Set(gaap.year, gaap);
        }
    });
    return table;
}


// TODO: seperate statement nodes before invoking ConsolidateStatementTable
//       and then remove this function
export function ConsolidateBalanceSheetTable(xbrl: XBRLDocument, table: StatementNode) {
    let balanceSheetTable = new StatementTable();
    let parentheticalTable = new StatementTable();

    DFSBalanceSheet(table, (node: StatementNode) => {
        if (moneyType === node.element.type || stringType === node.element.type) {
            let line = balanceSheetTable.AddRow(node);

            let elements = xbrl.GaapParser.Select(node.element.name);
            for (let element of elements) {
                let gaap = new GaapNode(element);

                // some nodes have a year such as FD2016Q4_us-gaap_SomeMember, which we don't want to include in the totals right now
                if (!gaap.year || gaap.member) continue;

                // can't have two nodes with the same year
                // TODO: we COULD have two nodes with the same year but different quarters...
                if (line.Has(gaap.year)) continue; 

                line.Set(gaap.year, gaap);
            }
        }
        else {
            let line = parentheticalTable.AddRow(node);

            let elements = xbrl.GaapParser.Select(node.element.name);
            for (let element of elements) {
                let gaap = new GaapNode(element);

                // some nodes have a year such as FD2016Q4_us-gaap_SomeMember, which we don't want to include in the totals right now
                if (!gaap.year || gaap.member) continue;

                // can't have two nodes with the same year
                // TODO: we COULD have two nodes with the same year but different quarters...
                if (line.Has(gaap.year)) continue; 

                line.Set(gaap.year, gaap);
            }
        }
    });

    return { money: balanceSheetTable, shares: parentheticalTable };
}

// export function ConsolidateIncomeStatementTable(xbrl: XBRLDocument, table: StatementNode) {
//     let incomeTable = new StatementTable();

//     DFSBalanceSheet(table, (node: StatementNode) => {
//         let line = incomeTable.AddRow(node);

//         let gaapNodes = Select(node.element.name, xbrl.gaapRoot);
//         for (let gaap of gaapNodes) {
//             // some nodes have a year such as FD2016Q4_us-gaap_SomeMember, which we don't want to include in the totals right now
//             if (!gaap.year || gaap.member) continue;

//             // can't have two nodes with the same year
//             // TODO: we COULD have two nodes with the same year but different quarters...
//             if (line.Has(gaap.year)) continue; 

//             line.Set(gaap.year, gaap);
//         }
//     });

//     return incomeTable;
// }



export class StatementTable {

    public years: number[];
    public lines: StatementRow[];

    constructor() {
        this.years = [];
        this.lines = [];
    }

    public AddRow(node: StatementNode) {
        let line = new StatementRow(node, this.years);
        this.lines.push(line);
        return line;
    }

}

export class StatementRow {

    public node: StatementNode;

    private years: number[];
    private columns: Map<number, any>;


    constructor(node: StatementNode, years: number[]) {
        this.node = node;

        this.years = years;
        this.columns = new Map<number, any>();
    }
    
    public Has(year: number) {
        return this.columns.has(year);
    }
    public Get(year: number) {
        return this.columns.get(year);
    }
    public Set(year: number, node: any) {
        if (this.years.indexOf(year) === -1) {
            if (year === -1) {
                console.log(node.id);
            }
            this.years.push(year);
        }

        this.columns.set(year, node);
    }
}
