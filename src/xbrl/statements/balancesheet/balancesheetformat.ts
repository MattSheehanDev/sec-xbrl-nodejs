import { StatementNode, StatementGaapNode } from '../statementnode';
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


function FindTable(nodes: StatementGaapNode[]): StatementGaapNode | null {
    for (let node of nodes) {
        if (node.element.name === 'StatementLineItems') {
            return node;
        }
    }
    return null;
}

export function DFSStatement(root: StatementGaapNode, each: (node: StatementGaapNode) => void) {
    let start: StatementGaapNode[] = [];
    start.push(root);

    while(start.length > 0) {
        let node = start.pop();

        // do anything important with this node here
        each(node);

        for (let i = 0; i < node.children.length; i++) {
            start.push(node.children[i]);
        }
    }
}


export function FormatBalanceSheetMoney(entity: EntityModel, nodes: StatementGaapNode[]) {
    let date = new Date(entity.DocumentDate);

    // find where the statement table begins
    let tableElement: StatementGaapNode = FindTable(nodes);

    // find the root table children
    let rootTotals: string[] = [];
    for (let child of tableElement.children) {
        child.statementRoot = true;

        rootTotals.push(child.element.name);
    }

    // find all the dates
    let years: number[] = [];
    for (let node of nodes) {
        for (let value of node.values) {
            if (!value.year || value.member) continue;

            let idx = years.indexOf(value.year);
            if (idx === -1) {
                years.push(value.year);
            }
        }
    }

    let sortedYears = years.sort((a: number, b: number) => { return b - a; });
    let dates = sortedYears.map((value: number) => {
        date.setFullYear(value);
        return datetime.format(date, 'MMM. dd, yyyy');
    });


    // find the statement title
    let titleNode: StatementGaapNode = tableElement;
    while (titleNode.parent) {
        titleNode = titleNode.parent;
    }
    let title = FormatLabelText(titleNode.label.Text);


    // create and filter statement lines
    let bsLines: StatementLinesHTML[] = [];

    DFSStatement(tableElement, (stmntNode: StatementGaapNode) => {
        let values: string[] = [];
        let empty = true;
        for (let year of sortedYears) {
            let node: GaapNode;
            for (let n of stmntNode.values) {
                if (n.year === year && !n.member) {
                    node = n;
                    break;
                }
            }

            if (node) {
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
        if (stmntNode.parent) {
            parentName = stmntNode.parent.element.name;
        }  
        if (stmntNode.parent && rootTotals.indexOf(stmntNode.parent.element.name) !== -1) {
            isTotal = true;
        }


        // don't show empty sections
        if (!empty || stmntNode.statementRoot) {
            let label = FormatLabelText(stmntNode.label.Text);
            let abstract = IsAbstract(stmntNode.element.name);
        // if (!empty || abstract) {
            bsLines.push({
                label: label,
                abstract: abstract,
                values: values,
                total: isTotal
            });
        }
    });

    return <StatementHTML>{ title: title, dates: dates, lines: bsLines };
}


export function FormatBalanceSheetShares(entity: EntityModel, nodes: StatementGaapNode[]) {
    let date = new Date(entity.DocumentDate);


    // find all the dates
    let years: number[] = [];
    for (let node of nodes) {
        for (let value of node.values) {
            if (!value.year || value.member) continue;

            let idx = years.indexOf(value.year);
            if (idx === -1) {
                years.push(value.year);
            }
        }
    }

    let sortedYears = years.sort((a: number, b: number) => { return b - a; });
    let dates = sortedYears.map((value: number) => {
        date.setFullYear(value);
        return datetime.format(date, 'MMM. dd, yyyy');
    });


    let title = 'Statement of Financial Position (Parenthetical)';


    // create and filter statement lines
    let bsLines: StatementLinesHTML[] = [];

    for (let stmntNode of nodes) {
        let values: string[] = [];
        let empty = true;
        for (let year of sortedYears) {
            let node: GaapNode;
            for (let n of stmntNode.values) {
                if (n.year === year && !n.member) {
                    node = n;
                    break;
                }
            }

            if (node) {
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
        if (stmntNode.parent) {
            parentName = stmntNode.parent.element.name;
        }
        // if (stmntNode.parent && rootTotals.indexOf(stmntNode.parent.element.name) !== -1) {
        //     isTotal = true;
        // }


        // don't show empty sections
        if (!empty || stmntNode.statementRoot) {
            let label = FormatLabelText(stmntNode.label.Text);
            let abstract = IsAbstract(stmntNode.element.name);
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