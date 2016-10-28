import { DOMParser } from 'xmldom';
import xpath = require('xpath');


class TenQ {

    private _document: Document;
    private _year: number;
    private _quarter: number;

    constructor(xml: string, year: number, quarter: number) {
        let dom = new DOMParser();
        this._document = dom.parseFromString(xml);
        this._year = year;
        this._quarter = quarter;
    }

}

