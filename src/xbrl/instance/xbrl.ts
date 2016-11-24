
import XPathParser from '../parser';
import NodeTypes from '../../utilities/nodetypes';
import ContextNode from './contextnode';
import { DFS } from '../../utilities/dfs';


// TODO: download all schemas
export default class XBRLDocument {

    public readonly document: Document;
    public readonly ContextNodes: Map<string, ContextNode>;

    public readonly DeiParser: XPathParser;
    public readonly GaapParser: XPathParser;
    

    constructor(doc: Document) {
        this.document = doc;

        // Find the root element
        let root: Element;
        for (let i = 0; i < doc.childNodes.length; i++) {
            let child = doc.childNodes[i];
            if (NodeTypes.ELEMENT_NODE === child.nodeType) {
                root = <Element>child;
                break;
            }
        }
        
        // Get the namespaces
        // TODO: this is repetitive, similar functionality in schemaparser.ts
        let ns = new Map<string, string>();
        for (let i = 0; i < root.attributes.length; i++) {
            let attr = root.attributes[i];

            if ('xmlns' === attr.prefix && !ns.has(attr.localName)) {
                ns.set(attr.localName, attr.value);
            }
        }


        // we are concerned with finding the 'us-gaap' and 'dei' namespaces (to determine what schema to use)
        let xbrliNS = ns.get('xbrli');
        let deiNS = ns.get('dei');
        let gaapNS = ns.get('us-gaap');

        let contextElements: Element[] = [];
        let deiRoot = createRootNode(doc, ns);
        let gaapRoot = createRootNode(doc, ns);
        DFS(doc, (node: Element) => {
            if (node.namespaceURI === deiNS) {
                deiRoot.appendChild(node.cloneNode(true));
            }
            else if (node.namespaceURI === gaapNS) {
                gaapRoot.appendChild(node.cloneNode(true));
            }
            else if (node.namespaceURI === xbrliNS && node.localName === 'context') {
                contextElements.push(<Element>node.cloneNode(true));
            }
        });


        this.DeiParser = new XPathParser(deiRoot, deiNS, 'dei');
        this.GaapParser = new XPathParser(gaapRoot, gaapNS, 'us-gaap');


        this.ContextNodes = new Map<string, ContextNode>();
        for (let element of contextElements) {
            let context = new ContextNode(element, xbrliNS);
            this.ContextNodes.set(context.id, context);
        }
    }

}



function createRootNode(document: Document, ns: Map<string, string>) {
    let root = document.createElementNS('http://www.xbrl.org/2003/instance', 'xbrli:xbrl');
    ns.forEach((value: string, key: string) => {
        root.setAttribute(`xmlns:${key}`, value);
    });
    return root;
}

