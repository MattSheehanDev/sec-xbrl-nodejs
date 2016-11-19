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

function DFSStatement(root: StatementGaapNode, each: (node: StatementGaapNode) => void) {
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



export function FormatTable(title: string, entity: EntityModel, table: StatementGaapNode) {
    let date = new Date(entity.DocumentDate);

    // every table has [Line Items]?
    let lineItems: StatementGaapNode;
    for (let child of table.children) {
        let match = child.label.Text.match(/([^/[]*)\[(.*)\]$/);
        if (match) {
            let type = match[2].trim().toLowerCase();
            if (type === 'line items') {
                lineItems = child;
                break;
            }
        }
    }

    // find all the dates
    let years: number[] = [];
    DFSStatement(table, (node: StatementGaapNode) => {
        for (let value of node.values) {
            if (!value.year || value.member) continue;

            let idx = years.indexOf(value.year);
            if (idx === -1) {
                years.push(value.year);
            }
        }
    });

    let sortedYears = years.sort((a: number, b: number) => { return b - a; });

    // create and filter statement lines
    let bsLines: StatementLinesHTML[] = [];
    

    DFSStatement(table, (stmntNode: StatementGaapNode) => {
        if (stmntNode.element.name === 'PreferredStockParOrStatedValuePerShare') {
            let s = '';
        }

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
                values.push(formatValue(node, stmntNode.element.type));
                empty = false;
            }
            else {
                values.push('');
            }
        }


        let isTotal = false;
        let isItemHeader = false;

        if (lineItems && lineItems.children.indexOf(stmntNode) !== -1) {
            isItemHeader = true;
        }
        let lineNames = lineItems.children.map((node: StatementGaapNode) => { return node.element.name; });
        if (stmntNode.isTotal && lineNames.indexOf(stmntNode.parent.element.name) !== -1) {
            isTotal = true;
        }


        // don't show empty sections
        if (!empty || isItemHeader) {
            let label = FormatLabelText(stmntNode.label.Text);
            let abstract = IsAbstract(stmntNode.element.name);

            bsLines.push({
                label: label,
                abstract: abstract,
                values: values,
                total: isTotal
            });
        }
    });


    let dates = sortedYears.map((value: number) => {
        date.setFullYear(value);
        return datetime.format(date, 'MMM. dd, yyyy');
    });
    return <StatementHTML>{
        title: title,
        // title: FormatLabelText(table.label.Text),
        dates: dates,
        lines: bsLines
    };
}

export function FormatFlatTable(title: string, entity: EntityModel, nodes: StatementGaapNode[]) {
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


    // create and filter statement lines
    const moneyType = 'xbrli:monetaryItemType';
    const stringType = 'xbrli:stringItemType';
    const sharesType = 'xbrli:sharesItemType';
    const perShareType = 'num:perShareItemType';

    let bsLines: StatementLinesHTML[] = [];
    
    for (let stmntNode of nodes) {
        if (stmntNode.element.name === 'PreferredStockParOrStatedValuePerShare') {
            let s = '';
        }

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
                values.push(formatValue(node, stmntNode.element.type));
                empty = false;
            }
            else {
                values.push('');
            }
        }


        // don't show empty sections
        if (!empty) {
            let label = FormatLabelText(stmntNode.label.Text);
            let abstract = IsAbstract(stmntNode.element.name);

            bsLines.push({
                label: label,
                abstract: abstract,
                values: values,
                total: false
            });
        }
    }

    return <StatementHTML>{ title: title, dates: dates, lines: bsLines };
}




const types = {
    money: 'xbrli:monetaryItemType',
    string: 'xbrli:stringItemType',
    shares: 'xbrli:sharesItemType',
    perShare: 'num:perShareItemType'
}
const units = {
    usd: 'usd',
    usdPerShare: 'usdPerShare',
    shares: 'shares'
}

function formatValue(node: GaapNode, type: string) {
    let value = node.value;

    let formattedValue: string;

    if (types.money === type || types.perShare || types.shares) {
        // let isNegative = node.value < 0;
        // let value = Math.abs(node.value);
                
        // round number according to given decimals and commas
        if (node.decimals) {
            let absValue = Math.abs(value);
            let formatDecimals = FormatDecimals(Math.abs(value), node.decimals);
            formattedValue = FormatWithCommas(formatDecimals.toString());
        }
        else {
            formattedValue = FormatWithCommas(value.toString());
        }
        
        if (value < 0) {
            formattedValue = `(${formattedValue})`;
        }
        if (node.unitRef) {
            if (units.usd === node.unitRef) {
                formattedValue = `$${formattedValue}`;
            }
            else if (units.usdPerShare === node.unitRef) {
                formattedValue = `$${formattedValue} / share`;
            }
        }
    }
    else {
        formattedValue = node.value.toString();
    }

    return formattedValue;
}


function FormatLabelText(text: string) {
    // Some of the labels have brackets at the end, ex. Assets [Abstract],
    // which we won't want to display for the output
    let match = text.match(/([^/[]*)\[(.*)\]$/);
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