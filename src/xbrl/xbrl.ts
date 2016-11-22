
import XPathParser from './parser';
import NodeTypes from '../utilities/nodetypes';
import { DFS } from '../utilities/dfs';


// TODO: parse namespaces
// TODO: parse 'contexts' for a more accurate representation of the dates in an instance
// TODO: download all schemas
// TODO: download more test cases
export default class XBRLDocument {

    public readonly document: Document;

    public readonly DeiParser: XPathParser;
    public readonly GaapParser: XPathParser;


    constructor(doc: Document) {
        this.document = doc;

        let root: Element;
        for (let i = 0; i < doc.childNodes.length; i++) {
            let child = doc.childNodes[i];
            if (NodeTypes.ELEMENT_NODE === child.nodeType) {
                root = <Element>child;
                break;
            }
        }
        // we are concerned with finding the 'us-gaap' and 'dei' namespaces (to determine what schema to use)
        let deiNS = root.getAttribute('xmlns:dei');
        let gaapNS = root.getAttribute('xmlns:us-gaap');


        let deiRoot = createRootNode(doc);
        let gaapRoot = createRootNode(doc);
        DFS(doc, (node: Element) => {
            if (node.namespaceURI === deiNS) {
                deiRoot.appendChild(node.cloneNode(true));
            }
            else if (node.namespaceURI === gaapNS) {
                gaapRoot.appendChild(node.cloneNode(true));
            }
        });


        this.DeiParser = new XPathParser(deiRoot, deiNS, 'dei');
        this.GaapParser = new XPathParser(gaapRoot, gaapNS, 'us-gaap');


        // TODO: do this without xpath

        // // Create a root dei node and clone dei nodes
        // this.deiRoot = CreateRootNode(this.document);

        // let deiNodes: Element[] = this.DeiParser.All(doc);
        // for (let node of deiNodes) {
        //     this.deiRoot.appendChild(node.cloneNode(true));
        // }


        // // Create a root gaap node and clone gaap nodes
        // this.gaapRoot = CreateRootNode(this.document);

        // let gaapNodes: Element[] = this.GaapParser.All(doc);
        // for (let node of gaapNodes) {
        //     this.gaapRoot.appendChild(node.cloneNode(true));
        // }


        // if (root) {
        //     for (let i = 0; i < root.attributes.length; i++) {
        //         let attr = root.attributes[i];

        //         if ('xmlns' === attr.prefix) {
        //             if (!ns.has(attr.localName)) {
        //                 ns.set(attr.localName, attr.value);
        //             }
        //         }
        //     }
        // }

        // let gaap = ns.get('us-gaap');
        // let dei = ns.get('dei');

        // let gNodes: Element[] = [];
        // let dNodes: Element[] = [];

        // DFS(doc, (node: Element) => {
            
        // });
    }

}


function createRootNode(document: Document) {
    let root = document.createElementNS('http://www.xbrl.org/2003/instance', 'xbrli:xbrl');
    for (let ns in XBRL_NS) {
        root.setAttribute(ns, XBRL_NS[ns]);
    }
    return root;
}

const XBRL_NS: any = {
    'xmlns:country': 'http://xbrl.sec.gov/country/2013-01-31',
    'xmlns:currency': 'http://xbrl.sec.gov/currency/2012-01-31',
    'xmlns:dei': 'http://xbrl.sec.gov/dei/2013-01-31',
    'xmlns:exch': 'http://xbrl.sec.gov/exch/2013-01-31',
    'xmlns:invest': 'http://xbrl.sec.gov/invest/2013-01-31',
    'xmlns:iso4217': 'http://www.xbrl.org/2003/iso4217',
    'xmlns:link': 'http://www.xbrl.org/2003/linkbase',
    'xmlns:naics': 'http://xbrl.sec.gov/naics/2011-01-31',
    'xmlns:nonnum': 'http://www.xbrl.org/dtr/type/non-numeric',
    'xmlns:num': 'http://www.xbrl.org/dtr/type/numeric',
    'xmlns:ref': 'http://www.xbrl.org/2006/ref',
    'xmlns:sic': 'http://xbrl.sec.gov/sic/2011-01-31',
    'xmlns:stpr': 'http://xbrl.sec.gov/stpr/2011-01-31',
    'xmlns:us-gaap': 'http://fasb.org/us-gaap/2013-01-31',
    'xmlns:us-roles': 'http://fasb.org/us-roles/2013-01-31',
    'xmlns:us-types': 'http://fasb.org/us-types/2013-01-31',
    'xmlns:utreg': 'http://www.xbrl.org/2009/utr',
    'xmlns:xbrldi': 'http://xbrl.org/2006/xbrldi',
    'xmlns:xbrldt': 'http://xbrl.org/2005/xbrldt',
    'xmlns:xbrli': 'http://www.xbrl.org/2003/instance',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
}



