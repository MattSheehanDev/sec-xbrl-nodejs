
const xlinkNS = 'http://www.w3.org/1999/xlink';



export class LabelNode {

    private _label: string;          // lab_elementname
    private _role: string;
    private _type: string;
    private _lang: string;
    public readonly Text: string;

    public readonly MatchingElement: string;

    constructor(element: Element) {
        this._label = element.getAttributeNS(xlinkNS, 'label');
        this._role = element.getAttributeNS(xlinkNS, 'role');
        this._type = element.getAttributeNS(xlinkNS, 'type');
        this._lang = element.getAttributeNS(null, 'lang');              // ?? what is this namespace

        this.Text = element.firstChild.nodeValue;

        this.MatchingElement = this._label.substring('lab_'.length);
    }

}





const preferredLabel = 'http://www.xbrl.org/2003/role/totalLabel';
const arcrole = 'http://www.xbrl.org/2003/arcrole/parent-child';


export class PresentationLink {
    private _presentations: Presentation[];
    private _nameMap: Map<string, Presentation>;

    private _arcs: PresentationArcNode[];
    private _parents = new Map<string, string[]>();

    constructor() {
        this._presentations = [];
        this._nameMap = new Map<string, Presentation>();

        this._arcs = [];
    }

    public addPresentationNode(node: Presentation) {
        this._presentations.push(node);
        this._nameMap.set(node.Name, node);
    }

    public addArcNode(node: PresentationArcNode) {
        if (this._parents.has(node.ParentName)) {
            this._parents.get(node.ParentName).push(node.Name);
        }
        else {
            this._parents.set(node.ParentName, [node.Name]);
        }
    }

    public sort() {
        for (let pres of this._presentations) {
            // check if this node is a parent
            if (!this._parents.has(pres.Name)) continue;
                
            // get all the names of the children nodes for this node
            let children = this._parents.get(pres.Name);

            for (let childName of children) {
                if (!this._nameMap.has(childName)) continue;

                // get the presentation node of this child
                let child = this._nameMap.get(childName);
                
                child.Parent = pres;
                pres.Children.push(child);
            }
        }
    }

    public root() {
        let root = this._presentations[0];
        while (root.Parent !== null) {
            root = root.Parent;
        }
        return root;
    }
}


export class Presentation {

    public readonly Name: string;

    public Parent: Presentation;
    public Children: Presentation[];

    constructor(name: string) {
        this.Name = name;

        this.Parent = null;
        this.Children = [];
    }
}

// export class PresentationLocationNode {

//     public readonly href: string;
//     public readonly label: string;

//     public readonly Name: string;


//     constructor(element: Element) {
//         this.href = element.getAttributeNS(xlinkNS, 'href');
//         this.label = element.getAttributeNS(xlinkNS, 'label');

//         this.Name = this.label.substr('loc_'.length);
//     }
// }

export class PresentationArcNode {

    public preferredLabel: string;              // totalLabel?
    public role: string;                        // parent-child
    public from: string;
    public to: string;

    public readonly ParentName: string;
    public readonly Name: string;

    public readonly isTotal: boolean;

    constructor(element: Element) {
        this.from = element.getAttributeNS(xlinkNS, 'from');
        this.to = element.getAttributeNS(xlinkNS, 'to');

        this.role = element.getAttributeNS(xlinkNS, 'arcrole');
        this.preferredLabel = element.getAttributeNS(null, 'preferredLabel');

        this.ParentName = this.from.substr('loc_'.length);
        this.Name = this.to.substr('loc_'.length);


        // check if this is a 'total' sum node
        this.isTotal = false;

        if (this.preferredLabel && this.preferredLabel.match(/totalLabel/ig)) {
            this.isTotal = true;
        }
    }

}