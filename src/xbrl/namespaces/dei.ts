// import xpath = require('xpath');
import { SelectNS } from './xmlns';


module DEI {

    export const AmendmentFlag = ['AmendmentFlag'];
    export const FiscalYearEndDate = ['CurrentFiscalYearEndDate'];              // --MM-DD
    export const FiscalYearFocusPeriod = ['DocumentFiscalPeriodFocus'];         // FY
    export const FiscalYearFocus = ['DocumentFiscalYearFocus']                  // YYYY
    export const DocumentEndDate = ['DocumentPeriodEndDate'];                   // YYYY-MM-DD
    export const DocumentType = ['DocumentType'];
    export const CentralIndexKey = ['EntityCentralIndexKey'];                   // CIK number


    export function All(document: Document) {
        return SelectNS(`//*[namespace-uri()='http://xbrl.sec.gov/dei/2013-01-31']`, document);
    }

    export function Select(names: string[], document: Document|Element) {
        for (let name of names) {
            let usingNS = `//*[local-name()='${name}' and namespace-uri()='http://xbrl.sec.gov/dei/2013-01-31']`;
            let nodes = SelectNS(usingNS, document);
            if (nodes.length > 0) {
                return nodes;
            };
        }
        for (let name of names) {
            let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), 'dei')]`;
            let nodes = SelectNS(usingPrefix, document);
            if (nodes.length) {
                return nodes;
            }
        }
        return null;
    }

}


export default DEI;