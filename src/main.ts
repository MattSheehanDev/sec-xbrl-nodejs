
import { SECFiling, SECDocument } from './models/secmodels';
import YahooAPI from './api/yahooapi';

import XBRL from './xbrl/xbrl';

import Report from './xbrl/reports';
import TenK from './models/tenk';
import Finance from './utilities/finance';

import Test from './test';

import nunjucks = require('nunjucks');
import path = require('path');
import fs from './utilities/filesystem';
import XBRLLoader from './xbrl/loader';

let isRelease = process.env.NODE_ENV === 'release';


// let price = YahooAPI.GetPrice('AAPL', '2012-01-01', '2012-01-01');
// price.then((result: YahooAPI.Result) => {
//     let r = result;
// });

// let historicalPrice = YahooAPI.GetHistoricalPrice('AAPL', '2012-01-01', '2012-01-01');
// historicalPrice.then((result: YahooAPI.Result) => {

// });

// YahooAPI.GetGPrice();
// YahooAPI.csv.GetPrice(['AAPL', 'GOOG']);



function renderNunjucks(inputFilePath: string, searchRelativePaths: string[], context: any): Promise<string> {
    let read = fs.ReadFile(inputFilePath);
    read = read.then((data: string) => {
        let env = nunjucks.configure(searchRelativePaths, {
            autoescape: true,
            trimBlocks: false,
            lstripBlocks: false
        });

        return new Promise<string>((resolve: Function, reject: Function) => {
            env.renderString(data, context, (err: any, res: string) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    });
    return read;
}


let read = fs.ReadFile(path.join(process.cwd(), './test/cvs2/cvs-20141231.xml'));
read = read.then((data: string) => {
    let xbrl = XBRLLoader.GetXBRLFromString(data);
    let report = Report.CreateBalanceSheet(xbrl);

    return renderNunjucks(path.join(process.cwd(), './output/template10k.html'), [], {
        entity: Report.CreateEntityInformation(xbrl),
        reports: report
    });
});
read.then((html: string) => {
    return fs.WriteFile(path.join(process.cwd(), './output/cvs-20141231.html'), html);
});


// // Example
// let cvsCIK = '0000064803';
// let cvsTicker = 'CVS';
// let cvsXBRL: XBRL;


// let load: Promise<any> = Test.Load(cvsCIK);
// load = load.then((xbrlSets: XBRL[]) => {
//     let reports: TenK[] = [];

//     for (let xbrl of xbrlSets) {
//         let tenk = Report.Create10K(xbrl);
//         reports.push(tenk);
//     }

//     let r = reports;
// });


// let yahoo = YahooAPI.GetHistoricalPrice('CVS', '2010-01-02', '2010-01-02');
// yahoo.then((value: YahooAPI.HistoricalResult) => {
    
// });


// let load: Promise<any> = Test.Get10KFilings(cvsTicker);
// load = load.then((filings: SECFiling[]) => {
//     // the first form will be the latest 10-K
//     let filing = filings[0];
//     return Test.GetForms(filing.url);
// });
// load = load.then((forms: SECDocument[]) => {
//     let form: SECDocument;
//     for (let f of forms) {
//         if (f.type.match(/.INS$/gi)) {
//             form = f;
//             break;
//         }
//     }
//     return Test.GetXBRL(form.url);
// });
// load = load.then((xbrl: XBRL) => {
//     cvsXBRL = xbrl;
//     return Test.GetPrice(cvsTicker);
// });
// load = load.then((value: YahooAPI.QuoteResult) => {
//     let tenk = AnnualReport.Create10K(cvsXBRL, cvsXBRL.years[0]);
//     let tenk2013 = AnnualReport.Create10K(cvsXBRL, cvsXBRL.years[1]);
//     let tenk2012 = AnnualReport.Create10K(cvsXBRL, cvsXBRL.years[2]);


//     let price = parseFloat((<YahooAPI.Quote>value.query.results.quote).Bid);

//     let priceToEarnings = price / tenk.EarningsPerShare;
//     let marketCap = price * tenk.OutstandingShares;
//     let dividendYield = tenk.DeclaredDividend / price;

//     let workingCapital = Finance.CalcWorkingCapital(tenk.CurrentAssets, tenk.CurrentLiabiliites);
//     let profitMargin = Finance.CalcProfitMargin(tenk.NetIncome, tenk.TotalRevenue);
//     let currentAssetsToCurrentLiab = Finance.CalcCurrentAssetsRatio(tenk.CurrentAssets, tenk.CurrentLiabiliites);
//     let workingCapitalToLongTermDebt = Finance.CalcWorkingCapitalToDebtRatio(workingCapital, tenk.LongTermDebt);


//     let minYear = Math.min(tenk.Year, tenk2012.Year, tenk2013.Year);
//     let maxYear = Math.max(tenk.Year, tenk2012.Year, tenk2013.Year);
//     let averageEarningsPerShare = Finance.CalcAverageEarningsPerShare([tenk, tenk2013, tenk2012]);
//     let averageDilutedEarningsPerShare = Finance.CalcAverageDilutedEarningsPerShare([tenk, tenk2013, tenk2012]);


//     process.stdout.write('\r\n');
//     // capitalization
//     process.stdout.write(`Price/Earnings (${tenk.Year}): ${priceToEarnings} \r\n`);
//     process.stdout.write(`Outstanding Common Shares (${tenk.Year}): ${tenk.OutstandingShares} \r\n`);
//     process.stdout.write(`Diluted Outstanding Common Shares (${tenk.Year}): ${tenk.DilutedOutstandingShares} \r\n`);
//     process.stdout.write(`Market Capitalization (${tenk.Year}): ${marketCap} \r\n`);

//     // income
//     process.stdout.write(`Total Revenue (${tenk.Year}): ${tenk.TotalRevenue} \r\n`);
//     process.stdout.write(`Net Income (${tenk.Year}): ${tenk.NetIncome} \r\n`);
//     process.stdout.write(`Earnings/Share (${tenk.Year}): ${tenk.EarningsPerShare} \r\n`);
//     process.stdout.write(`Diluted Earnings/Share (${tenk.Year}): ${tenk.DilutedEarningsPerShare} \r\n`);
//     process.stdout.write(`Dividend Rate (${tenk.Year}): ${tenk.DeclaredDividend} \r\n`);

//     // balance sheet
//     process.stdout.write(`Current Assets (${tenk.Year}): ${tenk.CurrentAssets} \r\n`);
//     process.stdout.write(`Current Liabilities (${tenk.Year}): ${tenk.CurrentLiabiliites} \r\n`);
//     process.stdout.write(`Long-Term Debt (${tenk.Year}): ${tenk.LongTermDebt} \r\n`);
//     process.stdout.write(`Outstanding Preferred Shares (${tenk.Year}): ${tenk.PrefOutstandingShares} \r\n`);
//     process.stdout.write(`Working Capital (${tenk.Year}): ${workingCapital} \r\n`);

//     // ratios


//     process.stdout.write('\r\n');
//     process.stdout.write(`Average Earnings/Share (${minYear}-${maxYear}): ${averageEarningsPerShare} \r\n`);
//     process.stdout.write(`Average Diluted Earnings/Share (${minYear}-${maxYear}): ${averageDilutedEarningsPerShare} \r\n`);

// });





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
