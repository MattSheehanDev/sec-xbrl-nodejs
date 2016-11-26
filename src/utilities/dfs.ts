// import { StatementNode } from '../xbrl/statements/balancesheet/balancesheetnode';
import NodeTypes from './nodetypes';


function DFS(doc: Node, each: (node: Element) => void) {
    // let discovered: Node[] = [];

    let start: Element[] = [];
    start.push(<Element>doc);
    while (start.length > 0) {
        let node = start.pop();

        // if (discovered.indexOf(node) !== -1) continue;

        // discovered.push(node);

        // do anything important with this node here
        each(node);

        if (node.hasChildNodes()) {
            for (let i = 0; i < node.childNodes.length; i++) {
                let child = node.childNodes.item(i);
                if (NodeTypes.ELEMENT_NODE === child.nodeType) {
                    start.push(<Element>child);
                }
            }
        }
    }
}

function DFSRecursive(node: Node, each: (node: Node) => void) {
    each(node);

    if (node.hasChildNodes()) {
        for (let i = 0; i < node.childNodes.length; i++) {
            let child = node.childNodes.item(i);

            if (NodeTypes.ELEMENT_NODE === child.nodeType) {
                DFSRecursive(child, each);
            }
        }
    }
}


// export function DFSBalanceSheet(root: StatementNode, each: (node: StatementNode) => void) {
//     // let discovered: BalanceSheetNode[] = [];

//     let start: StatementNode[] = [];
//     start.push(root);

//     while(start.length > 0) {
//         let node = start.pop();

//         // if (discovered.indexOf(node) !== -1) continue;

//         // discovered.push(node);

//         // do anything important with this node here
//         each(node);

//         for (let i = 0; i < node.children.length; i++) {
//             start.push(node.children[i]);
//         }
//     }
// }

// export function DFSBalanceSheetValue(root: BalanceSheetLine, each: (node: BalanceSheetLine) => void) {
//     let discovered: BalanceSheetLine[] = [];

//     let start: BalanceSheetLine[] = [];
//     start.push(root);

//     while(start.length > 0) {
//         let node = start.pop();

//         if (discovered.indexOf(node) !== -1) continue;

//         discovered.push(node);

//         // do anything important with this node here
//         each(node);

//         for (let i = 0; i < node.children.length; i++) {
//             start.push(node.children[i]);
//         }
//     }
// }


export default DFS;
