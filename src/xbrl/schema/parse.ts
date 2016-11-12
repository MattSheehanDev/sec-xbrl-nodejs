import DFS from '../../utilities/dfs';
import {ImportNode, ElementNode, LabelNode, Presentation, PresentationArcNode, PresentationLocationNode} from './nodes';


export namespace Schema {

    
    export function ParseGaapElements(document: Document) {
        let elements: ElementNode[] = [];
        let namespaces = new Map<string, string>();

        DFS(document, (node: Node) => {
            if ('schema' === node.localName) {
                // first get the namespaces
                for (let i = 0; i < node.attributes.length; i++) {
                    let attr = node.attributes[i];

                    if (attr.prefix === 'xmlns') {
                        if(!namespaces.has(attr.localName)) {
                            namespaces.set(attr.localName, attr.value);
                        }
                    }
                }                
            }
            else if ('import' === node.localName) {
                let importNode = new ImportNode(<Element>node, namespaces);
            }
            else if ('element' === node.localName) {
                let elementNode = new ElementNode(<Element>node, namespaces);
                elements.push(elementNode);
            }
            else if ('annotation' === node.localName) {

            }
        });
        return elements;
    }

    export function ParseGaapLabels(document: Document) {
        let labels: LabelNode[] = [];

        DFS(document, (node: Node) => {
            if ('label' === node.localName) {
                let label = new LabelNode(<Element>node);
                labels.push(label);
            }
        });
        return labels;
    }

    export function ParseGaapPresentation(document: Document) {
        // let locations: PresentationLocationNode[] = [];
        // let presentations: PresentationArcNode[] = [];
    
        let presentations: Presentation[] = [];
        let presMap = new Map<string, Presentation>();

        // let nodes: PresentationArcNode[] = [];
        let parents = new Map<string, string[]>();

        // TODO: remove other presentation nodes
        // TODO: change (node: Node) => void to (element: Element) => void
        // TODO: maybe 'total' should be handled by the balance sheet node (value?) 
        // TODO: remove ledger.ts file
        // TODO: remove balance sheet gaap names
        // TODO: check what the currency type is
        // TODO: seperate moneyItemTypes from perShareItemTypes
        //       (balancesheet and parenthetical balancesheet)

        // parse the document
        DFS(document, (node: Node) => {
            if ('loc' === node.localName) {
                let loc = new PresentationLocationNode(<Element>node);
                // locations.push(loc);

                let pres = new Presentation(loc.Name);
                presentations.push(pres);
                presMap.set(pres.Name, pres)
            }
            if ('presentationArc' === node.localName) {
                let pres = new PresentationArcNode(<Element>node);

                // nodes.push(pres);

                if (parents.has(pres.ParentName)) {
                    parents.get(pres.ParentName).push(pres.Name);
                }
                else {
                    parents.set(pres.ParentName, [pres.Name]);
                }
            }
        });

        for (let pres of presentations) {
            // check if this node is a parent
            if (!parents.has(pres.Name)) continue;
                
            let children = parents.get(pres.Name);

            for (let childName of children) {
                if (presMap.has(childName)) {
                    let child = presMap.get(childName);
                    
                    child.Parent = pres;
                    pres.Children.push(child);
                }
            }
        }

        let root = presentations[0];
        while (root.Parent !== null) {
            root = root.Parent;
        }
        return root;

        // parents.forEach((children: PresentationArcNode[], parent: string) => {
        //     presentations.push(new Presentation(parent));

        //     for (let child of children) {
        //         presentations.push(new Presentation(child.Name));
        //     }
        // });

        // return presentations;
        // // group the location nodes with the presentation nodes
        // for (let loc of locations) {
        //     if (locationNames.has(loc.Name)) {
        //         let pres = locationNames.get(loc.Name);
        //     }
        // }

        // return [presentations, locations];
    }

    // export function DFSRecursive(name: string, children: PresentationArcNode[]) {
    //     // each(node);
    //     let root = new Presentation(name);

    //     for (let child of children) {
    //         // root.Children.push(DFSRecursive())
    //     }
    //     // if (node.hasChildNodes()) {
    //     //     for (let i = 0; i < node.childNodes.length; i++) {
    //     //         let child = node.childNodes.item(i);

    //     //         if (NodeTypes.ELEMENT_NODE === child.nodeType) {
    //     //             DFSRecursive(child, each);
    //     //         }
    //     //     }
    //     // }
    //     return root;
    // }


}
