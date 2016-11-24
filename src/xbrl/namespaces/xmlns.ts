/// <reference path="../../../typings/xpath/index.d.ts" />
import xpath = require('xpath');


// TODO: this isn't really going to always work since namespace uri's change...
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
    'us-gaap': 'http://fasb.org/us-gaap/2013-01-31',
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



export function SumNodes(nodes: any[], year: number) {
    let sum = 0;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        let ref = xpath.select('@contextRef', node)[0];
        let nodeYear = ref != null ? GetContextYear(ref.value) : 0;
        let nodeValue = GetNumNodeValue(node);

        if (nodeValue && year === nodeYear) {
            sum += nodeValue;
        }
    }
    return sum;
}

export function GetNumNodeValue(node: any) {
    let value = parseFloat(node.firstChild.data);
    return !isNaN(value) ? value : null;
}
export function GetContextYear(date: string) {
    let match: RegExpMatchArray;
    let year = -1;
    
    // ex. cvs 2015,2014
    if (match = date.match(/^(?:FD|FI)(\d{4})Q4(YTD)?$/i)) {
        year = parseInt(match[1]);
    }
    // ex. cvs 2013
    else if (match = date.match(/^(?:D|I)(\d{4})Q4(YTD)?$/i)) {
        year = parseInt(match[1]);
    }
    else if (match = date.match(/^d(\d{4})$/i)) {
        year = parseInt(match[1]);
    }
    else if (match = date.match(/^d(\d{4})q(\d{1})(ytd)?$/i)) {
        year = parseInt(match[1]);
    }
    return year;
}
