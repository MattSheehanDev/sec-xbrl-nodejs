import {ElementNode, LabelNode} from '../../schema/nodes';


export interface BalanceSheetNodeOptions {
    element: ElementNode;
    label: LabelNode;
}


export class BalanceSheetNode {
    
    public parent: BalanceSheetNode;
    public children: BalanceSheetNode[];

    public readonly element: ElementNode;
    public readonly label: LabelNode;

    public statementRoot: boolean;


    public get Balance() { return this.element.balance; }
    public get ValueType() { return this.element.type; }


    constructor(options: BalanceSheetNodeOptions) {
        this.element = options.element;
        this.label = options.label;

        this.parent = null;
        this.children = [];

        this.statementRoot = false;
    }

}
