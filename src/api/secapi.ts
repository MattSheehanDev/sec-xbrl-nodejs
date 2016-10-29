import url = require('url');
import API from './api';


namespace SecAPI {

    const SEC_URL = 'http://www.sec.gov';


    export function GetCIKs(): Promise<string> {
        return new Promise<string>((resolve: Function, reject: Function) => {
            API.Get('http://www.sec.gov/edgar/NYU/cik.coleft.c').then((body: string) => {
                resolve(body.trim());
            }, (err: any) => {
                reject(err);
            });
        });
    }

    export type FilingCount = 10 | 20 | 40 | 80 | 100;
    export type FilingForm = '10-k' | '10-q';
    export function GetFilings(cik: string, formType: FilingForm, start: number, resultsPerPage: FilingCount): Promise<string> {
        // This function webscrapes the Edgar search page at this url:
        // http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000064803&owner=exclude&count=40&hidefilings=0
        // The result is an array of objects which contain basic information about the filings as well as a link to
        // the webpage where the XBRL documents are hosted
        let uri = `http://www.sec.gov/cgi-bin/browse-edgar\
        ?action=getcompany&CIK=${cik}&type=${formType}&dateb=&owner=exclude&start=${start}\
        &count=${resultsPerPage}&hidefilings=0`;

        return new Promise<string>((resolve: Function, reject: Function) => {
            API.Get(uri).then((body: string) => {
                resolve(body);
            }, (err: any) => {
                reject(err);
            });
        });
    }

    export function GetForms(location: string): Promise<string> {
        return new Promise<string>((resolve: Function, reject: Function) => {
            let uri = url.resolve(SEC_URL, location);
            API.Get(uri).then((body: string) => {
                resolve(body);
            }, (err: any) => {
                reject(err);
            });
        });
    }

    export function GetXBRL(location: string): Promise<string> {
        return new Promise<string>((resolve: Function, reject: Function) => {
            let uri = url.resolve(SEC_URL, location);
            API.Get(uri).then((body: string) => {
                resolve(body);
            }, (err: any) => {
                reject(err);
            });
        });
    }

}


export default SecAPI;