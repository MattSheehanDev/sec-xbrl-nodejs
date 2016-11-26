import ContextNode from '../instance/contextnode';

export default class GaapNode {

    public readonly value: number;

    public readonly contextRef: string;             // FD{YYYY}Q{N}{YTD}
    public readonly decimals: number;
    public readonly id: string;
    public readonly unitRef: string;                // usd, shares, ...


    private _context: ContextNode;

    public get context() { return this._context; }
    public get segment() { return this._context.segment; }
    public get date() {
        if (this._context.period.type === 'instant')
            return this._context.period.instant;
        else
            return this._context.period.end;
    }


    constructor(node: Element, contextNodes: Map<string, ContextNode>) {
        this.value = parseNumericElementValue(node);

        this.contextRef = node.getAttributeNS(null, 'contextRef');
        this.decimals = parseNumericValue(node.getAttributeNS(null, 'decimals'));
        this.id = node.getAttributeNS(null, 'id');
        this.unitRef = node.getAttributeNS(null, 'unitRef');


        if (this.contextRef && contextNodes.has(this.contextRef)) {
            this._context = contextNodes.get(this.contextRef); 
        }
    }
}



function parseNonNumElementValue(item: Element) {
    if (item) {
        // let value = item.firstChild.data;
        let value = item.firstChild.nodeValue;
        return value;
    }
    return null;
}
function parseNumericElementValue(item: Element) {
    if (item) {
        // let value = parseFloat(item.firstChild.data);
        let value = parseFloat(item.firstChild.nodeValue);
        return !isNaN(value) ? value : null;
    }
    return null;
}


function parseNonNumAttrType(attr: Attr) {
    if (attr) {
        let value = attr.value;
        return value;
    }
    return null;
}
function parseNumericAttrType(attr: Attr) {
    if (attr) {
        let value = parseFloat(attr.value);
        return !isNaN(value) ? value : null;
    }
    return null;
}


function parseNumericValue(value: string) {
    if (value) {
        let num = parseFloat(value);
        return !isNaN(num) ? num : null;
    }
    return null;
}