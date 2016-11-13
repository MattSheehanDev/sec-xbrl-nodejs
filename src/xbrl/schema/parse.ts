import DFS from '../../utilities/dfs';
import {ImportNode, ElementNode, LabelNode, Presentation, PresentationArcNode} from './nodes';


export namespace Schema {

    
    export function ParseGaapElements(document: Document) {
        let elements: ElementNode[] = [];
        let namespaces = new Map<string, string>();

        DFS(document, (element: Element) => {
            if ('schema' === element.localName) {
                // first get the namespaces
                for (let i = 0; i < element.attributes.length; i++) {
                    let attr = element.attributes[i];

                    if (attr.prefix === 'xmlns') {
                        if(!namespaces.has(attr.localName)) {
                            namespaces.set(attr.localName, attr.value);
                        }
                    }
                }                
            }
            else if ('import' === element.localName) {
                let importNode = new ImportNode(element, namespaces);
            }
            else if ('element' === element.localName) {
                let elementNode = new ElementNode(element, namespaces);
                elements.push(elementNode);
            }
            else if ('annotation' === element.localName) {

            }
        });
        return elements;
    }

    export function ParseGaapLabels(document: Document) {
        let labels: LabelNode[] = [];

        DFS(document, (element: Element) => {
            if ('label' === element.localName) {
                let label = new LabelNode(element);
                labels.push(label);
            }
        });
        return labels;
    }

    // Statement of Financial Position & Parenthetical
    const BalanceSheetRoot = 'StatementOfFinancialPositionAbstract';
    // Income Statement & Other Comprehensive Income
    const IncomeStatementRoot = 'IncomeStatementAbstract';
    // Statement of Stockholders Equity
    const StockholdersEquityRoot = 'StatementOfStockholdersEquityAbstract';
    // Statement of Cash Flows
    const CashFlowRoot = 'StatementOfCashFlowsAbstract';
    // Statement of Direct Cash Flows
    const DirectCashFlowRoot = 'OperatingCashFlowsDirectMethodAbstract';
    // Statement of Partners Capital
    const PartnersCapitalRoot = 'StatementOfPartnersCapitalAbstract';
    

    export function ParseGaapPresentation(document: Document) {
        let presentations: Presentation[] = [];
        let presMap = new Map<string, Presentation>();

        let parents = new Map<string, string[]>();

        // TODO: remove other presentation nodes
        // TODO: maybe 'total' should be handled by the balance sheet node (value?)
        // TODO: remove balance sheet gaap names
        // TODO: check what the currency type is
        // TODO: seperate moneyItemTypes from perShareItemTypes
        //       (balancesheet and parenthetical balancesheet)
        const xlinkNS = 'http://www.w3.org/1999/xlink';

        // parse the document
        DFS(document, (element: Element) => {
            if ('loc' === element.localName) {
                // parse the location element
                let href = element.getAttributeNS(xlinkNS, 'href');
                let label = element.getAttributeNS(xlinkNS, 'label');
                let name = label.substr('loc_'.length);

                let pres = new Presentation(name);
                presentations.push(pres);
                presMap.set(pres.Name, pres)
            }
            if ('presentationArc' === element.localName) {
                let pres = new PresentationArcNode(element);

                if (parents.has(pres.ParentName)) {
                    parents.get(pres.ParentName).push(pres.Name);
                }
                else {
                    parents.set(pres.ParentName, [pres.Name]);
                }
            }
        });

        // Match the parents with their children
        for (let pres of presentations) {
            // check if this node is a parent
            if (!parents.has(pres.Name)) continue;
                
            let children = parents.get(pres.Name);

            for (let childName of children) {
                if (presMap.has(childName)) {
                    let child = presMap.get(childName);
                    
                    child.Parent = pres;
                    pres.Children.push(child);
                }
            }
        }

        // Find the root node
        let root = presentations[0];
        while (root.Parent !== null) {
            root = root.Parent;
        }
        return root;
    }


}
