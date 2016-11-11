

const xlinkNS = 'http://www.w3.org/1999/xlink';


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
        this.type = element.getAttributeNS(null, 'type');   // nonnum:domainitemType,...


        // instant, duration (you cannot add 'instant' values to 'duration' values)
        this.periodType = element.getAttributeNS(ns.get('xbrli'), 'periodType');
        this.balance = element.getAttributeNS(ns.get('xbrli'), 'balance');
    }

}



export class LabelNode {

    private _label: string;          // lab_elementname
    private _role: string;
    private _type: string;
    private _lang: string;    
    private _text: string;

    public readonly MatchingElement: string;
    public readonly FormattedText: string;

    constructor(element: Element) {
        this._label = element.getAttributeNS(xlinkNS, 'label');
        this._role = element.getAttributeNS(xlinkNS, 'role');
        this._type = element.getAttributeNS(xlinkNS, 'type');
        this._lang = element.getAttributeNS(null, 'lang');              // ?? what is this namespace

        this._text = element.firstChild.nodeValue;


        this.MatchingElement = this._label.substring('lab_'.length);

        let match = this._text.match(/([^/[]*)\[.*\]$/);
        if (match) {
            this.FormattedText = match[1].trim();
        }
        else {
            this.FormattedText = this._text;
        }
    }

}




// export class PresentationGroupNode {
//     public loc: PresentationLocationNode;
//     public arc: PresentationArcNode;

//     constructor(loc: PresentationLocationNode, arc: PresentationArcNode) {
//         this.loc = loc;
//         this.arc = arc;
//     }
// }


const preferredLabel = 'http://www.xbrl.org/2003/role/totalLabel';
const arcrole = 'http://www.xbrl.org/2003/arcrole/parent-child';


export class PresentationLocationNode {

    public readonly href: string;
    public readonly label: string;

    public readonly name: string;

    public readonly isTable: boolean;

    constructor(element: Element) {
        this.href = element.getAttributeNS(xlinkNS, 'href');
        this.label = element.getAttributeNS(xlinkNS, 'label');

        this.name = this.label.substr('loc_'.length);


        // check if this is the root table node
        this.isTable = false;

        if (this.name === 'StatementLineItems') {
            this.isTable = true;
        }
    }
}

export class PresentationArcNode {

    private _preferredLabel: string;              // totalLabel?
    private _role: string;                        // parent-child
    private _from: string;
    private _to: string;

    public readonly ParentName: string;
    public readonly Name: string;

    public readonly isTotal: boolean;
    public readonly isTable: boolean;

    constructor(element: Element) {
        this._from = element.getAttributeNS(xlinkNS, 'from');
        this._to = element.getAttributeNS(xlinkNS, 'to');

        this._role = element.getAttributeNS(xlinkNS, 'arcrole');
        this._preferredLabel = element.getAttributeNS(null, 'preferredLabel');

        this.ParentName = this._from.substr('loc_'.length);
        this.Name = this._to.substr('loc_'.length);


        // check if this is a 'total' sum node
        this.isTotal = false;

        if (this._preferredLabel && this._preferredLabel.match(/totalLabel/ig)) {
            this.isTotal = true;
        }
    }

}