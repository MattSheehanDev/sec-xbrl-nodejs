
export namespace XS {


    export class ImportNode {

        public readonly namespace: string;
        public readonly schemaLocation: string;

        constructor(element: Element) {
            this.namespace = element.getAttribute('namespace');
            this.schemaLocation = element.getAttribute('schemaLocation');
        }
    }




    export class ElementNode {

        public readonly abstract: boolean;
        public readonly id: string;
        public readonly name: string;
        public readonly nillable: boolean;
        public readonly substitutionGroup: string;
        public readonly type: string;

        public readonly periodType: string;
        public readonly balance: string;

        constructor(element: Element, ns: Map<string, string>) {
            let abstract = element.getAttribute('abstract');
            this.abstract = abstract === 'true';

            this.id = element.getAttribute('id');       // us-gaap_nodeID
            this.name = element.getAttribute('name');   // nodeID

            let nillable = element.getAttribute('nillable');
            this.nillable = nillable === 'true';

            this.substitutionGroup = element.getAttribute('substitutionGroup');     // xbrl:item,...
            this.type = element.getAttribute('type');   // nonnum:domainitemType,...


            // instant, duration (you cannot add 'instant' values to 'duration' values)
            this.periodType = element.getAttributeNS(ns.get('xbrli'), 'periodType');
            this.balance = element.getAttributeNS(ns.get('xbrli'), 'balance');
        }

    }


    export class InstanceItem {
        namespaceURI: 'http://www.xbrl.org/2003/instance'
        type: string;
        periodType: string;
    }
    export class MonetaryItem extends InstanceItem {
        type: 'monetaryItemType';
        balance: string;                // credit | debit
    }


    export class NonNumItem {
        namespaceURI: ''
    }
    export class DomainItem {
        type: 'domainItemType';
    }

}
