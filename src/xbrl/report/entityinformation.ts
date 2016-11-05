import { Taxonomy as taxon, Select as select } from '../namespaces/dei';
import XBRL from '../xbrl';


export module EntityInfoXBRL {

    function Get(taxonomy: string, node: Element|Document) {
        let nodes = select(taxonomy, node);
        if (nodes.length)
            return nodes[0].firstChild.data;
    }


    export function RegistrantName(xbrl: XBRL) {
        return Get(taxon.RegistrantName, xbrl.deiRoot);
    }
    export function CentralIndexKey(xbrl: XBRL) {
        return Get(taxon.CentralIndexKey, xbrl.deiRoot);
    }
    export function DocumentType(xbrl: XBRL) {
        return Get(taxon.DocumentType, xbrl.deiRoot);
    }
    export function DocumentFocusPeriod(xbrl: XBRL) {
        return Get(taxon.DocumentFocusPeriod, xbrl.deiRoot);
    }
    export function DocumentYearFocus(xbrl: XBRL) {
        return Get(taxon.DocumentYearFocus, xbrl.deiRoot);
    }
    export function DocumentEndDate(xbrl: XBRL) {
        return Get(taxon.DocumentEndDate, xbrl.deiRoot);
    }
    export function FiscalYearEndDate(xbrl: XBRL) {
        return Get(taxon.FiscalYearEndDate, xbrl.deiRoot);
    }
    export function Amendment(xbrl: XBRL) {
        return Get(taxon.AmendmentFlag, xbrl.deiRoot);
    }
    
}
