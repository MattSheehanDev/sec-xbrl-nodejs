

export default class ContextNode {

    public id: string;
    public period: InstantContextPeriod | DurationContextPeriod;
    public segment: boolean;

    constructor(element: Element, xbrlNS: string) {
        this.id = element.getAttributeNS(null, 'id');
        this.period = null;
        this.segment = false;


        for (let i = 0; i < element.childNodes.length; i++) {
            let child = element.childNodes.item(i);

            if (child.localName === 'entity') {
                for (let i = 0; i < child.childNodes.length; i++) {
                    let n = child.childNodes.item(i);

                    if (n.localName === 'segment') {
                        this.segment = true;
                        break;
                    }
                }
            }
            else if (child.localName === 'period') {
                let instant: string;
                let start: string;
                let end: string;

                for (let i = 0; i < child.childNodes.length; i++) {
                    let n = child.childNodes.item(i);

                    if (n.localName === 'instant') {
                        instant = n.firstChild.nodeValue;
                    }
                    else if (n.localName === 'startDate') {
                        start = n.firstChild.nodeValue;
                    }
                    else if (n.localName === 'endDate') {
                        end = n.firstChild.nodeValue;
                    }                    
                }

                if (instant) {
                    this.period = new InstantContextPeriod(instant);
                }
                else {
                    this.period = new DurationContextPeriod(start, end);
                }
            }
        }
    }
}



export class InstantContextPeriod {

    public type: 'instant';
    public instant: Date;
    
    constructor(instant: string) {
        this.type = 'instant';
        this.instant = new Date(instant);
    }
}
export class DurationContextPeriod {

    public type: 'duration';
    public start: Date;
    public end: Date;

    constructor(start: string, end: string) {
        this.type = 'duration';
        this.start = new Date(start);
        this.end = new Date(end);
    }
}