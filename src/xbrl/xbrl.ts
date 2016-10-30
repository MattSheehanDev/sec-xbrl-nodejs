import xpath = require('xpath');

import context from './contextinstance';
import gaap from './gaap';


var XBRLNamespaces: any = {
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


class XBRL {

    public readonly document: Document;
    public readonly gaapRoot: Element;
    public readonly years: number[];

    constructor(doc: Document) {
        this.document = doc;

        // Create a root gaap node
        this.gaapRoot = this.document.createElementNS('http://www.xbrl.org/2003/instance', 'xbrli:xbrl');
        for (let ns in XBRLNamespaces) {
            this.gaapRoot.setAttribute(ns, XBRLNamespaces[ns]);
        }
        // let rs = gaapRoot.toString();

        let gaapNodes: Element[] = gaap.All(doc);
        for (let node of gaapNodes) {
            // if (node.parentNode) {
            //     node.parentNode.removeChild(node);
            // }
            this.gaapRoot.appendChild(node.cloneNode(true));
        }


        this.years = context.GetYears(this.document);
        
    }

}

export default XBRL;