/// <reference path="../../../typings/xpath/index.d.ts" />
import xpath = require('xpath');


export const XBRL_NS: any = {
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


export const SelectNS = xpath.useNamespaces({
    country: 'http://xbrl.sec.gov/country/2013-01-31',
    currency: 'http://xbrl.sec.gov/currency/2012-01-31',
    dei: 'http://xbrl.sec.gov/dei/2013-01-31',
    exch: 'http://xbrl.sec.gov/exch/2013-01-31',
    invest: 'http://xbrl.sec.gov/invest/2013-01-31',
    iso4217: 'http://www.xbrl.org/2003/iso4217',
    link: 'http://www.xbrl.org/2003/linkbase',
    naics: 'http://xbrl.sec.gov/naics/2011-01-31',
    nonnum: 'http://www.xbrl.org/dtr/type/non-numeric',
    num: 'http://www.xbrl.org/dtr/type/numeric',
    ref: 'http://www.xbrl.org/2006/ref',
    sic: 'http://xbrl.sec.gov/sic/2011-01-31',
    stpr: 'http://xbrl.sec.gov/stpr/2011-01-31',
    usgaap: 'http://fasb.org/us-gaap/2013-01-31',
    usroles: 'http://fasb.org/us-roles/2013-01-31',
    ustypes: 'http://fasb.org/us-types/2013-01-31',
    utreg: 'http://www.xbrl.org/2009/utr',
    xbrldi: 'http://xbrl.org/2006/xbrldi',
    xbrldt: 'http://xbrl.org/2005/xbrldt',
    xbrli: 'http://www.xbrl.org/2003/instance',
    xlink: 'http://www.w3.org/1999/xlink',
    xsd: 'http://www.w3.org/2001/XMLSchema',
    xsi: 'http://www.w3.org/2001/XMLSchema-instance'
});


export function CreateRootNode(document: Document) {
    let root = document.createElementNS('http://www.xbrl.org/2003/instance', 'xbrli:xbrl');
    for (let ns in XBRL_NS) {
        root.setAttribute(ns, XBRL_NS[ns]);
    }
    return root;
}
