import {ElementNode, LabelNode} from '../../schema/nodes';


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
