import { BalanceSheetLine, BalanceSheetNode, ConsBalanceSheetLine } from './balancesheetnode';
import { EntityModel } from '../../../models/entitymodel';
import { DateTime as datetime } from '../../../utilities/datetime';


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


function FindTable(node: BalanceSheetNode): BalanceSheetNode | null {
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

export function Format(entity: EntityModel, root: BalanceSheetNode, lines: ConsBalanceSheetLine[]) {
    // find where the statement table begins
    let table: BalanceSheetNode = FindTable(root);

    // find the root table children
    let rootTotals: string[] = [];
    for (let child of table.children) {
        child.statementRoot = true;

        rootTotals.push(child.element.name);
        // if (child.presentation) {
        //     rootTotals.push(child.presentation.Name);
        // }
    }

    
    // find the statement title
    let title = root.label.FormattedText;

    // find all the dates
    let date = new Date(entity.DocumentDate);
    let sortedYears = ConsBalanceSheetLine.years.sort((a: number, b: number) => { return b - a; });
    let dates = sortedYears.map((value: number) => {
        date.setFullYear(value);
        return datetime.format(date, 'MMM. dd, yyyy');
    });

    // create and filter statement lines
    let bsLines: StatementLinesHTML[] = [];
    let parentChildren = new Map<BalanceSheetLine, StatementLinesHTML>();

    for (let line of lines) {
        let label = line.node.label.FormattedText;
        let abstract = line.node.element.name.toLowerCase().lastIndexOf('abstract') !== -1;
        let values: string[] = [];
        let empty = true;
        for (let year of sortedYears) {
            let column = line.Get(year);
            if (column.value) {
                values.push(column.value.toString());
                empty = false;
            }
            else {
                values.push('');
            }
        }


        let isTotal = false;
        // let index = rootTotals.indexOf(line.node.presentation.Name);
        // if (index !== -1) {
        //     isTotal = true;
        // }
        // if (line.node.presentation && rootTotals.indexOf(line.node.presentation.ParentName) !== -1) {
        //     isTotal = line.node.presentation.isTotal;
        // }
        if (line.node.parent && rootTotals.indexOf(line.node.parent.element.name) !== -1) {
            isTotal = true;
        }


        // don't show empty sections
        if (!empty || line.node.statementRoot) {
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