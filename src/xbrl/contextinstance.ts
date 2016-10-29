import xpath = require('xpath');

// export function StartDate (year: number) {
//     let id = `FD${year}Q4YTD`;
//     return `//xbrli:xbrl/xbrli:context[@id="${id}"]/xbrli:period/xbrli:startDate`;
// }
// const EndDate = '//xbrli:xbrl/xbrli:context[@id=""]/xbrli:period/xbrli:endDate';

module ContextInstance {

    const Context = `//xbrli:xbrl/xbrli:context`;
    const StartDate = `//xbrli:xbrl/xbrli:context/xbrli:period/xbrli:startDate`;
    const EndDate = '//xbrli:xbrl/xbrli:context/xbrli:period/xbrli:endDate';


    export function GetYears(document: Document) {
        let select = xpath.useNamespaces({ xbrli: 'http://www.xbrl.org/2003/instance' });
        let nodes = select(Context, document);

        let years: number[] = [];

        for (let node of nodes) {
            let id = select('@id', node)[0];
            let value = id ? id.nodeValue : '';
            
            let fiscalYear = getIdYear(value);

            if (fiscalYear !== -1 && !isNaN(fiscalYear) && years.indexOf(fiscalYear) === -1) {
                years.push(fiscalYear);
            }
        }
        return years.sort().reverse();
        // for (let node of nodes) {
        //     let startDateNode = node;
        //     let endYear = getNodeYear(startDateNode);

        //     if (endYear && !isNaN(endYear) && years.indexOf(endYear) === -1) {
        //         year = Math.max(year, endYear);
        //         years.push(endYear);
        //     }
        // }
        // return year;
        // let select = xpath.useNamespaces({ xbrli: 'http://www.xbrl.org/2003/instance' });
        // let nodes = select(StartDate, document);

        // let year = 0;
        // let years: number[] = [];

        // for (let node of nodes) {
        //     let startDateNode = node;
        //     let endYear = getNodeYear(startDateNode);

        //     if (endYear && !isNaN(endYear) && years.indexOf(endYear) === -1) {
        //         year = Math.max(year, endYear);
        //         years.push(endYear);
        //     }
        // }
        // return year;
    }

    function getIdYear(date: string) {
        let match: RegExpMatchArray;
        let year = -1;
        
        if (match = date.match(/^FD(\d{4})Q4YTD?$/i)) {
            year = parseInt(match[1]);
        }
        return year;
    }
    // function getNodeYear(node: any) {
    //     let nodeDate: string = node.firstChild.data || '';

    //     let match: RegExpMatchArray = nodeDate.match(/^(\d{4})-(\d{2})-(\d{2})$/i);
    //     if (match) {
    //         return parseInt(match[1]);
    //     }
    // }

}

export default ContextInstance;