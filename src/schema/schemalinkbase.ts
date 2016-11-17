import DFS from '../utilities/dfs';
import {LabelNode, PresentationLink, Presentation, PresentationArcNode} from './linkbasenodes';


export namespace Linkbase {


    export function ParseLabels(document: Document) {
        let labels: LabelNode[] = [];

        DFS(document, (element: Element) => {
            if ('label' === element.localName) {
                let label = new LabelNode(element);
                labels.push(label);
            }
        });
        return labels;
    }


    export function ParsePresentation(document: Document) {
        // let presentations: Presentation[] = [];
        // let presMap = new Map<string, Presentation>();

        // let parents = new Map<string, string[]>();

        // TODO: remove other presentation nodes
        // TODO: maybe 'total' should be handled by the balance sheet node (value?)
        // TODO: remove balance sheet gaap names
        // TODO: check what the currency type is
        // TODO: seperate moneyItemTypes from perShareItemTypes
        //       (balancesheet and parenthetical balancesheet)
        const xlinkNS = 'http://www.w3.org/1999/xlink';

        let presentations: PresentationLink[] = [];
        let currentPresentationLink: PresentationLink;

        // parse the document
        DFS(document, (element: Element) => {
            if ('presentationLink' === element.localName) {
                currentPresentationLink = new PresentationLink();
                presentations.push(currentPresentationLink);
            }
            else if ('loc' === element.localName) {
                // parse the location element
                let href = element.getAttributeNS(xlinkNS, 'href');
                let label = element.getAttributeNS(xlinkNS, 'label');
                let name = label.substr('loc_'.length);

                currentPresentationLink.addPresentationNode(new Presentation(name));
                // presentations.push(pres);
                // presMap.set(pres.Name, pres)
            }
            else if ('presentationArc' === element.localName) {
                currentPresentationLink.addArcNode(new PresentationArcNode(element));

                // if (parents.has(pres.ParentName)) {
                //     parents.get(pres.ParentName).push(pres.Name);
                // }
                // else {
                //     parents.set(pres.ParentName, [pres.Name]);
                // }
            }
        });

        // Match the parents with their children
        for (let presentation of presentations) {
            presentation.sort();
        }
        // for (let pres of presentations) {
        //     // check if this node is a parent
        //     if (!parents.has(pres.Name)) continue;
                
        //     let children = parents.get(pres.Name);

        //     for (let childName of children) {
        //         if (presMap.has(childName)) {
        //             let child = presMap.get(childName);
                    
        //             child.Parent = pres;
        //             pres.Children.push(child);
        //         }
        //     }
        // }

        // Find the root node
        return presentations;
        // let root = presentations[0];
        // while (root.Parent !== null) {
        //     root = root.Parent;
        // }
        // return root;
    }


}
