import SecAPI from '../api/secapi';
import {SECFiling, SECDocument} from '../models/secmodels';
import Scraper from '../utilities/scraper';


namespace XBRLLoader {


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

    export function GetXBRLDataFromUrl(uri: string): Promise<string> {
        return SecAPI.GetXBRL(uri)
    }


}


export default XBRLLoader;
