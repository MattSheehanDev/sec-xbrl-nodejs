import { SelectNS } from './namespaces/xmlns';


// DEI
// Document Entity Information


// <xs:element id="dei_AccountingAddressMember" name="AccountingAddressMember" nillable="true" substitutionGroup="xbrli:item" type="nonnum:domainItemType" xbrli:periodType="duration" abstract="true"/>
// <xs:element id="dei_DocumentPeriodEndDate" name="DocumentPeriodEndDate" nillable="true" substitutionGroup="xbrli:item" type="xbrli:dateItemType" xbrli:periodType="duration"/>
// <dei:DocumentPeriodEndDate contextRef="FD2014Q4YTD" id="Fact-DF620ECE92082777F26B9F284C9CBF73">2014-12-31</dei:DocumentPeriodEndDate>


export default class XPathParser {

    private _document: Document|Element;
    private _namespace: string;
    private _prefix: string;

    constructor(element: Document|Element, ns: string, prefix: string) {
        this._document = element;
        this._namespace = ns;
        this._prefix = prefix;
    }

    public All(): Element[] {
        return SelectNS(`//*[namespace-uri()='${this._namespace}']`, this._document);
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
        let usingNS = `//*[local-name()='${name}' and namespace-uri()='${this._namespace}']`;
        return SelectNS(usingNS, this._document);
    }
    private selectUsingPrefix(name: string): Element[] {
        let usingPrefix = `//*[local-name()='${name}' and starts-with(name(), '${this._prefix}')]`;
        return SelectNS(usingPrefix, this._document);
    }

}
