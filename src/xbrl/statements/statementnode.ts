import {ElementNode} from '../../schema/schemanodes';
import {LabelNode} from '../../schema/linkbasenodes';

import GaapNode from '../instance/gaapnode';
import DeiNode from '../instance/deinode';


export class StatementNode {

    public readonly element: ElementNode;
    public readonly label: LabelNode;

    constructor(element: ElementNode, label: LabelNode) {
        this.element = element;
        this.label = label;
    }

}


export abstract class StatementValueNode<T> {
    public parent: StatementValueNode<T>;
    public children: StatementValueNode<T>[];

    public readonly element: ElementNode;
    public readonly label: LabelNode;
    public readonly values: T[];

    public isTotal = false;

    public statementRoot: boolean;
    
    constructor(node: StatementNode, values: T[]) {
        this.element = node.element;
        this.label = node.label;
        this.values = values;

        this.parent = null;
        this.children = [];

        this.statementRoot = false;
    }
}

export class StatementGaapNode extends StatementValueNode<GaapNode> {

    // public get Balance() { return this.element.balance; }
    // public get ValueType() { return this.element.type; }

    constructor(node: StatementNode, values: GaapNode[]) {
        super(node, values);
    }
}
export class StatementDeiNode extends StatementValueNode<DeiNode> {
    constructor(node: StatementNode, values: DeiNode[]) {
        super(node, values);
    }
}