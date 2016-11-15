import DFS from '../utilities/dfs';
import {ImportNode, ElementNode} from './schemanodes';


// schema documents end in .xsd
export function ParseSchemaDocument(document: Document) {
    let targetNS: string;
    let namespaces = new Map<string, string>();

    let elements: ElementNode[] = [];
    let imports: ImportNode[] = [];

    DFS(document, (element: Element) => {
        if ('schema' === element.localName) {
            targetNS = element.getAttributeNS(null, 'targetNamespace');

            for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes[i];

                if ('xmlns' === attr.prefix) {
                    if (!namespaces.has(attr.localName)) {
                        namespaces.set(attr.localName, attr.value);
                    }
                }
            }
        }
        else if ('element' === element.localName) {
            let elementNode = new ElementNode(element, namespaces);
            elements.push(elementNode);
        }
        else if ('import' === element.localName) {
            let importNode = new ImportNode(element, namespaces);
            imports.push(importNode);
        }
        else if ('annotation' === element.localName) {

        }
    });

    return new SchemaDocument(targetNS, elements, imports);
}



export class SchemaDocument {

    private _targetNS: string;
    private _elements: ElementNode[];
    private _imports: ImportNode[];

    public get TargetNS() { return this._targetNS; }
    public get Imports() { return this._imports; }
    public get Elements() { return this._elements; }

    constructor(targetNS: string, elements: ElementNode[], imports: ImportNode[]) {
        this._targetNS = targetNS;
        this._elements = elements;
        this._imports = imports;
    }

}
