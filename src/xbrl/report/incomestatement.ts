import { Taxonomy as taxon, Query as query } from '../namespaces/gaap';
import { SumNodes } from '../namespaces/xmlns';
import XBRL from '../xbrl';


export module IncomeStatementXBRL {

    export function NetRevenue(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.NetRevenue, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

    export function GrossProfit(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.GrossProfit, xbrl.gaapRoot);
        let grossProfit = SumNodes(nodes, year);

        if (grossProfit !== 0) return grossProfit;

        let revenue = query.Select(taxon.NetRevenue, xbrl.gaapRoot);
        let cost = query.Select(taxon.CostOfRevenue, xbrl.gaapRoot);
        return SumNodes(revenue, year) - SumNodes(cost, year);
    }

    export function OperatingProfit(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.OperatingProfit, xbrl.gaapRoot);
        let profit = SumNodes(nodes, year);

        if (profit !== 0) return profit;

        let opex = query.Select(taxon.OperatingExpenses, xbrl.gaapRoot);
        return GrossProfit(xbrl, year) - SumNodes(opex, year);
    }

    export function OperatingIncomeBeforeTax(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.OperatingIncomeBeforeTax, xbrl.gaapRoot);
        let income = SumNodes(nodes, year);

        if (income !== 0) return income;

        nodes = query.Select(taxon.InterestExpenseNet, xbrl.gaapRoot);
        let interestExpense = SumNodes(nodes, year);

        nodes = query.Select(taxon.DebtExtinguishmentGainsLosses, xbrl.gaapRoot);
        let debtExtinguishment = SumNodes(nodes, year);

        return OperatingProfit(xbrl, year) - interestExpense - debtExtinguishment;
    }

    export function OperatingIncomeAfterTax(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.OperatingIncomeAfterTax, xbrl.gaapRoot);
        let income = SumNodes(nodes, year);

        if (income !== 0) return income;

        nodes = query.Select(taxon.IncomeTaxProvision, xbrl.gaapRoot);
        let incomeTax = SumNodes(nodes, year);

        return OperatingIncomeBeforeTax(xbrl, year) - incomeTax;
    }

    export function NetIncome(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.NetIncome, xbrl.gaapRoot);
        let income = SumNodes(nodes, year);

        if (income !== 0) return income;

        nodes = query.Select(taxon.IncomeFromDiscontinuedOperations, xbrl.gaapRoot);
        let discontinuedIncome = SumNodes(nodes, year);

        return OperatingIncomeAfterTax(xbrl, year) - discontinuedIncome;
    }

    export function NetIncomeAvailable(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.NetIncomeAvailable, xbrl.gaapRoot);
        let netIncome = SumNodes(nodes, year);

        if (netIncome !== 0) return netIncome;

        nodes = query.Select(taxon.NetIncomeFromNonControllingInterest, xbrl.gaapRoot);
        let nonControllingNet = SumNodes(nodes, year);

        return NetIncome(xbrl, year) - nonControllingNet;
    }

    export function OtherComprehensiveIncome(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.OtherComprehensiveIncomeAdj, xbrl.gaapRoot);
        let otherIncome = SumNodes(nodes, year);

        if (otherIncome !== 0) return otherIncome;

        nodes = query.Select(taxon.OtherForeignIncomeAdj, xbrl.gaapRoot);
        let foreignIncome = SumNodes(nodes, year);

        nodes = query.Select(taxon.OtherDerivativeIncomeAdj, xbrl.gaapRoot);
        let derivativeIncome = SumNodes(nodes, year);

        nodes = query.Select(taxon.OtherPensionIncomeAdj, xbrl.gaapRoot);
        let pensionIncome = SumNodes(nodes, year);

        return foreignIncome + derivativeIncome - pensionIncome;
    }

    export function NetIncomeComprehensiveControlling(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.NetIncomeComprehensiveControlling, xbrl.gaapRoot);
        let netIncome = SumNodes(nodes, year);

        if (netIncome !== 0) return netIncome;

        return NetIncomeAvailable(xbrl, year) + OtherComprehensiveIncome(xbrl, year);
    }

    export function NetIncomeComprehensiveNonControlling(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.NetIncomeComprehensiveNonControlling, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

    export function NetIncomeComprehensiveTotal(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.NetIncomeComprehensiveTotal, xbrl.gaapRoot);
        let netIncome = SumNodes(nodes, year);

        if (netIncome !== 0) return netIncome;

        return NetIncomeComprehensiveControlling(xbrl, year) + NetIncomeComprehensiveNonControlling(xbrl, year);
    }

    export function EarningsPerShare(xbrl: XBRL, year: number) {
        // TODO: calculate these manually too?
        let nodes = query.Select(taxon.EarningsPerShare, xbrl.gaapRoot);
        let eps = SumNodes(nodes, year);

        if (eps !== 0) return eps;

        nodes = query.Select(taxon.OperatingIncomePerShare, xbrl.gaapRoot);
        let operatingIncomePerShare = SumNodes(nodes, year);

        nodes = query.Select(taxon.DiscontinuedOperatingIncomePerShare, xbrl.gaapRoot);
        let discontinuedIncomePerShare = SumNodes(nodes, year);

        return operatingIncomePerShare + discontinuedIncomePerShare;
    }

    export function EarningsPerShareDiluted(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.EarningsPerShareDiluted, xbrl.gaapRoot);
        let eps = SumNodes(nodes, year);

        if (eps !== 0) return eps;

        nodes = query.Select(taxon.OperatingIncomePerShareDiluted, xbrl.gaapRoot);
        let operatingIncomePerShare = SumNodes(nodes, year);

        nodes = query.Select(taxon.DiscontinuedOperatingIncomePerShareDiluted, xbrl.gaapRoot);
        let discontinuedIncomePerShare = SumNodes(nodes, year);

        return operatingIncomePerShare + discontinuedIncomePerShare;
    }

    export function DividendDeclared(xbrl: XBRL, year: number) {
        let nodes = query.Select(taxon.DividendDeclared, xbrl.gaapRoot);
        return SumNodes(nodes, year);
    }

}
