import { DOMParser } from 'xmldom';

import SecAPI from '../api/secapi';
import {SECFiling, SECDocument} from '../models/secmodels';
import Scraper from '../utilities/scraper';
import XBRL from './xbrl';


namespace XBRLLoader {

    export function Get10KFilingsList(cik: string): Promise<SECFiling[]> {
        return new Promise<SECFiling[]>((resolve: Function, reject: Function) => {
            let search = SecAPI.GetFilings(cik, '10-k', 0, 10);
            search.then((body: string) => {
                let filings = Scraper.Filings(body);
                resolve(filings);
            }).then(null, (err: any) => {
                reject(err);
            });
        });
    }

    export function Get10KDocumentsList(uri: string): Promise<SECDocument[]> {
        return new Promise<SECDocument[]>((resolve: Function, reject: Function) => {
            let search = SecAPI.GetForms(uri);
            search.then((body: string) => {
                let forms = Scraper.Forms(body);
                resolve(forms);
            }).then(null, (err: any) => {
                reject(err);
            });
        });
    }


    let dom = new DOMParser();

    export function Get10KXBRL(uri: string): Promise<XBRL> {
        return new Promise<XBRL>((resolve: Function, reject: Function) => {
            let search = SecAPI.GetXBRL(uri);
            search.then((data: string) => {
                resolve(new XBRL(dom.parseFromString(data)));
            });
            search.then(null, (err: any) => {
                reject(err);
            });
        });
    }

}


export default XBRLLoader;