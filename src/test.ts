import path = require('path');
import { DOMParser } from 'xmldom';

import YahooAPI from './api/yahooapi';

import filesystem from './utilities/filesystem';
import Scraper from './utilities/scraper';

import { SECFiling, SECDocument } from './models/secmodels';

import XBRLLoader from './xbrl/loader';
import XBRL from './xbrl/xbrl';


namespace Test {

    function Wait(promises: Promise<any>[]) {
        return new Promise<any[]>((resolve: Function, reject: Function) => {
            let values = [].fill(null, 0, promises.length);
            let finished = 0;

            for (let p of promises) {
                let index = promises.indexOf(p);

                p.then((value: any) => {
                    values[index] = value;

                    finished = finished + 1;
                    if (finished === promises.length) {
                        let v = values.filter((value: any) => {
                            return value !== null;
                        });
                        resolve(v);
                    }
                }, (err: any) => {
                    finished = finished + 1;
                    if (finished === promises.length) {
                        resolve();
                    }
                });
            }
        });
    }

    export function Load(ticker: string) {
        // we need to load the most recent annual report,
        // the annual report from 5 years ago,
        // and the annual report from 10 years ago
        let load: Promise<any> = XBRLLoader.GetEdgarFilingsList(ticker, 0);
        load = load.then((filings: SECFiling[]) => {
            if (filings.length < 10) {
                // company has been around for less than 10 years and isn't a value security
            }
            
            // TODO: XBRL filings only go back to 2009 (some go back to 2007 but 07-09 were 'optional' years)
            let forms: Promise<XBRL>[] = [
                // Current year + 3 year buffer
                LoadAnnualXBRL(filings[0].url),
                LoadAnnualXBRL(filings[1].url),
                LoadAnnualXBRL(filings[2].url),
            ];

            return Wait(forms);
        });
        return load;

        // we need to load the current price,
        // the price from last year, and the price from the year before that.
    }

    function LoadAnnualXBRL(url: string): Promise<XBRL> {
        let load: Promise<any> = XBRLLoader.GetEdgarDocumentsList(url);
        load = load.then((docs: SECDocument[]) => {
            let doc: SECDocument;
            for (let d of docs) {
                if (d.type.match(/.INS$/gi)) {
                    doc = d;
                    break;
                }
            }
            return XBRLLoader.GetXBRLFromUrl(doc.url);
        });
        return load;
    }


    export function Get10KFilings(cik: string): Promise<SECFiling[]> {
        return new Promise<SECFiling[]>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/cvs/filings.html'));
            read = read.then((body: string) => {

                let filings = Scraper.Filings(body);
                resolve(filings);
            });
            read.then(null, (err: NodeJS.ErrnoException) => {
                let load = XBRLLoader.GetEdgarFilingsList(cik, 0);
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
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/cvs/forms.html'));
            read = read.then((body: string) => {

                let forms = Scraper.Forms(body);
                resolve(forms);
            });
            read.then(null, (err: NodeJS.ErrnoException) => {
                let load = XBRLLoader.GetEdgarDocumentsList(uri);
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
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/cvs/xbrl.xml'));
            read = read.then((data: string) => {
                let dom = new DOMParser();
                let doc = dom.parseFromString(data);
                
                resolve(new XBRL(doc));
            });
            read.then(null, (err: NodeJS.ErrnoException) => {
                let load = XBRLLoader.GetXBRLFromUrl(uri);
                load.then((value: XBRL) => {
                    resolve(value);
                });
                load.then(null, (err: any) => {
                    reject(err);
                });
            });
        });
    }



    export function GetPrice(ticker: string): Promise<YahooAPI.QuoteResult> {
        // return YahooAPI.GetPrice(ticker);

        return new Promise<YahooAPI.QuoteResult>((resolve: Function, reject: Function) => {
            let priceFile = path.join(process.cwd(), 'test/cvs/yahoofinance.json');

            let read = filesystem.ReadFile(priceFile);
            read.then((body: string) => {
                let results = JSON.parse(body);// YahooAPI.csv.Parse(body);
                resolve(results);
            }, (err: any) => {
                reject(err);
            });
        });
    }

    export function GetCIKS(): Promise<string> {
        return new Promise<string>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(process.cwd(), 'test/cvs/ciks.txt'));
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

}

export default Test;
