import {ElementNode} from '../../../schema/schemanodes';
import {LabelNode} from '../../../schema/linkbasenodes';


export interface StatementNodeOptions {
    element: ElementNode;
    label: LabelNode;
}


export class StatementNode {
    
    public parent: StatementNode;
    public children: StatementNode[];

    public readonly element: ElementNode;
    public readonly label: LabelNode;

    public statementRoot: boolean;


    public get Balance() { return this.element.balance; }
    public get ValueType() { return this.element.type; }


    constructor(options: StatementNodeOptions) {
        this.element = options.element;
        this.label = options.label;

        this.parent = null;
        this.children = [];

        this.statementRoot = false;
    }

}




export function CreateNodes(elements: ElementNode[], labels: LabelNode[]) {
    let labelNames = labels.map((node: LabelNode) => { return node.MatchingElement; });

    let nodes: StatementNode[] = [];
    let map = new Map<string, StatementNode>();

    for (let element of elements) {
        // find matching label
        let index = labelNames.indexOf(element.name);
        let label = index !== -1 ? labels[index] : null;

        let stmntNode = new StatementNode({
            element: element,
            label: label
        });
        nodes.push(stmntNode);
        map.set(element.name, stmntNode);
    }

    return nodes;
}

export function PullNodes(nodes: Map<string, StatementNode>, presentations: Presentation[]) {
    let pulled: StatementNode[] = [];
    for (let p of presentations) {
        if (nodes.has(p.Name)) {
            pulled.push(nodes.get(p.Name));
        }
    }
    return pulled;
}

import XBRLDocument from '../../xbrl'; 
import {Presentation} from '../../../schema/linkbasenodes';
import GaapNode from '../../namespaces/gaapnode';
import DeiNode from '../../namespaces/deinode';

export function SelectNodes(nodes: StatementNode[], xbrl: XBRLDocument) {
    let map = new Map<StatementNode, GaapNode[]>();

    for (let node of nodes) {
        let gaaps: GaapNode[] = [];

        let elements = xbrl.GaapParser.Select(node.element.name);
        for (let element of elements) {
            gaaps.push(new GaapNode(element));
        }

        map.set(node, gaaps);
    }
    return map;
}

export function SelectDeiNodes(nodes: StatementNode[], xbrl: XBRLDocument) {
    let map = new Map<StatementNode, DeiNode[]>();

    for (let node of nodes) {
        let deis: DeiNode[] = [];

        let elements = xbrl.GaapParser.Select(node.element.name);
        for (let element of elements) {
            deis.push(new DeiNode(element));
        }

        map.set(node, deis);
    }
    return map;
}


export function MatchStatementPresentation(root: Presentation, nodes: StatementNode[]) {
    let nodeNames = nodes.map((node: StatementNode) => { return node.element.name; });
    return matchStatementPresentationRecurse(root, nodes, nodeNames);
}

function matchStatementPresentationRecurse(root: Presentation, nodes: StatementNode[], nodeNames: string[]) {
    // find matching element
    let index = nodeNames.indexOf(root.Name);
    let node = index !== -1 ? nodes[index] : null;


    for (let child of root.Children) {
        let childStmntNode = matchStatementPresentationRecurse(child, nodes,  nodeNames);

        childStmntNode.parent = node;
        node.children.push(childStmntNode);
    }

    return node;
}