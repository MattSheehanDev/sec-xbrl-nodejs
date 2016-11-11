import DFS from '../../utilities/dfs';
import {ImportNode, ElementNode, LabelNode, PresentationArcNode, PresentationLocationNode} from './nodes';


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
        let locations: PresentationLocationNode[] = [];
        let presentations: PresentationArcNode[] = [];

        DFS(document, (node: Node) => {
            if ('loc' === node.localName) {
                let loc = new PresentationLocationNode(<Element>node);
                locations.push(loc);
            }
            else if ('presentationArc' === node.localName) {
                let pres = new PresentationArcNode(<Element>node);
                presentations.push(pres);
            }
        });

        return [presentations, locations];
    }


}
