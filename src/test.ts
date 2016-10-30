import path = require('path');
import { DOMParser } from 'xmldom';

import YahooAPI from './api/yahooapi';

import filesystem from './utilities/filesystem';
import Scraper from './utilities/scraper';

import { SECFiling, SECDocument } from './models/secmodels';

import XBRLLoader from './xbrl/loader';
import XBRL from './xbrl/xbrl';


namespace Test {

    export function GetPrice(ticker: string): Promise<YahooAPI.CSVResult[]> {
        return new Promise<YahooAPI.CSVResult[]>((resolve: Function, reject: Function) => {
            let priceFile = path.join(process.cwd(), 'test/yahoofinance.csv');

            let read = filesystem.ReadFile(priceFile);
            read.then((body: string) => {
                let results = YahooAPI.csv.Parse(body);
                resolve(results);
            }, (err: any) => {
                reject(err);
            });
        });
    }

    export function GetCIKS(): Promise<string> {
        return new Promise<string>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/ciks.txt'));
            read.then((data: string) => {
                // parse out file
                resolve(data);

            }, (err: NodeJS.ErrnoException) => {
                // SecAPI.GetCIKs().then((data: string) => {
                //     // write to file
                //     let write = filesystem.WriteFile(path.join(workingDir, 'ciks.txt'), data);
                //     write.then(() => {
                //         console.log('Wrote ciks.txt');
                //         resolve(data);
                //     });
                // });
            });
        });
    }

    export function Get10KFilings(cik: string): Promise<SECFiling[]> {
        return new Promise<SECFiling[]>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/filings.html'));
            read = read.then((body: string) => {

                let filings = Scraper.Filings(body);
                resolve(filings);
            });
            read.then(null, (err: NodeJS.ErrnoException) => {
                let load = XBRLLoader.Get10KFilingsList(cik);
                load.then((filings: SECFiling[]) => {
                    resolve(filings);
                });
                load.then(null, (err: any) => {
                    reject(err);
                });
            });
        });
    }

    export function GetForms(uri: string): Promise<SECDocument[]> {
        return new Promise<SECDocument[]>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/forms.html'));
            read = read.then((body: string) => {

                let forms = Scraper.Forms(body);
                resolve(forms);
            });
            read.then(null, (err: NodeJS.ErrnoException) => {
                let load = XBRLLoader.Get10KDocumentsList(uri);
                load.then((docs: SECDocument[]) => {
                    resolve(docs);
                });
                load.then(null, (err: any) => {
                    reject(err);
                });
            });
        });
    }

    export function GetXBRL(uri: string): Promise<XBRL> {
        return new Promise<XBRL>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/xbrl.xml'));
            read = read.then((data: string) => {
                let dom = new DOMParser();
                let doc = dom.parseFromString(data);
                
                resolve(new XBRL(doc));
            });
            read.then(null, (err: NodeJS.ErrnoException) => {
                let load = XBRLLoader.Get10KXBRL(uri);
                load.then((value: XBRL) => {
                    resolve(value);
                });
                load.then(null, (err: any) => {
                    reject(err);
                });
                // let search = SecAPI.GetXBRL(uri);
                // search.then((data: string) => {
                //     resolve(data);
                // });
            });
        });
    }

}

export default Test;
