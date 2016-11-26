

export default class XPathParser {

    private _document: Document|Element;
    private _select: (s: string, el: Document|Element) => Element[];
    
    public readonly targetNS: string;
    public readonly prefix: string;

    constructor(element: Document|Element, select: any, ns: string, prefix: string) {
        this._document = element;
        this._select = select;

        this.targetNS = ns;
        this.prefix = prefix;
    }

    public All(): Element[] {
        return this._select(`//*[namespace-uri()='${this.targetNS}']`, this._document);
    }
    public Select(names: string|string[]) {
        if (Array.isArray(names)) {
            return this.selectFromArray(names);
        }

        let nodes = this.selectUsingNS(names);
        if (nodes.length)
            return nodes;

        nodes = this.selectUsingPrefix(names);
        if (nodes.length)
            return nodes;

        return [];        
    }

    private selectFromArray(names: string[]) {
        let nodes: Element[] = [];
        for (let name of names) {
            nodes = nodes.concat(this.selectUsingNS(name));
        }

        if (nodes && nodes.length > 0) return nodes;

        for (let name of names) {
            nodes = nodes.concat(this.selectUsingPrefix(name));
        }
        return nodes;
    }

    private selectUsingNS(name: string): Element[] {
        let usingNS = `//*[local-name()='${name}' and namespace-uri()='${this.targetNS}']`;
        return this._select(usingNS, this._document);
    }
    private selectUsingPrefix(name: string): Element[] {
        let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), '${this.prefix}')]`;
        return this._select(usingPrefix, this._document);
    }

}
