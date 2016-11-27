import XBRL from './xbrl/instance/xbrl';
import ContextNode from './xbrl/instance/contextnode';
import GaapNode from './xbrl/instance/gaapnode';
import DeiNode from './xbrl/instance/deinode';

import Helpers from './xbrl/helpers';

import API from './api/api';
import { DOMParser } from 'xmldom';

import SchemaParser from './schema/schemaparser';
import { SchemaDocument, ElementNode } from './schema/schemanodes'; 
import { LabelNode, PresentationLink, Presentation } from './schema/linkbasenodes';

import Attributes from './xbrl/attributes';
import { StatementNode, StatementValueNode, StatementGaapNode, StatementDeiNode } from './xbrl/statements/statementnode';
import StatementHelpers from './xbrl/statements/statementhelpers';
import Format from './xbrl/statements/statementformat';

import path = require('path');
import url = require('url');

import fs from './utilities/filesystem';
import RenderTemplates from './utilities/nunjucks';
import { DateTime as datetime } from './utilities/datetime';

let isRelease = process.env.NODE_ENV === 'release';
let cwd = process.cwd();

const STMNTS = Attributes.statements;
const TYPES = Attributes.types;
const UNITS = Attributes.units;

// let price = YahooAPI.GetPrice('AAPL', '2012-01-01', '2012-01-01');
// price.then((result: YahooAPI.Result) => {
//     let r = result;
// });

// let historicalPrice = YahooAPI.GetHistoricalPrice('AAPL', '2012-01-01', '2012-01-01');
// historicalPrice.then((result: YahooAPI.Result) => {

// });

// YahooAPI.GetGPrice();
// YahooAPI.csv.GetPrice(['AAPL', 'GOOG']);



const INSTANCE_PATH = path.join(cwd, './test/cvs-20141231.xml');
import ExchangeAPI from './symbols';


let instance = fs.ReadFile(INSTANCE_PATH);
instance = instance.then((data: string) => {
    let parser = new DOMParser();

    console.log('parsing xbrl instance');
    let xbrl = new XBRL(parser.parseFromString(data));


    // for now check if the correct schema exists on disk
    // TODO: use the 'entry' file?
    // TODO: fetch the schemaRef file for custom instance elements?
    console.log('finding instance schemas');

    let checkDei = schemaExists('dei', xbrl.DeiParser.targetNS).then((stats: SchemaStats) => {
        return parseDeiSchema(parser, stats);
    });
    let checkGaap = schemaExists('us-gaap', xbrl.GaapParser.targetNS).then((stats: SchemaStats) => {
        return parseGaapSchema(parser, stats);
    });

    // let symbolsDir = path.join(cwd, './symbols/');
    // fs.TryMakeDir(symbolsDir).then(() => {
    //     return ExchangeAPI.WriteSymbolLists(symbolsDir);
    // }).then(() => {
    //     console.log('Wrote symbols');
    // });


    // let render = Promise.all([checkDei, checkGaap]).then((data: any[]) => {
    //     console.log('started rendering xbrl instance');
    //     let deiSchema: DeiInstanceSchema = data[0];
    //     let gaapSchema: GaapInstanceSchema = data[1];

    //     let instanceData = parseInstance(xbrl, deiSchema, gaapSchema);
    //     return RenderTemplates(instanceData);
    // });
    // render = render.then((html: string) => {
    //     return fs.TryMakeDir(path.join(cwd, `./output/`)).then(() => {
    //         let p = path.parse(INSTANCE_PATH);
    //         return fs.WriteFile(path.join(cwd, `./output/${p.name}.html`), html);
    //     }).then(() => {
    //         console.log('Wrote output.');
    //     });
    // });
});



// Check if a schema directory exists
interface SchemaStats {
    dir: string;
    date: string;
}

function schemaExists(schemaName: string, targetNS: string): Promise<SchemaStats> {
    let targetUrl = url.parse(targetNS);
    let targetPath = targetUrl.pathname;

    // dates in yyyy-MM-dd format are treated as utc
    let date = new Date(path.basename(targetPath));
    let formattedDate = datetime.format(date, 'yyyy-MM-dd', true);
    
    // schemas directories follow the schema
    // /{name}/{name}-{yyyy-mm-dd}/
    let schemaDir = path.join(cwd, `./schemas/${schemaName}/${schemaName}-${formattedDate}/`);

    let check = fs.PathAccess(schemaDir);
    check = check.then<SchemaStats>(() => {
        return {
            dir: schemaDir,
            date: formattedDate
        };
    });
    check = check.then(null, (err: NodeJS.ErrnoException) => {
        return err;
    });
    return <any>check;
}


// Parse DEI schema
interface DeiInstanceSchema {
    schema: SchemaDocument,
    labels: LabelNode[],
    presentation: PresentationLink[]
}

function parseDeiSchema(parser: DOMParser, stats: SchemaStats) {
    let elements = path.join(stats.dir, `/dei-${stats.date}.xsd`);
    let labels = path.join(stats.dir, `/dei-lab-${stats.date}.xml`);
    let presentation = path.join(stats.dir, `/dei-pre-${stats.date}.xml`);


    let readSchema = fs.ReadFile(elements).then((data: string) => {
        let document = parser.parseFromString(data);
        return SchemaParser.ParseDocument(document);        
    });
    let readLabels = fs.ReadFile(labels).then((data: string) => {
        let document = parser.parseFromString(data);
        return SchemaParser.ParseLabels(document);
    });
    let readPresentation = fs.ReadFile(presentation).then((data: string) => {
        // TODO: match roleRef's with presentationLink's
        let document = parser.parseFromString(data);
        return SchemaParser.ParsePresentation(document);
    });

    return Promise.all<DeiInstanceSchema>([readSchema, readLabels, readPresentation]).then((dei: any[]) => {
        return <DeiInstanceSchema>{
            schema: <SchemaDocument>dei[0],
            labels: <LabelNode[]>dei[1],
            presentation: <PresentationLink[]>dei[2]
        }
    });
}


// Parse GAAP instance
interface GaapInstanceSchema {
    schema: SchemaDocument;
    labels: LabelNode[],

    sfp_clreo: PresentationLink[];
    sfp_cls: PresentationLink[];
    sfp_dbo: PresentationLink[];
    sfp_ibo: PresentationLink[];
    sfp_sbo: PresentationLink[];
    sfp_ucreo: PresentationLink[];

    soiPresentation: PresentationLink[];
    socPresentation: PresentationLink[];
}

function parseGaapSchema(parser: DOMParser, stats: SchemaStats) {
    let elements = path.join(stats.dir, `/elts/us-gaap-${stats.date}.xsd`);
    let labels = path.join(stats.dir, `/elts/us-gaap-lab-${stats.date}.xml`);

    // classified, Real Estate Operations
    let sfp_clreo = path.join(stats.dir, `/stm/us-gaap-stm-sfp-clreo-pre-${stats.date}.xml`);
    // classified
    let sfp_cls = path.join(stats.dir, `/stm/us-gaap-stm-sfp-cls-pre-${stats.date}.xml`);
    // unclassified, Deposit Based Operations
    let sfp_dbo = path.join(stats.dir, `/stm/us-gaap-stm-sfp-dbo-pre-${stats.date}.xml`);
    // unclassified, Investment Based Operations
    let sfp_ibo = path.join(stats.dir, `/stm/us-gaap-stm-sfp-ibo-pre-${stats.date}.xml`);
    // unclassified, Securities Based Operations
    let sfp_sbo = path.join(stats.dir, `/stm/us-gaap-stm-sfp-sbo-pre-${stats.date}.xml`);
    // unclassified, Real Estate Operations
    let sfp_ucreo = path.join(stats.dir, `/stm/us-gaap-stm-sfp-ucreo-pre-${stats.date}.xml`);

    let soiPresentation = path.join(stats.dir, `/stm/us-gaap-stm-soi-pre-${stats.date}.xml`);
    let socPresentation = path.join(stats.dir, `/stm/us-gaap-stm-soc-pre-${stats.date}.xml`);

    let readSchema = fs.ReadFile(elements).then((data: string) => {
        return SchemaParser.ParseDocument(parser.parseFromString(data));        
    });
    let readLabels = fs.ReadFile(labels).then((data: string) => {
        return SchemaParser.ParseLabels(parser.parseFromString(data));
    });
    
    let readSFPcls = fs.ReadFile(sfp_cls).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    let readSFPclreo = fs.ReadFile(sfp_clreo).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    let readSFPdbo = fs.ReadFile(sfp_dbo).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    let readSFPibo = fs.ReadFile(sfp_ibo).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    let readSFPsbo = fs.ReadFile(sfp_sbo).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    let readSFPucreo = fs.ReadFile(sfp_ucreo).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    
    let readSOIPresentation = fs.ReadFile(soiPresentation).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });
    let readSOCPresenation = fs.ReadFile(socPresentation).then((data: string) => {
        return SchemaParser.ParsePresentation(parser.parseFromString(data));
    });

    return Promise.all<GaapInstanceSchema>([
        readSchema,
        readLabels,
        
        readSFPclreo,
        readSFPcls,
        readSFPdbo,
        readSFPibo,
        readSFPsbo,
        readSFPucreo,

        readSOIPresentation,
        readSOCPresenation
    ]).then((gaap: any[]) => {
        return <GaapInstanceSchema>{
            schema: gaap[0],
            labels: gaap[1],

            sfp_clreo: gaap[2],
            sfp_cls: gaap[3],
            sfp_dbo: gaap[4],
            sfp_ibo: gaap[5],
            sfp_sbo: gaap[6],
            sfp_ucreo: gaap[7],

            soiPresentation: gaap[8],
            socPresentation: gaap[9]
        }
    });
}


// Render the xbrl document instance according to it's schemas
function parseInstance(xbrl: XBRL, deiSchema: DeiInstanceSchema, gaapSchema: GaapInstanceSchema) {

    // pair up elements with their labels
    let dei = StatementHelpers.CreateStatementNodes(deiSchema.schema.Elements, deiSchema.labels);

    // DEI Sheet
    console.log('starting dei document');
    let deiTables: any[] = [];
    let count = 0;


    for (let presentation of deiSchema.presentation) {
        count += 1;
        let documentNodes = StatementHelpers.PullStatementNodes(presentation.nodes, dei.map);
        let documentValues = StatementHelpers.SelectDeiNodes(documentNodes, xbrl);

        // Seperate the segment values for now...
        removeSegments(documentValues);

        // TODO: combine all the tables into a function...
        let documentTableNodes: StatementDeiNode[] = [];
        for (let value of documentValues) {
            let type = Helpers.FetchLabelType(value.label.Text);

            if (type === 'table') {
                documentTableNodes.push(value);
            }
        }

        console.log(`${count}: matching dei presentation`);
        StatementHelpers.MatchPresentation(presentation.nodes, documentValues);


        console.log(`${count}: formatting dei tables`);
        for (let table of documentTableNodes) {
            let title = Helpers.FetchLabelText(table.label.Text);
            let formattedTable = Format.Table(title, table);

            if (formattedTable.lines.length > 0) {
                deiTables.push(formattedTable);
            }
        }                
    }



    // TODO: seperate the values from the tables
    //       1. create statement nodes
    //       2. seperate the working statement nodes from the total nodes
    //       3. pair the statement nodes with their values
    //       4. then format the nodes

    // pair up elements with their labels
    let gaap = StatementHelpers.CreateStatementNodes(gaapSchema.schema.Elements, gaapSchema.labels);


    console.log('starting balance sheet...');

    // find the root balance sheet node
    let sfpRootTitle = getRootStatementLabel(STMNTS.BalanceSheetRoot, gaap.map);

    let balanceSheetTables: any[] = [];
    count = 0;

    for (let presentation of gaapSchema.sfp_cls) {
        count += 1;
        let balanceSheetNodes = StatementHelpers.PullStatementNodes(presentation.nodes, gaap.map);
        let balanceSheetValues = StatementHelpers.SelectGaapNodes(balanceSheetNodes, xbrl);

        // Seperate the segment values for now...
        removeSegments(balanceSheetValues);


        let shareValues: StatementGaapNode[] = [];

        for (let value of balanceSheetValues) {
            if (TYPES.money !== value.element.type && TYPES.str !== value.element.type) {
                shareValues.push(value);
            }
        }
        for (let value of shareValues) {
            balanceSheetValues.splice(balanceSheetValues.indexOf(value), 1);
        }


        let tableNodes = getTableNodes(balanceSheetValues);


        console.log(`${count}: matching balance sheet presentation`);
        StatementHelpers.MatchPresentation(presentation.nodes, balanceSheetValues);
        
        console.log(`${count}: formatting balance sheet tables`);
        for (let table of tableNodes) {
            let title = `${sfpRootTitle} - ${Helpers.FetchLabelText(table.label.Text)}`;
            let formattedTable = Format.Table(title, table);

            if (formattedTable.lines.length) {
                balanceSheetTables.push(formattedTable);    
            }
        }

        let title = `${sfpRootTitle} - Parenthetical`;
        let formattedTable = Format.FlatTable(title, shareValues);
        if (formattedTable.lines.length) {
            balanceSheetTables.push(formattedTable);
        }
    }
    balanceSheetTables = balanceSheetTables.concat(createStatementTables(xbrl, STMNTS.BalanceSheetRoot, gaap.map, gaapSchema.sfp_clreo));
    balanceSheetTables = balanceSheetTables.concat(createStatementTables(xbrl, STMNTS.BalanceSheetRoot, gaap.map, gaapSchema.sfp_dbo));
    balanceSheetTables = balanceSheetTables.concat(createStatementTables(xbrl, STMNTS.BalanceSheetRoot, gaap.map, gaapSchema.sfp_ibo));
    balanceSheetTables = balanceSheetTables.concat(createStatementTables(xbrl, STMNTS.BalanceSheetRoot, gaap.map, gaapSchema.sfp_sbo));
    balanceSheetTables = balanceSheetTables.concat(createStatementTables(xbrl, STMNTS.BalanceSheetRoot, gaap.map, gaapSchema.sfp_ucreo));


    // Income Statement
    console.log('starting income statement...');
    let incomeSheetTables = createStatementTables(xbrl, STMNTS.IncomeStatementRoot, gaap.map, gaapSchema.soiPresentation);
    
    // Cash Flow Statement
    console.log('starting cash flow statement...');
    let cashFlowTables = createStatementTables(xbrl, STMNTS.CashFlowRoot, gaap.map, gaapSchema.socPresentation);


    return {
        doc: {
            title: 'Document & Entity Information',
            tables: deiTables,
        },
        sfp: {
            title: 'Balance Sheet',
            tables: balanceSheetTables
        },
        soi: {
            title: 'Income Statement',
            tables: incomeSheetTables
        },
        soc: {
            title: 'Cash Flow',
            tables: cashFlowTables
        }        
    }
}


function createStatementTables(xbrl: XBRL, rootName: string, nodes: Map<string, StatementNode>, presentations: PresentationLink[]) {
    let rootTitle = getRootStatementLabel(rootName, nodes);

    let stmntTables: any[] = [];
    let count = 0;

    for (let presentation of presentations) {
        count += 1;
        let stmntNodes = StatementHelpers.PullStatementNodes(presentation.nodes, nodes);
        let stmntValues = StatementHelpers.SelectGaapNodes(stmntNodes, xbrl);

        removeSegments(stmntValues);

        let tableNodes = getTableNodes(stmntValues);

        console.log(`${count}: matching cash flow statement presentation`);
        StatementHelpers.MatchPresentation(presentation.nodes, stmntValues);

        console.log(`${count}: formatting cash flow statement tables`);
        for (let table of tableNodes) {
            let title = `${rootTitle} - ${Helpers.FetchLabelText(table.label.Text)}`;
            let formattedTable = Format.Table(title, table);

            if (formattedTable.lines.length > 0) {
                stmntTables.push(formattedTable);
            }
        }
    }

    return stmntTables;
}

function getRootStatementLabel(name: string, nodes: Map<string, StatementNode>) {
    if (nodes.has(name)) {
        let root = nodes.get(name);
        return Helpers.FetchLabelText(root.label.Text);
    }
    return '';
}
function removeSegments(valueNodes: (StatementGaapNode|StatementDeiNode)[]) {
    // Seperate the segment values for now...
    for (let node of valueNodes) {
        let removeValues: any[] = [];
        for (let value of node.values) {
            // If there is no date or is a segment, mark to remove from the value list
            if (!value.date || value.segment) {
                removeValues.push(value);
            }
        }

        for (let r of removeValues) {
            let values: any = node.values;
            values.splice(values.indexOf(r), 1);
        }
    }
}
function getTableNodes(nodes: StatementValueNode<GaapNode|DeiNode>[]) {
    let tableNodes: StatementValueNode<GaapNode|DeiNode>[] = [];
    for (let value of nodes) {
        if ('table' === Helpers.FetchLabelType(value.label.Text)) {
            tableNodes.push(value);
        }
    }
    return tableNodes;
}






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
