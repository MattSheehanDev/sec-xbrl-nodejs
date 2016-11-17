import { StatementNode } from './balancesheetnode';
import { StatementTable } from './balancesheettable';
import GaapNode from '../../namespaces/gaapnode';
import { EntityModel } from '../../../models/entitymodel';

import { DateTime as datetime } from '../../../utilities/datetime';
import { Round } from '../../../utilities/utility';


// TODO: Create as `new Object`?
export interface StatementHTML {
    title?: string;
    dates: string[];
    lines: StatementLinesHTML[];
}
export interface StatementLinesHTML {
    label: string;
    abstract: boolean;
    values: string[];
    total: boolean;
}


function FindTable(node: StatementNode): StatementNode | null {
    for (let child of node.children) {
        if (child.element.name === 'StatementLineItems') {
            return child;
        }

        let table = FindTable(child);
        if (table) {
            return table;
        }
    }
    return null;
}


export function FormatBalanceSheet(entity: EntityModel, root: StatementNode, table: StatementTable) {
    // find where the statement table begins
    let tableElement: StatementNode = FindTable(root);

    // find the root table children
    let rootTotals: string[] = [];
    for (let child of tableElement.children) {
        child.statementRoot = true;

        rootTotals.push(child.element.name);
    }

    
    // find the statement title
    let title = FormatLabelText(root.label.Text);

    // find all the dates
    let date = new Date(entity.DocumentDate);
    let sortedYears = table.years.sort((a: number, b: number) => { return b - a; });
    let dates = sortedYears.map((value: number) => {
        date.setFullYear(value);
        return datetime.format(date, 'MMM. dd, yyyy');
    });

    // create and filter statement lines
    let bsLines: StatementLinesHTML[] = [];

    for (let line of table.lines) {
        let values: string[] = [];
        let empty = true;
        for (let year of sortedYears) {
            // TODO: check whether all values are in millions or not
            if (line.Has(year)) {
                let node = line.Get(year);

                let isNegative = node.value < 0;
                let value = Math.abs(node.value);

                let formattedValue: string;
                
                // round number according to given decimals and commas
                if (node.decimals)
                    formattedValue = FormatWithCommas(FormatDecimals(value, node.decimals).toString());
                else
                    formattedValue = FormatWithCommas(value.toString());
                
                if (isNegative) {
                    formattedValue = `(${formattedValue})`;
                }
                if (node.unitRef && node.unitRef === 'usd') {
                    formattedValue = `$${formattedValue}`;
                }

                values.push(formattedValue);
                empty = false;
            }
            else {
                values.push('');
            }
        }


        let isTotal = false;
        let parentName = '';
        if (line.node.parent) {
            parentName = line.node.parent.element.name;
        }  
        if (line.node.parent && rootTotals.indexOf(line.node.parent.element.name) !== -1) {
            isTotal = true;
        }


        // don't show empty sections
        if (!empty || line.node.statementRoot) {
            let label = FormatLabelText(line.node.label.Text);
            let abstract = IsAbstract(line.node.element.name);
        // if (!empty || abstract) {
            bsLines.push({
                label: label,
                abstract: abstract,
                values: values,
                total: isTotal
            });
        }
    }

    return <StatementHTML>{ title: title, dates: dates, lines: bsLines };
}



function FormatLabelText(text: string) {
    // Some of the labels have brackets at the end, ex. Assets [Abstract],
    // which we won't want to display for the output
    let match = text.match(/([^/[]*)\[.*\]$/);
    if (match) {
        return match[1].trim();
    }
    return text;
}
function FormatDecimals(value: number, decimals: number) {
    let len = Math.pow(10, decimals);
    return Math.round(value * len);
}
function FormatWithCommas(value: string) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function IsAbstract(name: string) {
    // Abstract nodes have a name that ends with 'Abstract', ex. AssetsAbstract
    return name.toLowerCase().lastIndexOf('abstract') !== -1
}