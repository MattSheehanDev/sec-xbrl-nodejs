
export default class DeiNode {

    public readonly value: string;

    public readonly contextRef: string;
    public readonly id: string;


    public readonly year: number;
    public readonly quarter: number;

    public readonly member: boolean;


    constructor(element: Element) {
        this.value = element.firstChild.nodeValue;// (<any>element.firstChild).data;

        this.contextRef = element.getAttributeNS(null, 'contextRef');
        this.id = element.getAttributeNS(null, 'id');


        this.year = null;
        this.quarter = null;

        if (this.contextRef) {
            let match: RegExpMatchArray;

            // check if this is a root context or one of the 'axis' ones
            let parts = this.contextRef.split('_');
            let context = parts[0];
            let axis = parts[1];

            this.member = parts[1] ? true : false;


            // ex. cvs 2015,2014
            if (match = context.match(/^(?:FD|FI)(\d{4})Q(\d{1})(YTD)?$/i)) {
                this.year = parseInt(match[1]);
                this.quarter = parseInt(match[2]);
            }
            // ex. cvs 2013
            else if (match = context.match(/^(?:D|I)(\d{4})Q(\d{1})(YTD)?$/i)) {
                this.year = parseInt(match[1]);
                this.quarter = parseInt(match[2]);
            }
            else if (match = context.match(/^d(\d{4})$/i)) {
                this.year = parseInt(match[1]);
                // quarter??
            }
            else if (match = context.match(/^d(\d{4})q(\d{1})(ytd)?$/i)) {
                this.year = parseInt(match[1]);
                this.quarter = parseInt(match[2]);
            }
        }
    }

}
