import {TenKValues, TenK} from '../models/tenk';
import gaap from './gaap';
import XBRL from './xbrl';

import xpath = require('xpath');


export module AnnualReport {


    export function Create10K(xbrl: XBRL, year: number) {
        let tenk: TenKValues = {
            year: year,
            totalRevenue: totalRevenue(xbrl, year),
            netIncome: netIncome(xbrl, year),
            eps: earningsPerShare(xbrl, year),
            dilutedEps: dilutedEarningsPerShare(xbrl, year),
            declaredDividend: declaredDividend(xbrl, year),
            outstandingShares: outstandingShares(xbrl, year),
            dilutedOutstandingShares: dilutedOutstandingShares(xbrl, year),
            prefOutstandingShares: preferredOutstandingShares(xbrl, year),
            currentAssets: currentAssets(xbrl, year),
            currentLiab: currentLiabilities(xbrl, year),
            longTermDebt: longTermDebt(xbrl, year)
        }
        return new TenK(tenk);
    }
    function totalRevenue(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.TotalRevenue, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function netIncome(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.NetIncome, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function earningsPerShare(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.EarningsPerShare, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function dilutedEarningsPerShare(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.DilutedEarningsPerShare, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function declaredDividend(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.DeclaredDividend, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }

    function outstandingShares(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.OutstandingShares, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function dilutedOutstandingShares(xbrl: XBRL, year: number) {
        let nodes: Element[] = gaap.Select(gaap.DilutedOutstandingShares, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }

    function preferredOutstandingShares(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.PreferredOutstandingShares, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function currentAssets(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.CurrentAssets, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function currentLiabilities(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.CurrentLiabilities, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }
    function longTermDebt(xbrl: XBRL, year: number) {
        let nodes = gaap.Select(gaap.LongTermDebt, xbrl.gaapRoot);
        return AccumulateValues(nodes, year);
    }



    function ExtractYear(date: string) {
        let match: RegExpMatchArray;
        let year = -1;
        
        if (match = date.match(/^(?:FD|FI)(\d{4})Q4(YTD)?$/i)) {
            year = parseInt(match[1]);
        }
        else if (match = date.match(/^d(\d{4})$/i)) {
            year = parseInt(match[1]);
        }
        else if (match = date.match(/^d(\d{4})q(\d{1})(ytd)?$/i)) {
            year = parseInt(match[1]);
        }
        return year;
    }

    // TODO: move this so that we don't have to import xpath
    function AccumulateValues(nodes: any[], year: number) {
        let sum = 0;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            let ref = xpath.select('@contextRef', node)[0];
            let nodeYear = ref != null ? ExtractYear(ref.value) : 0;
            let nodeValue = parseFloat(node.firstChild.data);

            if (year === nodeYear && !isNaN(nodeValue)) {
                sum += nodeValue;
            }
        }
        return sum;
    }

}


export default AnnualReport;
