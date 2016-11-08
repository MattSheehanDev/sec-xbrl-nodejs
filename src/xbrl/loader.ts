import { DOMParser } from 'xmldom';

import SecAPI from '../api/secapi';
import {SECFiling, SECDocument} from '../models/secmodels';
import Scraper from '../utilities/scraper';
import XBRL from './xbrl';


namespace XBRLLoader {

    let dom = new DOMParser();


    export function GetEdgarFilingsList(cik: string, start: number): Promise<SECFiling[]> {
        return SecAPI.GetFilings(cik, '10-k', start, 20).then((body: string) => {
            return Scraper.Filings(body);
        });
    }

    export function GetEdgarDocumentsList(uri: string): Promise<SECDocument[]> {
        return SecAPI.GetForms(uri).then((body: string) => {
            return Scraper.Forms(body);
        });
    }

    export function GetXBRLFromUrl(uri: string): Promise<XBRL> {
        return SecAPI.GetXBRL(uri).then((data: string) => {
            return new XBRL(dom.parseFromString(data));
        });
    }

    export function GetXBRLFromString(data: string) {
        return new XBRL(dom.parseFromString(data));
    }

}


export default XBRLLoader;