import {ElementNode} from '../../schema/schemanodes';
import {LabelNode} from '../../schema/linkbasenodes';

import {StatementNode, StatementValueNode, StatementGaapNode, StatementDeiNode} from './statementnode';

import XBRLDocument from '../instance/xbrl'; 
import {Presentation} from '../../schema/linkbasenodes';
import GaapNode from '../namespaces/gaapnode';
import DeiNode from '../namespaces/deinode';


namespace StatementHelpers {


    export function CreateStatementNodes(elements: ElementNode[], labels: LabelNode[]) {
        let labelNames = labels.map((node: LabelNode) => { return node.MatchingElement; });

        let nodes: StatementNode[] = [];
        let map = new Map<string, StatementNode>();

        for (let element of elements) {
            // find matching label
            let index = labelNames.indexOf(element.name);
            let label = index !== -1 ? labels[index] : null;

            let stmntNode = new StatementNode(element, label);

            nodes.push(stmntNode);
            map.set(element.name, stmntNode);
        }

        return { nodes: nodes, map: map };
    }

    export function PullStatementNodes(presentations: Presentation[], nodes: Map<string, StatementNode>) {
        let pulled: StatementNode[] = [];
        for (let p of presentations) {
            if (nodes.has(p.Name)) {
                pulled.push(nodes.get(p.Name));
            }
        }
        return pulled;
    }

    export function SelectGaapNodes(nodes: StatementNode[], xbrl: XBRLDocument) {
        let values: StatementGaapNode[] = [];

        for (let node of nodes) {
            let gaaps: GaapNode[] = [];

            let elements = xbrl.GaapParser.Select(node.element.name);
            for (let element of elements) {
                gaaps.push(new GaapNode(element, xbrl.ContextNodes));
            }

            values.push(new StatementGaapNode(node, gaaps));
        }
        return values;
    }

    export function SelectDeiNodes(nodes: StatementNode[], xbrl: XBRLDocument) {
        let values: StatementDeiNode[] = [];

        for (let node of nodes) {
            let deis: DeiNode[] = [];

            let elements = xbrl.DeiParser.Select(node.element.name);
            for (let element of elements) {
                deis.push(new DeiNode(element, xbrl.ContextNodes));
            }

            values.push(new StatementDeiNode(node, deis));
        }
        return values;
    }

    export function MatchPresentation(presentations: Presentation[], nodes: StatementValueNode<any>[]) {
        let presNames = new Map<string, Presentation>();
        for (let pres of presentations) {
            presNames.set(pres.Name, pres);
        }

        let nodeNames = new Map<string, StatementGaapNode>();
        for (let node of nodes) {
            nodeNames.set(node.element.name, node);
        }

        for (let node of nodes) {
            let presentation = presNames.get(node.element.name);
            node.isTotal = presentation.isTotal;

            for (let name of presentation.Children) {
                if (!nodeNames.has(name)) continue;

                let childStmntNode = nodeNames.get(name);

                childStmntNode.parent = node;
                node.children.push(childStmntNode);
            }
        }

        return nodes;
    }


}


export default StatementHelpers;


// export function MatchStatementPresentation(root: Presentation, nodes: StatementNode[]) {
//     let nodeNames = nodes.map((node: StatementNode) => { return node.element.name; });
//     return matchStatementPresentationRecurse(root, nodes, nodeNames);
// }

// function matchStatementPresentationRecurse(root: Presentation, nodes: StatementNode[], nodeNames: string[]) {
//     // find matching element
//     let index = nodeNames.indexOf(root.Name);
//     let node = index !== -1 ? nodes[index] : null;


//     for (let child of root.Children) {
//         let childStmntNode = matchStatementPresentationRecurse(child, nodes,  nodeNames);

//         childStmntNode.parent = node;
//         node.children.push(childStmntNode);
//     }

//     return node;
// }
