
module Helpers {


    function MatchBrackets(str: string) {
        return str.match(/([^/[]*)\[(.*)\]$/);
    }

    export function FetchLabelText(text: string) {
        // Some of the labels have brackets at the end, ex. Assets [Abstract],
        // which we won't want to display for the output
        let match = MatchBrackets(text);
        if (match) {
            return match[1].trim();
        }
        return text;
    }
    export function FetchLabelType(text: string) {
        let match = MatchBrackets(text);
        if (match) {
            return match[2].trim().toLowerCase();
        }
        return text;
    }



    export function GetAttributes(element: Element) {
        let namespaces = new Map<string, string>();

        for (let i = 0; i < element.attributes.length; i++) {
            let attr = element.attributes[i];

            if ('xmlns' === attr.prefix && !namespaces.has(attr.localName)) {
                namespaces.set(attr.localName, attr.value);
            }
        }
        return namespaces;
    }


}


export default Helpers;

