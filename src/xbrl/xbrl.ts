import xpath = require('xpath');

import { XBRL_NS, SelectNS, CreateRootNode } from './namespaces/xmlns';
import context from './namespaces/instance';
import gaap from './namespaces/gaap';
import { All as allDEINodes } from './namespaces/dei';




class XBRL {

    public readonly document: Document;
    public readonly gaapRoot: Element;
    public readonly deiRoot: Element;
    public readonly years: number[];

    constructor(doc: Document) {
        this.document = doc;

        // Create a root gaap node and clone gaap nodes
        this.gaapRoot = CreateRootNode(this.document);
        let gaapNodes: Element[] = gaap.All(doc);
        for (let node of gaapNodes) {
            this.gaapRoot.appendChild(node.cloneNode(true));
        }

        // Create a root dei node and clone dei nodes
        this.deiRoot = CreateRootNode(this.document);
        let deiNodes: Element[] = allDEINodes(doc);
        for (let node of gaapNodes) {
            this.deiRoot.appendChild(node.cloneNode(true));
        }


        this.years = context.GetYears(this.document);
    }

}

export default XBRL;