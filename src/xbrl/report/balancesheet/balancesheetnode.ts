import { Schema } from '../../schema/parse';
import {ImportNode, ElementNode, LabelNode, PresentationArcNode, PresentationLocationNode} from '../../schema/nodes';


export interface BalanceSheetNodeOptions {
    element: ElementNode;
    label: LabelNode;
    presentation: PresentationArcNode;
}


export class BalanceSheetNode {
    
    public parent: BalanceSheetNode;
    public children: BalanceSheetNode[];

    public readonly element: ElementNode;
    public readonly label: LabelNode;
    public readonly presentation: PresentationArcNode;

    constructor(options: BalanceSheetNodeOptions) {
        this.element = options.element;
        this.label = options.label;
        this.presentation = options.presentation;

        this.parent = null;
        this.children = [];
    }

}





import XBRLDocument from '../../xbrl';
import { DFSBalanceSheet } from '../../../utilities/dfs';
import { GaapNode } from '../../node';
import { Select } from '../../namespaces/gaap';
import { EntityInfoXBRL as EntityInfo } from '../entityinformation';
import { DateTime as datetime } from '../../../utilities/datetime';

export interface IConsBalanceSheetColumn {
    value: number;
}
export class ConsBalanceSheetLine {
    public static years: number[] = [];

    public readonly node: BalanceSheetNode;
    private columns: Map<number, IConsBalanceSheetColumn>;

    constructor(node: BalanceSheetNode) {
        this.node = node;
        this.columns = new Map<number, IConsBalanceSheetColumn>();
    }
    public Get(year: number) {
        if (ConsBalanceSheetLine.years.indexOf(year) === -1) {
            ConsBalanceSheetLine.years.push(year);
        }

        if (this.columns.has(year)) {
            return this.columns.get(year);
        }
        else {
            let column: IConsBalanceSheetColumn = { value: null };
            this.columns.set(year, column); 
            return column;
        }
    }
}

export function ConsolidateBalanceSheet(xbrl: XBRLDocument, root: BalanceSheetNode) {
    let lines: ConsBalanceSheetLine[] = [];

    DFSBalanceSheet(root, (node: BalanceSheetNode) => {

        let line = new ConsBalanceSheetLine(node);
        lines.push(line);

        let gaapNodes = Select(node.element.name, xbrl.gaapRoot);
        for (let gaap of gaapNodes) {
            let column = line.Get(gaap.year);

            if (!column.value) {
                column.value = gaap.value;
            }
            else {
                column.value += gaap.value;
            }
        }
    });


    // first line should be the title of the statement type
    let title = lines.shift().node.label.text;

    let date = new Date(EntityInfo.DocumentEndDate(xbrl));
    let sortedYears = ConsBalanceSheetLine.years.sort((a: number, b: number) => { return b - a; });
    let dates = sortedYears.map((value: number) => {
        date.setFullYear(value);
        return datetime.format(date, 'MMM. dd, yyyy');
    });
    let bsLines: { label: string; abstract: boolean; values: string[] }[] = [];

    for (let line of lines) {
        let label = line.node.label.text;
        let abstract = line.node.element.name.toLowerCase().lastIndexOf('abstract') !== -1;
        let values: string[] = [];
        let empty = true;
        for (let year of sortedYears) {
            let column = line.Get(year);
            if (column.value) {
                values.push(column.value.toString());
                empty = false;
            }
            else {
                values.push('');
            }
            // let value = column.value ? column.value.toString() : '';
            // values.push(value);
        }
        if (!empty || abstract) {
            bsLines.push({ label: label, abstract: abstract, values: values });
        }
    }

    return <StatementHTML>{ title: title, dates: dates, lines: bsLines };
}

export interface StatementHTML {
    title: string;
    dates: string[];
    lines: { label: string; abstract: boolean; values: string[] }[];
}
export function CreateStatementData(root: BalanceSheetLine[]) {
    // first node should be the title of the statement type
    let title = root.pop();
    
    
}

export function Clone(root: BalanceSheetNode) {
    let node = new BalanceSheetLine(root);
    for (let child of root.children) {
        let childNode = Clone(child);
        childNode.parent = node;

        childNode.children.push(node); 
    }
    return node;
}

// export function Fetch(xbrl: XBRLDocument, taxon: string) {
//     return SumNodesByYear(Select(taxon, xbrl.gaapRoot));
// }

export function SumNodesByYear(nodes: GaapNode[]) {
    // <year, value>
    let map = new Map<number, number>();
    for (let node of nodes) {
        if (node.axis) continue;

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


export class BalanceSheetLine {

    public node: BalanceSheetNode;
    public value: Map<number, number>;

    public parent: BalanceSheetLine;
    public children: BalanceSheetLine[];

    constructor(node: BalanceSheetNode) {
        this.node = node;
        this.value = new Map<number, number>();

        this.parent = null;
        this.children = [];
    }

}
