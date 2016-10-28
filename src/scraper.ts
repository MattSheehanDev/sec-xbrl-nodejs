import cheerio = require('cheerio');


module Scraper {

    export interface SECFiling {
        formType: string;
        url: string;
        desc: string;
        desc2: string;
        date: string;
        fileUrl: string;
        fileNum: string;                // often null
        filmNum: string;                // often null
    }

    export interface SECForm {
        title: string;
        url: string;
        name: string
        type: string;
        size: string;
    }


    export function Filings(body: string) {       
        let filings: SECFiling[] = [];

        let doc = cheerio.load(body);
        let rows = <CheerioElement[]><any>doc('.tableFile2').children();

        // First row is the table header
        for (let i = 1; i < rows.length; i++) {
            let row: any = rows[i];
            
            // The data is nested in the tables in a very awkward structure. There are lots of
            // cells in the table that are basically entry so the location of the right data
            // has to unfortunately be statically typed.
            let filingMeta: SECFiling = {
                formType: row.children[1].children[0].data,
                url: row.children[3].children[0].attribs.href,
                desc: row.children[5].children[0].data,
                desc2: row.children[5].children[2].data,
                date: row.children[7].children[0].data,
                fileUrl: row.children[9].children[0] ? row.children[9].children[0].attribs.href : null,
                fileNum: row.children[9].children[0] ? row.children[9].children[0].children[0].data : null,
                filmNum: row.children[9].children[2] ? row.children[9].children[2].data.trim() : null
            }
            filings.push(filingMeta);            
        }
        return filings;
    }
    
    
    export function Forms(body: string) {
        let forms: SECForm[] = [];

        let doc = cheerio.load(body);
        let rows = <CheerioElement[]><any>doc('table[summary="Data Files"]').children();

        for (let i = 1; i < rows.length; i++) {
            let row: any = rows[i];

            let formMeta: SECForm = {
                title: row.children[3].children[0].data,
                url: row.children[5].children[0].attribs.href,
                name: row.children[5].children[0].children[0].data,
                type: row.children[7].children[0].data,
                size: row.children[9].children[0].data
            };
            forms.push(formMeta);            
        }
        return forms;
    }

}


export default Scraper;