import Attributes from '../attributes';
import { StatementNode, StatementValueNode, StatementGaapNode, StatementDeiNode } from './statementnode';
import ContextNode from '../instance/contextnode';
import GaapNode from '../instance/gaapnode';
import DeiNode from '../instance/deinode';

import Helpers from '../helpers';
import { DateTime as datetime } from '../../utilities/datetime';
import { Round } from '../../utilities/utility';


const TYPES = Attributes.types;
const UNITS = Attributes.units;


// TODO: Create as `new Object`? Maybe rename?
export interface StatementHTML {
    title?: string;
    dates: string[];
    lines: StatementLinesHTML[];
}
export interface StatementLinesHTML {
    values: string[];
    label: string;
    header: boolean;
    total: boolean;
}



namespace Format {

    function findUniqueDates(table: StatementGaapNode|StatementDeiNode) {
        // find all the dates
        let dates: Date[] = [];
        DFSStatement(table, (node: StatementGaapNode) => {
            for (let value of node.values) {
                if (!value.date) continue;

                let idx = dates.indexOf(value.date);
                if (idx === -1) {
                    dates.push(value.date);
                }
            }
        });
        dates = dates.sort((a: Date, b: Date) => {
            return b.getTime() - a.getTime();
        });
        return dates;        
    }
    function findUniqueDatesFlat(nodes: StatementGaapNode[]|StatementDeiNode[]) {
        // find all the dates
        let dates: Date[] = [];
        for (let node of nodes) {
            for (let value of node.values) {
                if (!value.date) continue;

                let idx = dates.indexOf(value.date);
                if (idx === -1) {
                    dates.push(value.date);
                }
            }
        }
        dates = dates.sort((a: Date, b: Date) => {
            return b.getTime() - a.getTime();
        });
        return dates;
    }


    export function Table(title: string, table: StatementValueNode<any>) {

        // every table has [Line Items]?
        let lineItems: StatementGaapNode;
        for (let child of table.children) {
            let type = Helpers.FetchLabelType(child.label.Text);
            if (type === 'line items') {
                lineItems = child;
                break;
            }
        }
        let lineNames = lineItems.children.map((node: StatementGaapNode) => { return node.element.name; });


        // find all the dates
        let dates = findUniqueDates(table);


        // create and filter statement lines
        let bsLines: StatementLinesHTML[] = [];


        DFSStatement(table, (stmntNode: StatementGaapNode) => {
            // let v: {
            //     output: string;
            //     context: ContextNode,
            //     class: string;
            // }[] = [];
            let values: string[] = [];
            let empty = true;

            for (let date of dates) {
                let node: GaapNode;
                for (let n of stmntNode.values) {
                    if (n.date === date) {
                        node = n;
                        break;
                    }
                }

                if (node) {
                    values.push(formatValue(node, stmntNode.element.type));
                    empty = false;
                    // v.push({
                    //     output: formatValue(node, stmntNode.element.type),
                    //     context: node.context,
                    //     class: ''
                    // });
                }
                else {
                    values.push('');
                    // v.push({ output: '', context: null, class: '' });
                }
            }


            let isTotal = false;
            let isItemHeader = false;

            // check if this node is an item header
            if (lineItems) {
                // in order for a line item to be a header (ex. Assets, Liabilities and Equity),
                // then it must be a child of the lineItems node,
                // must be a string type, and must have children of it's own
                let isChild = lineItems.children.indexOf(stmntNode) !== -1;
                let isString = stmntNode.element.type === TYPES.str;
                let hasChildren = stmntNode.children.length > 0;

                isItemHeader = isChild && isString && hasChildren;
            }
            if (stmntNode.isTotal && lineNames.indexOf(stmntNode.parent.element.name) !== -1) {
                isTotal = true;
            }


            // don't show empty sections
            if (!empty || isItemHeader) {
                // let label = Helpers.FetchLabelText(stmntNode.label.Text);
                // let abstract = IsAbstract(stmntNode.element.name);

                // for (let value of v) {
                //     if (value.context.period.type === 'duration') {
                //         let start = value.context.period.start.getTime();
                //         let end = value.context.period.end.getTime();
                //         let diff = end - start;

                //         for (let value2 of v) {
                //             if (value === value2) continue;

                //             if (value.context.period.type === 'duration') {
                //                 let start2 = value.context.period.start.getTime();
                //                 let end2 = value.context.period.end.getTime();
                //                 let diff2 = end2 - start2;

                //                 if (end2 <= end && start2 >= start) {
                //                     value.class = 'quarter';
                //                 }
                //             }
                //         }
                //     }
                // }

                bsLines.push({
                    label: Helpers.FetchLabelText(stmntNode.label.Text),
                    header: isItemHeader,
                    values: values,
                    total: isTotal
                });
            }
        });


        return <StatementHTML>{
            title: title,
            dates: dates.map((value: Date) => { return datetime.format(value, 'MMM. dd, yyyy'); }),
            lines: bsLines
        };
    }

    export function FlatTable(title: string, nodes: StatementValueNode<any>[]) {

        // find all the dates
        let dates: Date[] = findUniqueDatesFlat(nodes);


        let bsLines: StatementLinesHTML[] = [];

        for (let stmntNode of nodes) {

            let values: string[] = [];
            let empty = true;

            for (let date of dates) {
                let node: GaapNode;
                for (let n of stmntNode.values) {
                    if (n.date === date) {
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
                // let label = Helpers.FetchLabelText(stmntNode.label.Text);
                // let abstract = IsAbstract(stmntNode.element.name);

                bsLines.push({
                    label: Helpers.FetchLabelText(stmntNode.label.Text),
                    header: false,
                    values: values,
                    total: false
                });
            }
        }

        return <StatementHTML>{
            title: title,
            dates: dates.map((value: Date) => { return datetime.format(value, 'MMM. dd, yyyy'); }),
            lines: bsLines
        };
    }


}


export default Format;



function DFSStatement(root: StatementValueNode<GaapNode|DeiNode>, each: (node: StatementValueNode<GaapNode|DeiNode>) => void) {
    let start: StatementValueNode<GaapNode|DeiNode>[] = [];
    start.push(root);

    while (start.length > 0) {
        let node = start.pop();

        // do anything important with this node here
        each(node);

        for (let i = 0; i < node.children.length; i++) {
            start.push(node.children[i]);
        }
    }
}


function formatValue(node: GaapNode, type: string) {
    let value = node.value;

    let formattedValue: string;

    if (TYPES.money === type || TYPES.perShare === type || TYPES.shares === type) {
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
            if (UNITS.usd === node.unitRef) {
                formattedValue = `$${formattedValue}`;
            }
            else if (UNITS.usdPerShare === node.unitRef) {
                formattedValue = `$${formattedValue} / share`;
            }
        }
    }
    else {
        formattedValue = node.value.toString();
    }

    return formattedValue;
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