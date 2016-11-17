import DeiNode from '../namespaces/deinode';
import XBRL from '../xbrl';


export module EntityInfoXBRL {


    function Get(xbrl: XBRL, taxonomy: string) {
        return createDeiNodes(xbrl.DeiParser.Select(taxonomy));
    }


    export function RegistrantName(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.RegistrantName);
    }
    export function CentralIndexKey(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.CentralIndexKey);
    }
    export function DocumentType(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.DocumentType);
    }
    export function DocumentFocusPeriod(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.DocumentFocusPeriod);
    }
    export function DocumentYearFocus(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.DocumentYearFocus);
    }
    export function DocumentEndDate(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.DocumentEndDate);
    }
    export function FiscalYearEndDate(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.FiscalYearEndDate);
    }
    export function Amendment(xbrl: XBRL) {
        return Get(xbrl, Taxonomy.AmendmentFlag);
    }
    
}

function createDeiNodes(nodes: Element[]) {
    let deiNodes: DeiNode[] = [];
    for (let n of nodes) {
        deiNodes.push(new DeiNode(n));
    }
    return deiNodes;
}


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
