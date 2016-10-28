import path = require('path');

import { DOMParser } from 'xmldom';

import filesystem from './filesystem';
import YahooAPI from './api/yahooapi';
import SecAPI from './api/secapi';
import Scraper from './scraper';
import TenK from './xbrl/tenk';
import Finance from './xbrl/finance';


let workingDir = process.cwd();
let isRelease = process.env.NODE_ENV === 'release';


// namespace QuandlAPI {

//     const URL = 'https://www.quandl.com/api/v3/datasets/WIKI'
//     const API_KEY = '';

//     function Get() {
//         return new Promise<any>((resolve: Function, reject: Function) => {
//             let ticker = 'FB';
//             let uri = `${URL}/${ticker}/data.json?api_key=${API_KEY}`;
//         });
//     }

// }


// let price = YahooAPI.GetPrice('AAPL', '2012-01-01', '2012-01-01');
// price.then((result: YahooAPI.Result) => {
//     let r = result;
// });

// let historicalPrice = YahooAPI.GetHistoricalPrice('AAPL', '2012-01-01', '2012-01-01');
// historicalPrice.then((result: YahooAPI.Result) => {

// });

// YahooAPI.GetGPrice();
// YahooAPI.csv.GetPrice(['AAPL', 'GOOG']);


namespace Test {

    export function GetPrice(ticker: string): Promise<YahooAPI.CSVResult[]> {
        return new Promise<YahooAPI.CSVResult[]>((resolve: Function, reject: Function) => {
            let priceFile = path.join(workingDir, 'test/yahoofinance.csv');

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
            let read = filesystem.ReadFile(path.join(workingDir, 'test/ciks.txt'));
            read.then((data: string) => {
                // parse out file
                resolve(data);

            }, (err: NodeJS.ErrnoException) => {
                SecAPI.GetCIKs().then((data: string) => {
                    // write to file
                    let write = filesystem.WriteFile(path.join(workingDir, 'ciks.txt'), data);
                    write.then(() => {
                        console.log('Wrote ciks.txt');
                        resolve(data);
                    });
                });
            });
        });
    }

    export function Get10KFilings(cik: string): Promise<Scraper.SECFiling[]> {
        return new Promise<Scraper.SECFiling[]>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(workingDir, 'test/filings.html'));
            read.then((body: string) => {

                let filings = Scraper.Filings(body);
                resolve(filings);

            }, (err: NodeJS.ErrnoException) => {

                let search = SecAPI.GetFilings(cik, '10-k', 0, 1);
                search.then((body: string) => {
                    let filings = Scraper.Filings(body);
                    resolve(filings);
                });
            });
        });
    }

    export function GetForms(uri: string): Promise<Scraper.SECForm[]> {
        return new Promise<Scraper.SECForm[]>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(workingDir, 'test/forms.html'));
            read.then((body: string) => {

                let forms = Scraper.Forms(body);
                resolve(forms);

            }, (err: NodeJS.ErrnoException) => {

                let search = SecAPI.GetForms(uri);
                search.then((body: string) => {
                    let forms = Scraper.Forms(body);
                    resolve(forms);
                });

            });
        });
    }

    export function GetXBRL(uri: string) {
        return new Promise<string>((resolve: Function, reject: Function) => {
            let read = filesystem.ReadFile(path.join(workingDir, 'test/xbrl.xml'));
            read.then((data: string) => {

                resolve(data);

            }, (err: NodeJS.ErrnoException) => {

                let search = SecAPI.GetXBRL(uri);
                search.then((data: string) => {
                    resolve(data);
                });
            });
        });
    }

}



// Example
let loadFilings = Test.Get10KFilings('0000064803');
loadFilings.then((filings: Scraper.SECFiling[]) => {
    // the first form will be the latest 10-K
    let filing = filings[0];

    // date should be in YYYY-MM-DD format
    let date = new Date(filing.date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;                    // returns 0-11
    let day = date.getDate() + 1;

    let url = filing.url;

    let loadForms = Test.GetForms(url);
    loadForms.then((forms: Scraper.SECForm[]) => {
        let form: Scraper.SECForm;
        for (let f of forms) {
            if (f.type.match(/.INS$/gi)) {
                form = f;
                break;
            }
        }


        let loadXBRL = Test.GetXBRL(form.url);
        loadXBRL.then((xml: string) => {

            let dom = new DOMParser();
            let doc = dom.parseFromString(xml);

            let tenk = new TenK(doc, 2014);
            let tenk2013 = new TenK(doc, 2013);
            let tenk2012 = new TenK(doc, 2012);

            

            let loadPrice = Test.GetPrice('CVS');
            loadPrice.then((value: YahooAPI.CSVResult[]) => {
                let ticker = value[0];

                let priceToEarnings = ticker.AskPrice / tenk.GetEarningsPerShare();

                let outstandingCommonShares = tenk.GetOutstandingShares();
                let outstandingPreferredShares = tenk.GetPreferredOutstandingShares();
                let totalRevenue = tenk.GetTotalRevenue();
                let netIncome = tenk.GetNetIncome();
                let earningsPerShare = tenk.GetEarningsPerShare();
                let dilutedEarningsPerShare = tenk.GetDilutedEarningsPerShare();
                let dividend = tenk.GetDeclaredDividend();
                let currentAssets = tenk.GetCurrentAssets();
                let currentLiabilities = tenk.GetCurrentLiabilities();
                let longTermDebt = tenk.GetLongTermDebt();

                let workingCapital = Finance.CalcWorkingCapital(currentAssets, currentLiabilities);
                let profitMargin = Finance.CalcProfitMargin(netIncome, totalRevenue);
                let currentAssetsToCurrentLiab = Finance.CalcCurrentAssetsRatio(currentAssets, currentLiabilities);
                let workingCapitalToLongTermDebt = Finance.CalcWorkingCapitalToDebtRatio(workingCapital, longTermDebt);


                let averageEarningsPerShare = Finance.CalcAverageEarningsPerShare([tenk, tenk2013, tenk2012]);
                let averageDilutedEarningsPerShare = Finance.CalcAverageDilutedEarningsPerShare([tenk, tenk2013, tenk2012]);


                // let year = 2014;
                process.stdout.write('\r\n');
                process.stdout.write(`Price/Earnings (${year}): ${outstandingCommonShares} \r\n`);

                process.stdout.write(`Outstanding Shares (${year}): ${outstandingCommonShares} \r\n`);
                process.stdout.write(`Outstanding Preferred Shares (${year}): ${outstandingPreferredShares} \r\n`);
                process.stdout.write(`Total Revenue (${year}): ${totalRevenue} \r\n`);
                process.stdout.write(`Net Income (${year}): ${netIncome} \r\n`);
                process.stdout.write(`Earnings/Share (${year}): ${earningsPerShare} \r\n`);
                process.stdout.write(`Diluted Earnings/Share (${year}): ${dilutedEarningsPerShare} \r\n`);
                process.stdout.write(`Dividend (${year}): ${dividend} \r\n`);
                process.stdout.write(`Current Assets (${year}): ${currentAssets} \r\n`);
                process.stdout.write(`Current Liabilities (${year}): ${currentLiabilities} \r\n`);
                process.stdout.write(`Long-Term Debt (${year}): ${longTermDebt} \r\n`);

                process.stdout.write('\r\n');
                process.stdout.write(`Average Earnings/Share (2012-14): ${averageEarningsPerShare} \r\n`);
                process.stdout.write(`Average Diluted Earnings/Share (2012-14): ${averageDilutedEarningsPerShare} \r\n`);

            });
        });
    });
});





// function Select(element: string, doc: Document) {
//     let nodes: any[] = []

//     let select = xpath.select(`//*[local-name() = '${element}']`, doc);
//     for (let i = 0; i < select.length; i++) {
//         let node = select[i];
//         if (node.prefix === 'us-gaap') {
//             nodes.push(node);
//         }
//     }
//     return nodes
// }
// function GetYear(date: string) {
//     let match: RegExpMatchArray;
//     let year = -1;

//     if (match = date.match(/^from_([a-z]+\d{2})_(\d{4})_to_([a-z]+\d{2})_(\d{4})$/i)) {
//         let fromDate = Date.parse("" + match[1] + " " + match[2]);
//         if (!isNaN(fromDate)) {
//             let toDate = Date.parse("" + match[3] + " " + match[4]);
//             if (!isNaN(toDate)) {
//                 let day = 24 * 60 * 60 * 1000;
//                 let days = (toDate - fromDate) / day;
//                 if ((360 < days && days < 370)) {
//                     year = new Date(toDate).getFullYear();
//                 }
//             }
//         }
//     }
//     else if (match = date.match(/^d(\d{4})$/i)) {
//         year = parseInt(match[1]);
//     }
//     else if (match = date.match(/^d(\d{4})q(\d{1})(ytd)?$/i)) {
//         year = parseInt(match[1]);
//     }
//     // else if (match = date.match(/^FD(\d{4})Q(\d{1})YTD$/i)) {
//     //     year = parseInt(match[1]);
//     // }
//     else if (match = date.match(/^(?:FD|FI)(\d{4})Q4(YTD)?$/i)) {
//         year = parseInt(match[1]);
//     }

//     return year;
// }
// function GetYearShares(date: string) {
//     let match: RegExpMatchArray;
//     let year = -1;

//     if (match = date.match(/^FI(\d{4})Q4$/i)) {
//         year = parseInt(match[1]);
//     }

//     return year;
// }






// function getTags(data: string) {
//     var tags: any[] = [];

//     var tagSelector = function (el: any) {
//         if (el.type === 'tag' && el.children.length === 1) {
//             tags.push({
//                 name: el.name,
//                 attribs: el.attribs,
//                 data: el.children[0].data
//             });
//         }
//     }

//     let $ = cheerio.load(data);
//     // xmlRecurse($._root, tagSelector);
//     xmlRecurse($.root()[0], tagSelector);


//     return tags;
// }

// function xmlRecurse(el: any, cb: Function) {
//     // recurses through an xml document and applies callback to each element
//     cb(el);

//     let children = el.children;
//     if (children) {
//         el.children.forEach((child: any) => {
//             xmlRecurse(child, cb);
//         })
//     }
// };




// const publicationFields = {
//     EnterpriseNumber: {
//         normalize: (val: string) => {
//             if (!val) return;
//             const m = val.match(/^(?:BE)?(\d{4})\.?(\d{3})\.?(\d{3})$/)
//             return m ? `${m[1]}.${m[2]}.${m[3]}` : val
//         },
//         xPath: '//xbrli:xbrl/xbrli:context[@id="CurrentInstant"]/xbrli:entity/xbrli:identifier'
//     },
//     CurrentInstant: {
//         xPath: '//xbrli:xbrl/xbrli:context[@id="CurrentInstant"]/xbrli:period/xbrli:instant'
//     },
//     CurrentDurationStart: {
//         xPath: '//xbrli:xbrl/xbrli:context[@id="CurrentDuration"]/xbrli:period/xbrli:startDate'
//     },
//     CurrentDurationEnd: {
//         xPath: '//xbrli:xbrl/xbrli:context[@id="PrecedingDuration"]/xbrli:period/xbrli:endDate'
//     },
//     PrecedingInstant: {
//         xPath: '//xbrli:xbrl/xbrli:context[@id="PrecedingInstant"]/xbrli:period/xbrli:instant'
//     },
//     PrecedingDurationStart: {
//         xPath: '//xbrli:xbrl/xbrli:context[@id="PrecedingDuration"]/xbrli:period/xbrli:startDate'
//     },
//     PrecedingDurationEnd: {
//         xPath: '//xbrli:xbrl/xbrli:context[@id="PrecedingDuration"]/xbrli:period/xbrli:endDate'
//     }
// }
// const contextPeriods = [
//     'Current',
//     'Preceding'
// ]


// function firstChildData(node: any) {
//     if (node && node.firstChild) {
//         return node.firstChild.data || null;
//     }
//     return null;
// }

// let ns = xpath.useNamespaces({
//     xbrli: 'http://www.xbrl.org/2003/instance',
//     iso4217: 'http://www.xbrl.org/2003/iso4217',
//     link: 'http://www.xbrl.org/2003/linkbase',
//     pfs: 'http://www.nbb.be/be/fr/pfs/ci/2015-04-01',
//     xlink: 'http://www.w3.org/1999/xlink',
//     usgaap: 'http://fasb.org/us-gaap/2013-01-31'
// });
// function getPublicationData(x: string, doc: Document) {
//     let sl = ns(x, doc);
//     return firstChildData(sl[0]);
// }

// function getLedgerData(ledgerId: string, ledgerType: string, contextPeriod: string, doc: Document) {
//     const xPath = `//xbrli:xbrl/pfs:${ledgerId}[@contextRef="${contextPeriod}${ledgerType}"]`
//     const node = ns(xPath, doc)[0]

//     return node && {
//         LedgerId: ledgerId,
//         UnitRef: node.getAttribute('unitRef'),
//         Period: contextPeriod,
//         Amount: parseFloat(firstChildData(node))
//     }
// }


// function ParseXML(xml: string) {
//     const dom = new DOMParser();
//     const doc = dom.parseFromString(xml);

//     let publication: any = {};
//     let ledger: any[] = [];

//     for (const fieldName in publicationFields) {
//         const fieldMetadata = (<any>publicationFields)[fieldName]
//         const rawValue = getPublicationData(fieldMetadata.xPath, doc)
//         const normValue = fieldMetadata.normalize ? fieldMetadata.normalize(rawValue) : rawValue
//         publication[fieldName] = normValue
//     }

//     for (const ledgerType in ledgerTypes) {
//         for (const ledgerId of (<any>ledgerTypes)[ledgerType]) {
//             for (const contextPeriod of contextPeriods) {
//                 const data = getLedgerData(ledgerId, ledgerType, contextPeriod, doc)
//                 if (data) {
//                     ledger.push(data)
//                 }
//             }
//         }
//     }

//     console.log(JSON.stringify(publication));
//     return publication;
// }
