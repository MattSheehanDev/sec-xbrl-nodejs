
export namespace Schema {


    export function ParseElements(data: string) {
        
    }



    export class ImportNode {

        public readonly namespace: string;
        public readonly schemaLocation: string;

        constructor(element: Element, ns: Map<string, string>) {
            this.namespace = element.getAttributeNS(null, 'namespace');
            this.schemaLocation = element.getAttributeNS(null, 'schemaLocation');
        }
    }



    // Elements can be 'Abstract', 'Member', or a value
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
            let abstract = element.getAttributeNS(null, 'abstract');
            this.abstract = abstract === 'true';

            this.id = element.getAttributeNS(null, 'id');       // us-gaap_nodeID
            this.name = element.getAttributeNS(null, 'name');   // nodeID

            let nillable = element.getAttributeNS(null, 'nillable');
            this.nillable = nillable === 'true';

            this.substitutionGroup = element.getAttributeNS(null, 'substitutionGroup');     // xbrl:item,...
            this.type = element.getAttributeNS(null, 'type');   // nonnum:domainitemType,...


            // instant, duration (you cannot add 'instant' values to 'duration' values)
            this.periodType = element.getAttributeNS(ns.get('xbrli'), 'periodType');
            this.balance = element.getAttributeNS(ns.get('xbrli'), 'balance');
        }

    }



    export class LabelNode {

        public readonly label: string;          // lab_elementname
        public readonly role: string;
        public readonly type: string;
        public readonly lang: string;

        public readonly elementName: string;
        public readonly text: string;

        constructor(element: Element) {
            let xlinkNS = 'http://www.w3.org/1999/xlink';

            this.label = element.getAttributeNS(xlinkNS, 'label');
            this.role = element.getAttributeNS(xlinkNS, 'role');
            this.type = element.getAttributeNS(xlinkNS, 'type');
            this.lang = element.getAttributeNS(null, 'lang');              // ?? what is this namespace

            this.elementName = this.label.substring('lab_'.length);
            this.text = element.firstChild.nodeValue;
        }

    }


    // export class InstanceItem {
    //     namespaceURI: 'http://www.xbrl.org/2003/instance'
    //     type: string;
    //     periodType: string;
    // }
    // export class MonetaryItem extends InstanceItem {
    //     type: 'monetaryItemType';
    //     balance: string;                // credit | debit
    // }


    // export class NonNumItem {
    //     namespaceURI: ''
    // }
    // export class DomainItem {
    //     type: 'domainItemType';
    // }

}
