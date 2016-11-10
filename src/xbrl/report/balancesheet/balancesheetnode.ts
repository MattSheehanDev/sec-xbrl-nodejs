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
import { DFSBalanceSheetValue } from '../../../utilities/dfs';
import { GaapNode } from '../../node';
import { Select } from '../../namespaces/gaap';

export function ConsolidateBalanceSheet(xbrl: XBRLDocument, root: BalanceSheetNode) {
    let values = Clone(root);
    DFSBalanceSheetValue(values, (line: BalanceSheetLine) => {
        // TODO: don't make a thousand maps...
        let gaapNodes = Select(line.node.element.name, xbrl.gaapRoot);
        for (let gaap of gaapNodes) {
            if (line.value.has(gaap.year)) {
                let v = line.value.get(gaap.year);
                line.value.set(gaap.year, gaap.value + v);
            }
            else {
                line.value.set(gaap.year, gaap.value);
            }
        }
    });
    return values;
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

// export function SumNodesByYear(nodes: GaapNode[]) {
//     let values: { year: number, value: number }[] = [];

//     // <year, value>
//     // let map = new Map<number, number>();
//     for (let node of nodes) {
//         if (node.axis) continue;

//         values.push({
//             year: node.year,
//             value: node.value
//         });
//         // // if this year has already been seen before
//         // if (map.has(node.year)) {
//         //     let value = map.get(node.year);
//         //     map.set(node.year, value + node.value);
//         // }
//         // // otherwise we have to create the node year array
//         // else {
//         //     map.set(node.year, node.value);
//         // }
//     }
//     // return map;
//     return values;
// }


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
