import DFS from '../utilities/dfs';
import { SchemaDocument, ImportNode, ElementNode } from './schemanodes';
import {LabelNode, PresentationLink, Presentation, PresentationArcNode} from './linkbasenodes';
import Helpers from '../xbrl/helpers';

namespace SchemaParser {


    // schema documents end in .xsd
    export function ParseDocument(document: Document) {
        let targetNS: string;
        let namespaces = new Map<string, string>();

        let elements: ElementNode[] = [];
        let imports: ImportNode[] = [];

        DFS(document, (element: Element) => {
            if ('schema' === element.localName) {
                targetNS = element.getAttributeNS(null, 'targetNamespace');
                namespaces = Helpers.GetAttributes(element);
            }
            else if ('element' === element.localName) {
                let elementNode = new ElementNode(element, namespaces);
                elements.push(elementNode);
            }
            else if ('import' === element.localName) {
                let importNode = new ImportNode(element, namespaces);
                imports.push(importNode);
            }
            else if ('annotation' === element.localName) {

            }
        });

        return new SchemaDocument(targetNS, elements, imports);
    }




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
        // TODO: remove other presentation nodes
        // TODO: maybe 'total' should be handled by the balance sheet node (value?)
        // TODO: check what the currency type is
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

        // Find the root node
        return presentations;
    }


}


export default SchemaParser;

