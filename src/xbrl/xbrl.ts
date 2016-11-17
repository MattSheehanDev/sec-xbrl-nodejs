import { CreateRootNode } from './namespaces/xmlns';
import { All as allGaapNodes } from './gaap/gaap';
import { All as allDEINodes } from './namespaces/dei';




export class XBRLDocument {

    public readonly document: Document;
    public readonly gaapRoot: Element;
    public readonly deiRoot: Element;

    constructor(doc: Document) {
        this.document = doc;

        // TODO: do this without xpath        

        // Create a root gaap node and clone gaap nodes
        this.gaapRoot = CreateRootNode(this.document);
        let gaapNodes: Element[] = allGaapNodes(doc);
        for (let node of gaapNodes) {
            this.gaapRoot.appendChild(node.cloneNode(true));
        }

        // Create a root dei node and clone dei nodes
        this.deiRoot = CreateRootNode(this.document);
        let deiNodes: Element[] = allDEINodes(doc);
        for (let node of gaapNodes) {
            this.deiRoot.appendChild(node.cloneNode(true));
        }
    }

}

export default XBRLDocument;


