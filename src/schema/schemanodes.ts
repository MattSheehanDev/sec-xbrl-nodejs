

export class SchemaDocument {

    private _targetNS: string;
    private _elements: ElementNode[];
    private _imports: ImportNode[];

    public get TargetNS() { return this._targetNS; }
    public get Imports() { return this._imports; }
    public get Elements() { return this._elements; }

    constructor(targetNS: string, elements: ElementNode[], imports: ImportNode[]) {
        this._targetNS = targetNS;
        this._elements = elements;
        this._imports = imports;
    }

}




export class ImportNode {

    public readonly namespace: string;
    public readonly schemaLocation: string;

    constructor(element: Element, ns: Map<string, string>) {
        this.namespace = element.getAttributeNS(null, 'namespace');
        this.schemaLocation = element.getAttributeNS(null, 'schemaLocation');
    }
}




// Elements can be 'Abstract', 'Member', or a value
export class ElementNode {

    public readonly abstract: boolean;
    public readonly id: string;
    public readonly name: string;
    public readonly nillable: boolean;
    public readonly substitutionGroup: string;
    public readonly type: string;

    public readonly periodType: string;
    public readonly balance: string;

    constructor(element: Element, ns: Map<string, string>) {
        let abstract = element.getAttributeNS(null, 'abstract');
        this.abstract = abstract === 'true';

        this.id = element.getAttributeNS(null, 'id');       // us-gaap_nodeID
        this.name = element.getAttributeNS(null, 'name');   // nodeID

        let nillable = element.getAttributeNS(null, 'nillable');
        this.nillable = nillable === 'true';

        this.substitutionGroup = element.getAttributeNS(null, 'substitutionGroup');     // xbrl:item,...

        // xbrli:monetaryItemType, num:perShareItemType, nonnum:domainitemType, ...
        this.type = element.getAttributeNS(null, 'type');


        // instant, duration (you cannot add 'instant' values to 'duration' values)
        this.periodType = element.getAttributeNS(ns.get('xbrli'), 'periodType');
        this.balance = element.getAttributeNS(ns.get('xbrli'), 'balance') || null;
    }

}
