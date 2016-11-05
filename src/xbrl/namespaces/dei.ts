// import xpath = require('xpath');
import { SelectNS } from './xmlns';


// DEI
// Document Entity Information


export module Taxonomy {
    
    export const RegistrantName = 'EntityRegistrantName';
    export const CentralIndexKey = 'EntityCentralIndexKey';                     // CIK number
    export const DocumentType = 'DocumentType';                                 // 10-K, 10-Q
    export const DocumentFocusPeriod = 'DocumentFiscalPeriodFocus';             // FY
    export const DocumentYearFocus = 'DocumentFiscalYearFocus'                  // YYYY
    export const DocumentEndDate = 'DocumentPeriodEndDate';                     // YYYY-MM-DD
    export const FiscalYearEndDate = 'CurrentFiscalYearEndDate';                // --MM-DD
    export const AmendmentFlag = 'AmendmentFlag';

}



export function Select(name: string, document: Document|Element): any[] {
    let usingNS = `//*[local-name()='${name}' and namespace-uri()='http://xbrl.sec.gov/dei/2013-01-31']`;
    let nodes = SelectNS(usingNS, document);
    if (nodes.length)
        return nodes;

    let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), 'dei')]`;
    nodes = SelectNS(usingPrefix, document);
    if (nodes.length)
        return nodes;

    return [];
}


export function All(document: Document) {
    return SelectNS(`//*[namespace-uri()='http://xbrl.sec.gov/dei/2013-01-31']`, document);
}