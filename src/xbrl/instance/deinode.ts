import ContextNode from '../instance/contextnode';


export default class DeiNode {

    public readonly value: string;

    public readonly contextRef: string;
    public readonly id: string;


    private _context: ContextNode;

    public get context() { return this._context; }
    public get segment() { return this._context.segment; }
    public get date() {
        if (this._context.period.type === 'instant')
            return this._context.period.instant;
        else
            return this._context.period.end;
    }


    constructor(element: Element, contextNodes: Map<string, ContextNode>) {
        this.value = element.firstChild.nodeValue;

        this.contextRef = element.getAttributeNS(null, 'contextRef');
        this.id = element.getAttributeNS(null, 'id');


        if (this.contextRef && contextNodes.has(this.contextRef)) {
            this._context = contextNodes.get(this.contextRef);        
        }
    }

}
